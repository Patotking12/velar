
import { Clarinet, Tx, Chain, Account, types, EmptyBlock } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

export const deployer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'

export const swap_fee = types.tuple({
  num: types.uint(997),
  den: types.uint(1_000)
})

export const protocol_fee = types.tuple({
  num: types.uint(30),
  den: types.uint(10_000)
})

export const rev_share = types.tuple({
  num: types.uint(0),
  den: types.uint(1)
})

export const addresses = {
  core            : `${deployer}.core`,
  staking         : `${deployer}.staking`,
  distributor     : `${deployer}.distributor`,
  token_x         : `${deployer}.token-x`,
  token_y         : `${deployer}.token-y`,
  token_z         : `${deployer}.token-z`,
  lp_token        : `${deployer}.lp-token-1`,
  lp_token_not_ft : `${deployer}.lp-token-not-ft`,
  wstx            : `${deployer}.wstx`,
  velar            : `${deployer}.velar`,
  // rev_too         : `${deployer}.distributor`,
  rev_too         : `${deployer}.dummy`,
}

export const tokens = {
  token_x_id  : `.token-x.token-x`,
  token_y_id  : `.token-y.token-y`,
  lp_token_id : `.lp-token-1.lp-token`,
}
