"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSolanaConfigs = exports.getSolanaRPC = exports.getDBConfig = exports.JWT_CONFIG = exports.REDIS_CONFIG = void 0;
exports.REDIS_CONFIG = {
    HOST: 'redis://127.0.0.1:6379'
};
exports.JWT_CONFIG = {
    secret: process.env.JWT_SECRET || '6d4fd1034a81f2f98db778237bc71a60',
    algorithms: ['HS256'],
};
const getDBConfig = () => {
    const NETWORK = process.env.NETWORK || 'goerli';
    if (NETWORK === 'mainnet') {
        return process.env.PROD_DB_CONFIG;
    }
    return process.env.DB_CONFIG;
};
exports.getDBConfig = getDBConfig;
const getSolanaRPC = () => {
    const NETWORK = process.env.NETWORK || 'devnet';
    if (NETWORK === 'mainnet') {
        return process.env.SOLANA_RPC_MAINNET || 'https://solana-api.projectserum.com';
    }
    return process.env.SOLANA_RPC_DEVNET || 'https://api.devnet.solana.com';
};
exports.getSolanaRPC = getSolanaRPC;
const getSolanaConfigs = () => {
    const NETWORK = process.env.NETWORK || 'devnet';
    if (NETWORK === 'mainnet') {
        return {
            PROGRAM_ID: process.env.programId_main,
            STAKE_POOL_ID: process.env.stakePoolId_main,
            ABP_MINT_PUBKEY: process.env.abpMintPubkey_main,
            SUPER_ADMIN: process.env.SUPER_ADMIN_main,
        };
    }
    return {
        PROGRAM_ID: process.env.programId_dev,
        STAKE_POOL_ID: process.env.stakePoolId_dev,
        ABP_MINT_PUBKEY: process.env.abpMintPubkey_dev,
        SUPER_ADMIN: process.env.SUPER_ADMIN_dev,
    };
};
exports.getSolanaConfigs = getSolanaConfigs;
//# sourceMappingURL=config.js.map