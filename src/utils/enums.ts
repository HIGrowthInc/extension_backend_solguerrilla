export enum ActivityType {
    Transfer = 'Transfer',
    Staked = 'Staked',
    Unstaked = 'Unstaked',
    Betted = 'Betted',
}

export enum NetworkType {
    ETH = 'Ethereum',
    SOL = 'Solana',
    ADA = 'Cardano',
    POLYGON = 'Polygon',
}

export enum ServiceType {
    Cron = 'Cron',
    PastEvent = 'PastEvent',
    Contract = 'Contract',
}
export enum BattleStatus {
    Created = 'Created',
    RequestRandomWords = 'RequestRandomWords',
    Fulfilled = 'Fulfilled',
    Finalized = 'Finalized',
    RefundSet = 'Refund',
    Determine = 'Determine',
}

export enum RewardType {
    ABP,
    ETH,
}
