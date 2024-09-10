export const VERIFICATION_BLOCK_CONFIRMATIONS = 10;

export function isLocalEnv(envName: string) {
    return !!(
        {
            hardhat: true,
            localhost: true,
        } as Record<string, true>
    )[envName];
}

export function isHardhatEnv(envName: string) {
    return !!(
        {
            hardhat: true,
        } as Record<string, true>
    )[envName];
}