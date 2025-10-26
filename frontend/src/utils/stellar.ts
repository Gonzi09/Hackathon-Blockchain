// src/utils/stellar.ts

import * as StellarSdk from '@stellar/stellar-sdk';
import { hexToBytes } from '../lib/crypto';

import { 
  CONTRACT_ID, 
  NETWORK_PASSPHRASE, 
  RPC_URL, 
  STROOP_MULTIPLIER 
} from '../config/constants';

export const server = new StellarSdk.SorobanRpc.Server(RPC_URL);

export function usdToStroops(usdAmount: number): bigint {
  return BigInt(Math.floor(usdAmount * STROOP_MULTIPLIER));
}

export function stroopsToUsd(stroops: bigint): number {
  return Number(stroops) / STROOP_MULTIPLIER;
}

/**
 * Create a new project
 */
export async function createProject(
  ownerAddress: string,
  goalAmount: number,
  milestoneAmounts: number[],
  milestoneDeadlines: number[]
): Promise<{ hash: string; status: string }> {
  
  const account = await server.getAccount(ownerAddress);
  const contract = new StellarSdk.Contract(CONTRACT_ID);

  const goalStroops = usdToStroops(goalAmount);
  const milestoneStroops = milestoneAmounts.map(a => usdToStroops(a));

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'create_project',
        StellarSdk.Address.fromString(ownerAddress).toScVal(),
        StellarSdk.nativeToScVal(goalStroops, { type: 'i128' }),
        StellarSdk.nativeToScVal(milestoneStroops, { type: 'Vec' }),
        StellarSdk.nativeToScVal(milestoneDeadlines, { type: 'Vec' })
      )
    )
    .setTimeout(300)
    .build();

  const prepared = await server.prepareTransaction(transaction);
  
  // Sign with Freighter
  const { signTransaction } = await import('@stellar/freighter-api');
  const { signedTxXdr } = await signTransaction(prepared.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  return await submitTransaction(signedTxXdr);
}

/**
 * Invest in a project
 */
export async function buildInvestmentTransaction(
  userAddress: string,
  amountUsd: number,
  projectId: number = 1
): Promise<any> {
  
  const account = await server.getAccount(userAddress);
  const amountStroops = usdToStroops(amountUsd);
  const contract = new StellarSdk.Contract(CONTRACT_ID);

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'invest',
        // StellarSdk.nativeToScVal(projectId, { type: 'u32' }),
        StellarSdk.Address.fromString(userAddress).toScVal(),
        StellarSdk.nativeToScVal(amountStroops, { type: 'i128' })
      )
    )
    .setTimeout(300)
    .build();

  const preparedTransaction = await server.prepareTransaction(transaction);
  return preparedTransaction;
}

/**
 * Submit evidence for a milestone
 */
export async function submitEvidence(
  ownerAddress: string,
  projectId: number,
  milestoneIndex: number,
  evidenceHash: string
): Promise<{ hash: string; status: string }> {
  
  const account = await server.getAccount(ownerAddress);
  const contract = new StellarSdk.Contract(CONTRACT_ID);

  const hashBytes = hexToBytes(evidenceHash);

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'submit_evidence',
        StellarSdk.nativeToScVal(projectId, { type: 'u32' }),
        StellarSdk.nativeToScVal(milestoneIndex, { type: 'u32' }),
        StellarSdk.xdr.ScVal.scvBytes(hashBytes)
      )
    )
    .setTimeout(300)
    .build();

  const prepared = await server.prepareTransaction(transaction);
  
  const { signTransaction } = await import('@stellar/freighter-api');
  const { signedTxXdr } = await signTransaction(prepared.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  return await submitTransaction(signedTxXdr);
}

/**
 * Verify a milestone (verifier only)
 */
export async function verifyMilestone(
  verifierAddress: string,
  projectId: number,
  milestoneIndex: number,
  approved: boolean
): Promise<{ hash: string; status: string }> {
  
  const account = await server.getAccount(verifierAddress);
  const contract = new StellarSdk.Contract(CONTRACT_ID);

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'verify_milestone',
        StellarSdk.nativeToScVal(projectId, { type: 'u32' }),
        StellarSdk.nativeToScVal(milestoneIndex, { type: 'u32' }),
        StellarSdk.nativeToScVal(approved, { type: 'bool' })
      )
    )
    .setTimeout(300)
    .build();

  const prepared = await server.prepareTransaction(transaction);
  
  const { signTransaction } = await import('@stellar/freighter-api');
  const { signedTxXdr } = await signTransaction(prepared.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  return await submitTransaction(signedTxXdr);
}

/**
 * Submit transaction to network
 */
export async function submitTransaction(
  signedXdr: string
): Promise<{ hash: string; status: string }> {
  
  const transaction = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    NETWORK_PASSPHRASE
  );

  try {
    const result = await server.sendTransaction(transaction as any);
    
    let status = result.status;
    let attempts = 0;
    const maxAttempts = 20;

    while (status === 'PENDING' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const txResult = await server.getTransaction(result.hash);
      status = txResult.status;
      attempts++;
    }

    return {
      hash: result.hash,
      status: status,
    };
  } catch (error) {
    console.error('Transaction submission error:', error);
    throw error;
  }
}

/**
 * Get project from blockchain
 */
export async function getProject(projectId: number): Promise<any> {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    
    const dummyAccount = await server.getAccount(
      'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'
    );

    const transaction = new StellarSdk.TransactionBuilder(dummyAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'get_project',
          StellarSdk.nativeToScVal(projectId, { type: 'u32' })
        )
      )
      .setTimeout(300)
      .build();

    const simulated = await server.simulateTransaction(transaction);
    
    if (StellarSdk.SorobanRpc.Api.isSimulationSuccess(simulated)) {
      return simulated.result?.retval;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export async function getTotalInvested(): Promise<number> {
  return getProjectRaised(1);
}

export async function getProjectRaised(projectId: number): Promise<number> {
  try {
    const project = await getProject(projectId);
    if (project) {
      const raised = StellarSdk.scValToBigInt(project);
      return stroopsToUsd(raised);
    }
    return 0;
  } catch (error) {
    console.error('Error fetching raised amount:', error);
    return 0;
  }
}

export async function getInvestorAmount(investorAddress: string, projectId: number = 1): Promise<number> {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    
    const dummyAccount = await server.getAccount(
      'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'
    );

    const transaction = new StellarSdk.TransactionBuilder(dummyAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'get_investor_amount',
          StellarSdk.nativeToScVal(projectId, { type: 'u32' }),
          StellarSdk.Address.fromString(investorAddress).toScVal()
        )
      )
      .setTimeout(300)
      .build();

    const simulated = await server.simulateTransaction(transaction);
    
    if (StellarSdk.SorobanRpc.Api.isSimulationSuccess(simulated)) {
      const result = simulated.result?.retval;
      if (result) {
        const stroops = StellarSdk.scValToBigInt(result);
        return stroopsToUsd(stroops);
      }
    }
    
    return 0;
  } catch (error) {
    console.error('Error fetching investor amount:', error);
    return 0;
  }
}