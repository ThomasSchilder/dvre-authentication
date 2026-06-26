import { EthereumProvider, TokenPayload } from './types';

export const CHAIN_ID = 1811;
const TOKEN_LIFETIME_SECONDS = 8 * 60 * 60;

function base64urlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function createToken(
  ethereum: EthereumProvider
): Promise<string> {
  const accounts = (await ethereum.request({
    method: 'eth_requestAccounts'
  })) as string[];

  if (!accounts || accounts.length === 0) {
    throw new Error('No Ethereum account available');
  }

  const address = accounts[0];
  const now = Math.floor(Date.now() / 1000);

  const payload: TokenPayload = {
    sub: address,
    chain_id: CHAIN_ID,
    iat: now,
    exp: now + TOKEN_LIFETIME_SECONDS
  };

  const payloadString = JSON.stringify(payload);

  const signature = (await ethereum.request({
    method: 'personal_sign',
    params: [payloadString, address]
  })) as string;

  return base64urlEncode(payloadString) + '.' + base64urlEncode(signature);
}
