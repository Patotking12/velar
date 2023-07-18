
import { Clarinet, Tx, Chain, Account, types, EmptyBlock } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { swap_fee } from './contants.ts';
import { n, check, checkErr, fee } from './util.ts'

const deployer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'

// const err_library_preconditions = 0

const quote = (chain: Chain, amtIn: number, reserveIn: number, reserveOut: number) =>
    chain.callReadOnlyFn('library', 'quote', [
        types.uint(amtIn),
        types.uint(reserveIn),
        types.uint(reserveOut)
    ], deployer)

const getAmountOut = (chain: Chain, amtIn: number, reserveIn: number, reserveOut: number) =>
    chain.callReadOnlyFn('library', 'get-amount-out', [
        types.uint(amtIn),
        types.uint(reserveIn),
        types.uint(reserveOut),
        swap_fee,
  ], deployer)

const getAmountsOut = (amtIn: number, root: string, path: string[]) =>
    Tx.contractCall('library', 'get-amounts-out', [
        types.uint(amtIn),
        types.principal(root),
        types.list(path.map(types.principal)),
    ], deployer)

const getAmountIn = (chain: Chain, amtOut: number, reserveIn: number, reserveOut: number) =>
    chain.callReadOnlyFn('library', 'get-amount-in', [
        types.uint(amtOut),
        types.uint(reserveIn),
        types.uint(reserveOut),
        swap_fee,
    ], deployer)

const getAmountInFee = (chain: Chain, amtOut: number, reserveIn: number, reserveOut: number, swapFee: number[]) =>
    chain.callReadOnlyFn('library', 'get-amount-in', [
        types.uint(amtOut),
        types.uint(reserveIn),
        types.uint(reserveOut),
        fee(swapFee[0], swapFee[1]),
    ], deployer)

// uint: 128 bits (~10**38)

Clarinet.test({
    name: "get-amount-out fails on 0-values",
    async fn(chain: Chain) {

        let results = [
            getAmountOut(chain, 0, 1000, 1000),
            getAmountOut(chain, 100, 0, 1000),
            getAmountOut(chain, 100, 1000, 0),
            // precondition (not in uniwsap): amount-id-adj < 0
            getAmountOut(chain, 1,	1000000000000000,	1000000000000000),
        ];

        assertEquals(results.length, 4)
        results.map(checkErr)
    }
})

Clarinet.test({
    name: "get-amount-out returns same values as Uniswap lib.",
    async fn(chain: Chain) {

        const tests = [
          [[1000000,	'1000000000000000000000000000000000',	1], 0],
          [[1000,	1000000000000,	1000], 0],
          [[1000,	'1000000000000000000000000000000',	1000], 0],
          [[1_000_000_000,	1_000_000_000_000_000,	1_000_000_000_000_000], 996_999_005],
          [['1000000000000000000000000000000',	'1000000000000000000000000000',	1], 0],
          [['1000000000000000000000000000',	'1000000000000000000000000000',	1], 0],
          [[1000000000000000,	1000000,	1000000], 999999],
          [[10_000,	1_000_000,	1_000_000], 9_871],
          [[2000000, n(32), n(32)], 1993999],
          [[4, 99_990_135, 100_010_103], 3],
          [[2, 2*(10**18), n(18)], 0],
          [[2, n(21), 1], 0],
          [[1000, n(20), n(20)], 996],
          [[2000, n(20), n(20)], 1_993],
          [[20000, n(20), n(20)], 19_939],
          [[200000, n(20), n(20)], 199_399],
          [[2000000, n(20), n(20)], 1_993_999],
          [[1000, 1000, 1000], 499],
          [[2000, 1000, 1000], 665],
          [[20, 100000, 1000], 0],
          [[10000, 1000, 1000], 908],
          [[n(10), n(18), 2*(10**18)], 19939999801],
        ]

        const failingTests = [
          [[2, n(18), n(18)], 1],       // 0
          [[2, n(18), 2*(10**18)], 3],  // 1
          [[20, n(20), n(20)], 19],     // 18
          [[200, n(20), n(20)], 199],   // 198
          [[10, n(20), n(20)], 9],      // 8
          [[100, n(20), n(20)], 99],    // 98
          [[300, n(20), n(20)], 299],   // 298
        ]

        let results = tests.map(([inputs]) => getAmountOut(chain, ...inputs))
        tests.map(([, exp], i) => check(exp, results[i]))

        results = failingTests.map(([inputs]) => getAmountOut(chain, ...inputs))
        failingTests.map(([, exp], i) => check(exp, results[i]))
    },
});

