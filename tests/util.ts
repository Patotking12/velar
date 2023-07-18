import { Chain, Tx, TxReceipt, types } from 'https://deno.land/x/clarinet@v1.5.4/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { deployer, addresses, protocol_fee, swap_fee, rev_share } from './contants.ts';

type Big = number|string

const {
  token_x,
  token_y,
  wstx,
  lp_token,
} = addresses

export const initRevShare = (chain: Chain) => {
  // need to set rev-share to dummy contract
  chain.mineBlock([
    Tx.contractCall('core', 'set-rev-share', [types.principal(`${deployer}.dummy`)], deployer)
  ])
}

export const fee = (num: number, den: number) =>
    types.tuple({
        num: types.uint(num),
        den: types.uint(den),
    })

export const check = (exp: number, rec: TxReceipt) => rec.result.expectOk().expectUint(exp)

export const checkTupleResult = (rec: TxReceipt, exp: Object, i?: number) => checkTuple(rec.result, exp, i)
export const checkTupleOk     = (rec: TxReceipt, exp: object, i?: number) => {
  const tup = rec.result.expectOk()
  checkTuple(tup, exp, i)
}
export const checkTuple       = (tuple: TxReceipt, exp: Object, i?: number) => {
    const tup = tuple.expectTuple()
    try {
      Object.entries(exp).forEach(([k, v]) =>
        tup[k].expectUint(v))
    } catch(e) {
      console.error(i, e.message)
    }
}

export const checkErr = (rec: TxReceipt) => rec.result
    .expectErr()

export const n = (zeros: number) => `1${'0'.repeat(zeros)}`

export const mintVelar = (user: string, amt: number) => mintToken('velar', amt, user)
// mintable wstx is not sip-010 compatible
// export const mintWSTX  = (user: string, amt: number) => Tx.transferStx(amt, user, deployer)
export const mintWSTX  = (user: string, amt: number) =>
  Tx.contractCall('wstx', 'transfer', [
      types.uint(amt),
      types.principal(deployer),
      types.principal(user),
      types.none(),
    ], deployer)
export const mintToken = (token: string, amt: Big, to: string) =>
  Tx.contractCall(token, "mint", [types.uint(amt), types.principal(to)], deployer)

export const createTestPair = () =>
  Tx.contractCall("core", "create", [
    types.principal(token_x),
    types.principal(token_y),
    types.principal(lp_token),
    swap_fee,
    protocol_fee,
    rev_share,
], deployer)


export const createTestPairWithProtocolFee = (protocolFee: number[]) =>
  Tx.contractCall("core", "create", [
    types.principal(token_x),
    types.principal(token_y),
    types.principal(lp_token),
    swap_fee,
    fee(...protocolFee),
    rev_share,
], deployer)

export const createWSTXPair = () =>
  Tx.contractCall("core", "create", [
    types.principal(token_x),
    types.principal(wstx),
    types.principal(lp_token),
    swap_fee,
    protocol_fee,
    rev_share,
], deployer)


export const depositTestPair = (amtX: Big, amtY: Big, from: string) =>
  Tx.contractCall("core", "mint", [
    types.uint(1),
    types.principal(token_x),
    types.principal(token_y),
    types.principal(lp_token),
    types.uint(amtX),
    types.uint(amtY),
  ],
  from)

  export const depositWSTXPair = (amtX: Big, amtY: Big, from: string) =>
  Tx.contractCall("core", "mint", [
    types.uint(1),
    types.principal(token_x),
    types.principal(wstx),
    types.principal(lp_token),
    types.uint(amtX),
    types.uint(amtY),
], from)

