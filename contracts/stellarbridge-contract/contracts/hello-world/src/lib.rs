#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Vec, BytesN, token, log};

#[contracttype]
#[derive(Clone, PartialEq)]
pub enum MilestoneStatus {
    Pending,
    EvidenceSubmitted,
    Verified,
    Rejected,
}

#[contracttype]
#[derive(Clone)]
pub struct Milestone {
    pub amount: i128,
    pub deadline: u64,
    pub status: MilestoneStatus,
    pub evidence_hash: Option<BytesN<32>>,
}

#[contracttype]
#[derive(Clone)]
pub struct Project {
    pub id: u32,
    pub owner: Address,
    pub goal_amount: i128,
    pub raised: i128,
    pub milestones: Vec<Milestone>,
    pub active: bool,
}

#[contracttype]
#[derive(Clone)]
pub struct Investment {
    pub investor: Address,
    pub amount: i128,
    pub timestamp: u64,
}

#[contracttype]
pub enum DataKey {
    ProjectCounter,
    Project(u32),
    ProjectInvestments(u32),
    InvestorAmount(u32, Address),
    Verifier,
    Token,
}

#[contract]
pub struct StellarBridgeContract;

#[contractimpl]
impl StellarBridgeContract {
    
    pub fn initialize(env: Env, verifier: Address, token: Address) {
        if env.storage().instance().has(&DataKey::Verifier) {
            panic!("Already initialized");
        }
        verifier.require_auth();
        env.storage().instance().set(&DataKey::Verifier, &verifier);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::ProjectCounter, &0u32);
        log!(&env, "Initialized");
    }
    
    pub fn create_project(env: Env, owner: Address, goal_amount: i128, milestone_amounts: Vec<i128>, milestone_deadlines: Vec<u64>) -> u32 {
        owner.require_auth();
        if milestone_amounts.len() != milestone_deadlines.len() {
            panic!("Mismatch");
        }
        
        let mut milestones: Vec<Milestone> = Vec::new(&env);
        for i in 0..milestone_amounts.len() {
            milestones.push_back(Milestone {
                amount: milestone_amounts.get(i).unwrap(),
                deadline: milestone_deadlines.get(i).unwrap(),
                status: MilestoneStatus::Pending,
                evidence_hash: None,
            });
        }
        
        let mut counter: u32 = env.storage().instance().get(&DataKey::ProjectCounter).unwrap_or(0);
        counter += 1;
        
        let project = Project {
            id: counter,
            owner: owner.clone(),
            goal_amount,
            raised: 0,
            milestones,
            active: true,
        };
        
        env.storage().instance().set(&DataKey::Project(counter), &project);
        env.storage().instance().set(&DataKey::ProjectCounter, &counter);
        log!(&env, "Project created");
        counter
    }
    
    pub fn invest(env: Env, project_id: u32, investor: Address, amount: i128) {
        investor.require_auth();
        let mut project: Project = env.storage().instance().get(&DataKey::Project(project_id)).expect("Not found");
        if !project.active || amount <= 0 { panic!("Invalid"); }
        
        let token: Address = env.storage().instance().get(&DataKey::Token).expect("No token");
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&investor, &env.current_contract_address(), &amount);
        
        project.raised += amount;
        env.storage().instance().set(&DataKey::Project(project_id), &project);
        
        let key = DataKey::InvestorAmount(project_id, investor.clone());
        let current: i128 = env.storage().instance().get(&key).unwrap_or(0);
        env.storage().instance().set(&key, &(current + amount));
        
        let inv_key = DataKey::ProjectInvestments(project_id);
        let mut invs: Vec<Investment> = env.storage().instance().get(&inv_key).unwrap_or(Vec::new(&env));
        invs.push_back(Investment { investor, amount, timestamp: env.ledger().timestamp() });
        env.storage().instance().set(&inv_key, &invs);
        log!(&env, "Investment");
    }
    
    pub fn submit_evidence(env: Env, project_id: u32, milestone_index: u32, evidence_hash: BytesN<32>) {
        let mut project: Project = env.storage().instance().get(&DataKey::Project(project_id)).expect("Not found");
        project.owner.require_auth();
        if milestone_index >= project.milestones.len() { panic!("Invalid"); }
        
        let mut m = project.milestones.get(milestone_index).unwrap();
        if m.status != MilestoneStatus::Pending { panic!("Not pending"); }
        
        m.evidence_hash = Some(evidence_hash);
        m.status = MilestoneStatus::EvidenceSubmitted;
        project.milestones.set(milestone_index, m);
        env.storage().instance().set(&DataKey::Project(project_id), &project);
        log!(&env, "Evidence");
    }
    
    pub fn verify_milestone(env: Env, project_id: u32, milestone_index: u32, approved: bool) {
        let verifier: Address = env.storage().instance().get(&DataKey::Verifier).expect("No verifier");
        verifier.require_auth();
        
        let mut project: Project = env.storage().instance().get(&DataKey::Project(project_id)).expect("Not found");
        if milestone_index >= project.milestones.len() { panic!("Invalid"); }
        
        let mut m = project.milestones.get(milestone_index).unwrap();
        if m.status != MilestoneStatus::EvidenceSubmitted { panic!("No evidence"); }
        
        if approved {
            m.status = MilestoneStatus::Verified;
            let token: Address = env.storage().instance().get(&DataKey::Token).expect("No token");
            let token_client = token::Client::new(&env, &token);
            token_client.transfer(&env.current_contract_address(), &project.owner, &m.amount);
            log!(&env, "Verified");
        } else {
            m.status = MilestoneStatus::Rejected;
            log!(&env, "Rejected");
        }
        
        project.milestones.set(milestone_index, m);
        env.storage().instance().set(&DataKey::Project(project_id), &project);
    }
    
    pub fn get_project(env: Env, project_id: u32) -> Project {
        env.storage().instance().get(&DataKey::Project(project_id)).expect("Not found")
    }
    
    pub fn get_investor_amount(env: Env, project_id: u32, investor: Address) -> i128 {
        env.storage().instance().get(&DataKey::InvestorAmount(project_id, investor)).unwrap_or(0)
    }
    
    pub fn get_project_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::ProjectCounter).unwrap_or(0)
    }
}