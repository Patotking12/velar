

import { Clarinet, Tx, Chain, Account, types, EmptyBlock, TxReceipt } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { checkTupleResult, n, fee } from './util.ts';
import { deployer } from './contants.ts';

type Big = number|string

const calcMint = (chain, amt0: Big, amt1: Big, reserve0: Big, reserve1: Big, totalSupply: Big) =>
    chain.callReadOnlyFn("core", "calc-mint", [
        types.uint(amt0),
        types.uint(amt1),
        types.uint(reserve0),
        types.uint(reserve1),
        types.uint(totalSupply),
    ], deployer)

const calcBurn = (chain, liquidity: Big, reserve0: Big, reserve1: Big, totalSupply: Big) =>
    chain.callReadOnlyFn("core", "calc-burn", [
        types.uint(liquidity),
        types.uint(reserve0),
        types.uint(reserve1),
        types.uint(totalSupply),
    ], deployer)
    
  const calcSwap = (chain, amtIn: Big, swapFee: number[], protocolFee: number[], revShare: number[]) =>
    chain.callReadOnlyFn("core", "calc-swap", [
        types.uint(amtIn),
        fee(swapFee[0], swapFee[1]),
        fee(protocolFee[0], protocolFee[1]),
        fee(revShare[0], revShare[1]),
    ], deployer)

const check = (exp: Big, rec: TxReceipt) => rec.result.expectUint(exp)

// --------

Clarinet.test({
    name: "calc-mint : inital mint ...",
    async fn(chain: Chain) {

        let tests = [
            [[1, 1, 0, 0, 0], 1],
            [[n(15), n(15), 0, 0, 0], n(15)],
            [[n(18), n(18), 0, 0, 0], n(18)], // max
            // [[n(21), n(21), 0, 0, 0], owerflow],
        ]

        let res = tests.map(([inputs]) => calcMint(chain, ...inputs))
        tests.map(([, exp], i) => check(exp, res[i]))
    },
});

Clarinet.test({
    name: "calc-mint : non-initial mint ...",
    async fn(chain: Chain) {

        let tests = [
            [[1, 1, 1, 1, 1], 1],
            // ?
            [[n(18), n(18), 1_000, 1_000, 1_000], n(18)],
            [[n(18), n(18), 10_000, 10_000, 1_000], n(17)],
            // ?
            [[n(18), n(18), n(37), n(37), 1_000_000], 0],
            [[n(18), n(18), n(37), n(37), n(20)], 10],
            // [[n(18), n(18), n(37), n(37), n(21)], overflow],
            [[n(18), n(18), n(20), n(20), n(20)], n(18)],
        ]

        let res = tests.map(([inputs]) => calcMint(chain, ...inputs))
        tests.map(([, exp], i) => check(exp, res[i]))
    },
})

Clarinet.test({
    name: "calc-burn : ...",
    async fn(chain: Chain) {

        // contraints:
        // liquidity * reserve0 & liquidity * reserve1
        // totalSupply > 0
        let tests = [
            [[1, 0, 0, 1], { amt0: 0, amt1: 0 }],
            [[10, 100, 100, 100], { amt0: 10, amt1: 10 }],
            // NOTE: returns more than totalSupply
            [[n(18), n(15), n(15), n(15)], { amt0: n(18), amt1: n(18) }],
            [[100, 1_000, 100_000, 1_000], { amt0: 100, amt1: 10_000 }],
            // [[n(18), n(21), n(19), 1_000], overflow],
          ]

          let res = tests.map(([inputs]) => calcBurn(chain, ...inputs))
          tests.map(([, exp], i) => checkTupleResult(res[i], exp))
      }
})

Clarinet.test({
  name: "calc-swap : ...",
  async fn(chain: Chain) {

      const defaultFee = [997, 1_000]
      const defaultFee1 = [30, 10_000]
      const defaultFee2 = [50, 100]

      // amt-total = swap-fee of in
      // amt-protocol = protocol-fee of amt-total
      // amt-lps = amt-total - amt-protocol
      // amt-share = fee-share of amt-protocol 
      // amt-rest (revenue) = amt-protocol - amt-share
      let tests = [
          [[1000, defaultFee, defaultFee1, defaultFee2], {
            'amt-in-adjusted' : 997,
            'amt-fee-lps'     : 3,
            'amt-fee-protocol': 0,
            'amt-fee-share'   : 0,
            'amt-fee-rest'    : 0,      
          }],
          [[1_000_000, defaultFee, defaultFee1, defaultFee2], {
            'amt-in-adjusted' : 997_000,
            'amt-fee-lps'     : 2_991,
            'amt-fee-protocol': 9,
            'amt-fee-share'   : 4,
            'amt-fee-rest'    : 5,
          }],
          [[1_000_000_000, defaultFee, defaultFee1, defaultFee2], {
            'amt-in-adjusted' : 997_000_000,
            'amt-fee-lps'     : 2_991_000,
            'amt-fee-protocol': 9_000,
            'amt-fee-share'   : 4_500,
            'amt-fee-rest'    : 4_500,
          }],
          [[100_000, defaultFee, [30, 1_000], [0,1]], {
            'amt-in-adjusted' : 99_700,
            'amt-fee-lps'     : 291,
            'amt-fee-protocol': 9,
            'amt-fee-share'   : 0,
            'amt-fee-rest'    : 9,
          }],
          [[10_000, defaultFee, [1,1], [1,1]], {
            'amt-in-adjusted' : 9970,
            'amt-fee-lps'     : 0,
            'amt-fee-protocol': 30,
            'amt-fee-share'   : 30,
            'amt-fee-rest'    : 0,
          }],
          [[10_000, defaultFee, [0,1], [0,1]], {
            'amt-in-adjusted' : 9970,
            'amt-fee-lps'     : 30,
            'amt-fee-protocol': 0,
            'amt-fee-share'   : 0,
            'amt-fee-rest'    : 0,
          }],
        ]

        let res = tests.map(([inputs]) => calcSwap(chain, ...inputs))
        tests.map(([, exp], i) => checkTupleResult(res[i], exp, i))
    }
})