Clarinet.test({
    name: "get-amount-in returns same values as Uniswap lib.",
    async fn(chain: Chain) {

        const errors = [
            [[1000, 1000, 1000]],   // div-by-0
            [[2000, 1000, 1000]],   // underflow
            [[10000, 1000, 1000]],  // underflow
            [[2, n(21), 1]],        // underflow
        ]

        const tests = [
          [['1000000000000000000000000',	1000,	'1000000000000000000000000000000000'], 1],
          [['1000000000000000000',	1000,	'1000000000000000000000000'], 1],
          [['1000000000000000000',	1000000,	'1000000000000000000000000'], 2],
          [[1000,	1000000000,	'1000000000000000000000000'], 1],
          [[1000000000000,	1,	'1000000000000000000000000000000'], 1],
          [[1000,	1,	'1000000000000000000000000000000000000'], 1],
          [[1000000000,	'1000000000000000000000000000',	1000000000000000], '1003010030091273822468'],
          [[1000,	'1000000000000000000000000',	1000000000000000], 1003009027083],
          [[1000000,	1,	1000000000000000], 1],
          [[2000000, n(32), n(32)], 2006019],
          [[4, 99_990_135, 100_010_103], 5],
          [[2, n(18), n(18)], 3],
          [[2, 10**20, 10**20], 3],
          [[2, n(20), n(20)], 3],
          [[20, n(20), n(20)], 21],
          [[200, n(20), n(20)], 201],
          [[10, n(20), n(20)], 11],
          [[100, n(20), n(20)], 101],
          [[300, n(20), n(20)], 301],
          [[1000, n(20), n(20)], 1004],
          [[2000, n(20), n(20)], 2007],
          [[20000, n(20), n(20)], 20_061],
          [[200000, n(20), n(20)], 200_602],
          [[2000000, n(20), n(20)], 2_006_019],
        ]

        let results = tests.map(([inputs]) => getAmountIn(chain, ...inputs))
        tests.map(([, exp], i) => check(exp, results[i]))
  },
});

Clarinet.test({
    name: "get-amount-in fails on 0-values",
    async fn(chain: Chain) {

        let results = [
          getAmountIn(chain, 0, 1000000, 1000000),
          getAmountIn(chain, 10000000, 0, 1000000),
          getAmountIn(chain, 1000, 1000000, 0),
        ]

        results.map(checkErr)
    },
});

Clarinet.test({
    name: "quote returns same values as Uniswap lib.",
    async fn(chain: Chain) {

        const tests = [
          [['1000000000000000000', '1000000000000000000000', 1000000000000], 1000000000],
          [[1000000000000000, 1000000000000000, 1000000000000000], 1000000000000000],
          [[1000000000, 1000000000000, '1000000000000000000000000'], '1000000000000000000000'],
          [['1000000000000000000000000000000', 1000000, 1000], '1000000000000000000000000000'],
          [[1, 1000000000, '1000000000000000000'], 1000000000],
          [['1000000000000000000000000', '1000000000000000000000', 1000000], 1000000000],
          [[1, 1000000, '1000000000000000000000000000'], '1000000000000000000000'],
          [[1000000000, 1000000000000, '1000000000000000000'], 1000000000000000],
          [[1000000, 1000000, 1000000], 1000000],
          [['1000000000000000000', '1000000000000000000000000000000', 1000], 0],
        ]

        let results = tests.map(([inputs]) => quote(chain, ...inputs))
        tests.map(([, exp], i) => check(exp, results[i]))
  },
});
