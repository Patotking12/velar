import { Clarinet, Tx, types } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { stake } from './staking_test.ts';
import { checkTuple, mintVelar, mintWSTX } from './util.ts';
import { deployer, addresses, swap_fee, protocol_fee, rev_share } from './contants.ts';
const { distributor , core , wstx , velar ,  } = addresses;
const token0 = wstx;
const token1 = velar;
const INITAIL_STX = 100000000000000;
const EPOCH_LENGTH = 600;
const err_check_owner = 801;
const err_check_core = 802;
const err_distribute_preconditions = 803;
const err_distribute_postconditions = 804;
// helpers
// const range = (start: number, end: number) =>
//     Array(end).fill(1).map((_, i) => start + i)
// const checkClaimed = (chain: Chain, user: string, pool: number, blocks: number[], expect: boolean) =>
//     blocks.forEach(b => {
//         let res = hasClaimedBlock(chain, user, pool, b)
//         try {
//           res.result.expectBool(expect)
//         } catch (e) {
//           console.log(user, b)
//         }
//     })
const createPair = ()=>Tx.contractCall("core", "create", [
        types.principal(token0),
        types.principal(token1),
        types.principal(addresses.lp_token),
        swap_fee,
        protocol_fee,
        rev_share, 
    ], deployer);
const init = (chain)=>chain.mineEmptyBlock(EPOCH_LENGTH);
const setup = (chain, wallets)=>chain.mineBlock([
        // shortcut
        mintWSTX(distributor, 10_000),
        mintVelar(distributor, 10_000),
        ...wallets.map((w)=>mintVelar(w, 500_000)),
        createPair(), 
    ]);
// TODO: how to send revenue
const sendReveueAsCore = (chain, pool, isToken0, amt)=>chain.mineBlock([
        setCore(deployer, deployer),
        sendRevenue(pool, isToken0, amt, deployer), 
    ]);
// ===== API
// setters
const setOwner = (owner, sender)=>Tx.contractCall('distributor', 'set-owner', [
        types.principal(owner)
    ], sender);
const setCore = (newCore, sender)=>Tx.contractCall('distributor', 'set-core', [
        types.principal(newCore)
    ], sender);
// read-only
const mkepoch = (chain, startBlock)=>chain.callReadOnlyFn('distributor', 'mkepoch', [
        types.uint(startBlock)
    ], deployer);
const getRevenueAt = (chain, pool, block)=>chain.callReadOnlyFn('distributor', 'get-revenue-at', [
        types.uint(pool),
        types.uint(block), 
    ], deployer);
const hasClaimedBlock = (chain, user, pool, block)=>chain.callReadOnlyFn('distributor', 'has-claimed-block', [
        types.principal(user),
        types.uint(pool),
        types.uint(block), 
    ], deployer);
const calcDistribute = (chain, staked, total, revenue0, revenue1)=>chain.callReadOnlyFn('distributor', 'calc-distribute', [
        types.tuple({
            staked: types.uint(staked),
            total: types.uint(total)
        }),
        types.tuple({
            token0: types.uint(revenue0),
            token1: types.uint(revenue1)
        })
    ], deployer);
const getRewards = (chain, user, pool, startBlock)=>chain.callReadOnlyFn('distributor', 'get-rewards', [
        types.principal(user),
        types.uint(pool),
        types.uint(startBlock)
    ], deployer).result.expectTuple();
const getReward = (chain, user, pool, startBlock)=>chain.callReadOnlyFn('distributor', 'get-reward', [
        types.principal(user),
        types.uint(pool),
        types.uint(startBlock)
    ], deployer);
// NOTE: just looks at rewards..
const hasReward = (chain, user, pool, block, amts)=>chain.callReadOnlyFn('distributor', 'has-reward', [
        types.tuple({
            user: types.principal(user),
            pool: types.uint(pool),
            block: types.uint(block),
            reward: types.tuple({
                token0: types.uint(amts[0]),
                token1: types.uint(amts[1])
            })
        })
    ], deployer);
// public
const sendRevenue = (pool, isToken0, amt, sender)=>Tx.contractCall('distributor', 'send-revenue', [
        types.uint(pool),
        types.bool(isToken0),
        types.uint(amt), 
    ], sender);
const distributeBlock = (user, pool, block)=>Tx.contractCall('distributor', 'distribute-block', [
        types.principal(user),
        types.uint(pool),
        types.principal(token0),
        types.principal(token1),
        types.uint(block), 
    ], deployer);
// TODO: test
const distributeBlocks = (user, pool, blocks)=>Tx.contractCall('distributor', 'distribute-blocks', [
        types.principal(user),
        types.uint(pool),
        types.principal(token0),
        types.principal(token1),
        types.list(blocks), 
    ], deployer);
// const unstakeAndClaim = (user: string, pool: number, amt: number) =>
//     Tx.contractCall('distributor', 'unstake-and-claim', [
//         types.principal(user),
//         types.uint(pool),
//         types.principal(token0),
//         types.principal(token1),
//         types.uint(amt),
//     ], user)
// const claim = (user: string, pool: number, amt: number) =>
//     Tx.contractCall('distributor', 'claim', [
//         types.principal(user),
//         types.uint(pool),
//         types.principal(token0),
//         types.principal(token1),
//         types.uint(amt),
//     ], user)
// ===== read-only functions
// NOTE: is it necessary to have a tuple? why not just uint (blocknr)
Clarinet.test({
    name: "mkepoch: ...",
    async fn (chain) {
        let START_BLOCK = 1;
        let res = mkepoch(chain, START_BLOCK).result.expectList();
        assertEquals(res.length, EPOCH_LENGTH);
        res[0].expectUint(START_BLOCK);
        res[res.length - 1].expectUint(EPOCH_LENGTH + START_BLOCK - 1);
        START_BLOCK = EPOCH_LENGTH;
        res = mkepoch(chain, START_BLOCK).result.expectList();
        assertEquals(res.length, EPOCH_LENGTH);
        res[0].expectUint(EPOCH_LENGTH);
        res[res.length - 1].expectUint(EPOCH_LENGTH + START_BLOCK - 1);
    }
});
Clarinet.test({
    name: "calc-distribute: ...",
    async fn (chain) {
        // staked, total, rev0, rev1
        let tests = [
            [
                [
                    100,
                    1_000,
                    1_000,
                    0
                ],
                [
                    100,
                    0
                ]
            ],
            [
                [
                    900,
                    1_000,
                    100,
                    100
                ],
                [
                    90,
                    90
                ]
            ],
            [
                [
                    1_000,
                    1_000,
                    100,
                    100
                ],
                [
                    100,
                    100
                ]
            ],
            [
                [
                    1_000,
                    1_000,
                    0,
                    0
                ],
                [
                    0,
                    0
                ]
            ],
            [
                [
                    0,
                    1_000,
                    1_000,
                    1_000
                ],
                [
                    0,
                    0
                ]
            ],
            // [[1_000, 0, 1_000, 1_000], [0, 0]], // shouldn't happen
            [
                [
                    500,
                    1_000_000,
                    1_000,
                    1_000
                ],
                [
                    0,
                    0
                ]
            ],
            [
                [
                    500,
                    1_000_000,
                    10_000,
                    10_000
                ],
                [
                    5,
                    5
                ]
            ],
            [
                [
                    500,
                    1_000_000,
                    100_000,
                    100_000
                ],
                [
                    50,
                    50
                ]
            ],
            [
                [
                    500,
                    1_000_000,
                    1_000_000,
                    1_000_000
                ],
                [
                    500,
                    500
                ]
            ], 
        ];
        let res = tests.map(([input])=>calcDistribute(chain, ...input));
        res.map(({ result  }, i)=>{
            let tuple = result.expectTuple();
            tuple.token0.expectUint(tests[i][1][0]);
            tuple.token1.expectUint(tests[i][1][1]);
        });
    }
});
Clarinet.test({
    name: 'send-revenue: can only be called by core contract',
    async fn (chain, accounts) {
        const wallet_1 = accounts.get('wallet_1').address;
        let block = setup(chain, []);
        let res = chain.callReadOnlyFn('distributor', 'get-core', [], deployer);
        res.result.expectPrincipal(core);
        block = chain.mineBlock([
            sendRevenue(1, true, 100_000, deployer),
            sendRevenue(1, true, 100_000, wallet_1), 
        ]);
        block.receipts[0].result.expectErr().expectUint(err_check_core);
        block.receipts[1].result.expectErr().expectUint(err_check_core);
    }
});
Clarinet.test({
    name: "get-rewards: ...",
    async fn (chain, accounts) {
        const wallet_1 = accounts.get('wallet_1').address;
        const POOL = 1;
        let block = setup(chain, [
            wallet_1
        ]);
        // stake
        block = chain.mineBlock([
            stake(wallet_1, 500_000), 
        ]);
        sendReveueAsCore(chain, POOL, false, 10_000), chain.mineEmptyBlock(EPOCH_LENGTH / 3);
        // rewards
        sendReveueAsCore(chain, POOL, false, 5_000);
        block = chain.mineEmptyBlock(EPOCH_LENGTH / 3);
        assertEquals(block.block_height, 406);
        let res = getRewards(chain, wallet_1, POOL, 1);
        res['end-block'].expectUint(601);
        let list = res['reward-blocks'].expectList();
        let r1 = list[0].expectTuple();
        let r2 = list[1].expectTuple();
        r1.block.expectUint(4);
        checkTuple(r1.reward, {
            token0: 0,
            token1: 10_000
        });
        r2.block.expectUint(205);
        checkTuple(r2.reward, {
            token0: 0,
            token1: 5_000
        });
    }
});
// distribution
Clarinet.test({
    name: "distribute-block: precondition (block < height)",
    async fn (chain, accounts) {
        const wallet_1 = accounts.get('wallet_1').address;
        const POOL = 1;
        setup(chain, []);
        let block = chain.mineBlock([
            distributeBlock(wallet_1, POOL, 3)
        ]);
        block.receipts[0].result.expectErr().expectUint(err_distribute_preconditions);
    }
});
Clarinet.test({
    name: "distribute-block: precondition (already claimed)",
    async fn (chain, accounts) {
        const wallet_1 = accounts.get('wallet_1').address;
        const wallet_2 = accounts.get('wallet_2').address;
        const POOL = 1;
        setup(chain, [
            wallet_1,
            wallet_2
        ]);
        // stake & add revenue
        let block = chain.mineBlock([
            stake(wallet_1, 500_000),
            stake(wallet_2, 500_000), 
        ]);
        assertEquals(block.height, 4);
        // 4
        sendReveueAsCore(chain, POOL, true, 1_000);
        // let pool1 = chain.callReadOnlyFn('core', 'do-get-pool', [types.uint(POOL)], deployer)
        let BLOCK_NR = 4;
        // distribute staked block for wallet 1
        block = chain.mineBlock([
            distributeBlock(wallet_1, POOL, BLOCK_NR)
        ]);
        // let res = getRewards(chain, wallet_1, POOL, 1)
        // console.log(block, res)
        // claimed
        let claimed1 = hasClaimedBlock(chain, wallet_1, POOL, BLOCK_NR).result;
        let claimed2 = hasClaimedBlock(chain, wallet_2, POOL, BLOCK_NR).result;
        claimed1.expectBool(true);
        claimed2.expectBool(false);
        // already claimed block
        block = chain.mineBlock([
            distributeBlock(wallet_1, POOL, BLOCK_NR)
        ]);
        block.receipts[0].result.expectErr().expectUint(err_distribute_preconditions);
    }
});
Clarinet.test({
    name: "distribute-block: precondition (wrong token)",
    async fn (chain, accounts) {
        const wallet_1 = accounts.get('wallet_1').address;
        setup(chain, [
            wallet_1
        ]);
        let block = chain.mineBlock([
            stake(wallet_1, 500_000)
        ]);
        block = chain.mineBlock([
            Tx.contractCall('distributor', 'distribute-block', [
                types.principal(wallet_1),
                types.uint(1),
                types.principal(velar),
                types.principal(wstx),
                types.uint(1), 
            ], wallet_1)
        ]);
        block.receipts[0].result.expectErr().expectUint(err_distribute_preconditions);
    }
});
Clarinet.test({
    name: 'distribute-blocks: ...',
    async fn (chain, accounts) {
        const wallet_1 = accounts.get('wallet_1').address;
        const POOL = 1;
        setup(chain, [
            wallet_1
        ]);
        let block = chain.mineBlock([
            stake(wallet_1, 500_000)
        ]);
        sendReveueAsCore(chain, POOL, true, 1_000);
        chain.mineEmptyBlock(10);
        sendReveueAsCore(chain, POOL, true, 1_000);
        chain.mineEmptyBlock(5);
        sendReveueAsCore(chain, POOL, true, 1_000);
        chain.mineEmptyBlock(5);
        // get reward blocks
        let res = getRewards(chain, wallet_1, POOL, 1);
        let list = res['reward-blocks'].expectList();
        let blocks = list.map((b)=>b.expectTuple().block);
        // claim blocks
        block = chain.mineBlock([
            distributeBlocks(wallet_1, POOL, blocks)
        ]);
        block.receipts[0].result.expectOk();
    }
}) // TEST: distribute-blocks
 // Clarinet.test({
 //   name: "claim: ...",
 //   async fn(chain: Chain, accounts: Map<String, Account>) {
 //       const wallet_1 = accounts.get('wallet_1')!.address
 //       const wallet_2 = accounts.get('wallet_2')!.address
 //       const POOL = 1
 //       // NOTE: can only unstake once we've passed this..
 //       chain.mineEmptyBlock(EPOCH_LENGTH)
 //       setup(chain, [wallet_1, wallet_2])
 //       // stake & add revenue
 //       let block = chain.mineBlock([
 //           stake(wallet_1, 500_000),
 //           stake(wallet_2, 500_000),
 //       ])
 //       sendReveueAsCore(chain, POOL, true, 1_000),
 //       sendReveueAsCore(chain, POOL, false, 2_000),
 //       let BLOCK_NR = 605
 //       assertEquals(block.height, BLOCK_NR)
 //       let reward1 = getRewards(chain, wallet_1, POOL, 10)
 //       let reward2 = getRewards(chain, wallet_2, POOL, 10)
 //       console.log(reward1, reward2)
 //       block = chain.mineBlock([
 //           claim(wallet_1, POOL, 500_000)
 //       ])
 //       block.receipts[0].result.expectOk()
 //       // after claim
 //       let staked1 = shareAt(chain, wallet_1, BLOCK_NR + 1)
 //       let staked2 = shareAt(chain, wallet_2, BLOCK_NR + 1)
 //       staked1.staked.expectUint(500_000)
 //       staked2.staked.expectUint(500_000)
 //       staked2.total.expectUint(1_000_000)
 //       let assets = chain.getAssetsMaps().assets
 //       console.log(assets)
 //       assertEquals(assets['.velar.velar'][wallet_1], 1_000) // reward
 //       assertEquals(assets['STX'][wallet_1], INITAIL_STX + 500)  // reward
 //   }
 // })
 // TEST: unstake part
 // TEST: unstake > stake
 // TEST: unstake + restake
 // TEST: failed tx of amt -> should fail
 // TEST: has-claimed-epoch
 // Clarinet.test({
 //   name: "unstake-and-claim: unstake all",
 //   async fn(chain: Chain, accounts: Map<String, Account>) {
 //       const wallet_1 = accounts.get('wallet_1')!.address
 //       const wallet_2 = accounts.get('wallet_2')!.address
 //       const POOL = 1
 //       // NOTE: can only unstake once we've passed this..
 //       chain.mineEmptyBlock(EPOCH_LENGTH)
 //       let block = chain.mineBlock([
 //           // shortcut
 //           mintWSTX(distributor, 10_000),
 //           mintVelar(distributor, 10_000),
 //           mintVelar(wallet_1, 500_000),
 //           mintVelar(wallet_2, 500_000),
 //       ])
 //       // stake & add revenue
 //       block = chain.mineBlock([
 //           stake(wallet_1, 500_000),
 //           stake(wallet_2, 500_000),
 //       ])
 //       sendReveueAsCore(chain, POOL, true, 1_000),
 //       assertEquals(block.height, 605)
 //       let blocks = getRewards(chain, wallet_1, POOL, 10)
 //       let BLOCK_NR = 605
 //       block = chain.mineBlock([
 //           unstakeAndClaim(wallet_1, POOL, 500_000)
 //       ])
 //       // console.log(block.receipts[0].events)
 //       // console.log('block height', block.height)
 //       block.receipts[0].result.expectOk()
 //       // before unstake
 //       let staked1 = shareAt(chain, wallet_1, BLOCK_NR)
 //       let staked2 = shareAt(chain, wallet_2, BLOCK_NR)
 //       staked1.staked.expectUint(500_000)
 //       staked2.staked.expectUint(500_000)
 //       staked2.total.expectUint(1_000_000)
 //       // after unstake
 //       staked1 = shareAt(chain, wallet_1, BLOCK_NR + 1)
 //       staked2 = shareAt(chain, wallet_2, BLOCK_NR + 1)
 //       staked1.staked.expectUint(0)
 //       staked2.staked.expectUint(500_000)
 //       staked2.total.expectUint(500_000)
 //       let assets = chain.getAssetsMaps().assets
 //       assertEquals(assets['.velar.velar'][wallet_1], 500_000)
 //       assertEquals(assets['STX'][wallet_1], INITAIL_STX + 500)
 //   }
 // })
 // // NOTE: lots of small transfers, is that a problem?
 // Clarinet.test({
 //     name: "unstake-and-claim: unstake part, then all",
 //     async fn(chain: Chain, accounts: Map<String, Account>) {
 //         const wallet_1 = accounts.get('wallet_1')!.address
 //         const POOL = 1
 //         const INITAIL_STX = 100000000000000
 //         // NOTE: can only unstake once we've passed this..
 //         chain.mineEmptyBlock(EPOCH_LENGTH)
 //         let block = chain.mineBlock([
 //             // shortcut
 //             mintWSTX(distributor, 10_000),
 //             mintVelar(distributor, 10_000),
 //             mintVelar(wallet_1, 500_000),
 //         ])
 //         // stake & add revenue
 //         block = chain.mineBlock([
 //             stake(wallet_1, 500_000),
 //         ])
 //         sendReveueAsCore(chain, POOL, false, 1_000),
 //         assertEquals(block.height, 605)
 //         let BLOCK_NR = 605
 //         // unstake some
 //         block = chain.mineBlock([
 //             unstakeAndClaim(wallet_1, POOL, 200_000)
 //         ])
 //         block.receipts[0].result.expectOk()
 //         // more rewards
 //         sendReveueAsCore(chain, POOL, false, 1_000),
 //         block.receipts[0].result.expectOk()
 //         // unstake rest
 //         // NOTE: this fails UnwrapFailure distribute-epoch
 //         // assertion: (not has-claimed-block fails?) without map it succeeds, but unstake doesn't happen
 //         block = chain.mineBlock([
 //             unstakeAndClaim(wallet_1, POOL, 300_000)
 //         ])
 //         let rewards = getRewards(chain, wallet_1, POOL, 100)
 //         console.log('reward-blocks', rewards['reward-blocks'])
 //         // console.log(block.receipts[0].events)
 //         // console.log('block height', block.height)
 //         block.receipts[0].result.expectOk()
 //         // before unstake
 //         let staked1 = shareAt(chain, wallet_1, BLOCK_NR)
 //         staked1.staked.expectUint(500_000)
 //         // after unstake part
 //         staked1 = shareAt(chain, wallet_1, BLOCK_NR + 1)
 //         staked1.staked.expectUint(0)
 //         let assets = chain.getAssetsMaps().assets
 //         assertEquals(assets['.velar.velar'][wallet_1], 200_000)
 //         assertEquals(assets['STX'][wallet_1], INITAIL_STX + 1_000)
 //         // after unstake all
 //     }
 // })
 // TEST: stake/unstake/claim at different times, multiple users..
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvUGF0b19Hb21lei9EZXNrdG9wL1ZlbGFyL3ZlbGFyL3Rlc3RzL2Rpc3RyaWJ1dG9yX3Rlc3QudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBDbGFyaW5ldCwgVHgsIENoYWluLCBBY2NvdW50LCB0eXBlcywgRW1wdHlCbG9jayB9IGZyb20gJ2h0dHBzOi8vZGVuby5sYW5kL3gvY2xhcmluZXRAdjEuNi4wL2luZGV4LnRzJztcbmltcG9ydCB7IGFzc2VydEVxdWFscyB9IGZyb20gJ2h0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjkwLjAvdGVzdGluZy9hc3NlcnRzLnRzJztcbmltcG9ydCB7IHNoYXJlQXQsIHN0YWtlLCB1bnN0YWtlIH0gZnJvbSAnLi9zdGFraW5nX3Rlc3QudHMnO1xuaW1wb3J0IHsgY2hlY2tUdXBsZSwgbWludFZlbGFyLCBtaW50V1NUWCwgIH0gZnJvbSAnLi91dGlsLnRzJztcbmltcG9ydCB7IGRlcGxveWVyLCBhZGRyZXNzZXMsIHN3YXBfZmVlLCBwcm90b2NvbF9mZWUsIHJldl9zaGFyZSB9IGZyb20gJy4vY29udGFudHMudHMnO1xuXG5jb25zdCB7XG4gIGRpc3RyaWJ1dG9yLFxuICBjb3JlLFxuICB3c3R4LFxuICB2ZWxhcixcbn0gPSBhZGRyZXNzZXNcblxuY29uc3QgdG9rZW4wID0gd3N0eFxuY29uc3QgdG9rZW4xID0gdmVsYXJcblxuY29uc3QgSU5JVEFJTF9TVFggPSAxMDAwMDAwMDAwMDAwMDBcbmNvbnN0IEVQT0NIX0xFTkdUSCA9IDYwMFxuXG5jb25zdCBlcnJfY2hlY2tfb3duZXIgICAgICAgICAgICAgICA9IDgwMVxuY29uc3QgZXJyX2NoZWNrX2NvcmUgICAgICAgICAgICAgICAgPSA4MDJcbmNvbnN0IGVycl9kaXN0cmlidXRlX3ByZWNvbmRpdGlvbnMgID0gODAzXG5jb25zdCBlcnJfZGlzdHJpYnV0ZV9wb3N0Y29uZGl0aW9ucyA9IDgwNFxuXG4vLyBoZWxwZXJzXG4vLyBjb25zdCByYW5nZSA9IChzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlcikgPT5cbi8vICAgICBBcnJheShlbmQpLmZpbGwoMSkubWFwKChfLCBpKSA9PiBzdGFydCArIGkpXG5cbi8vIGNvbnN0IGNoZWNrQ2xhaW1lZCA9IChjaGFpbjogQ2hhaW4sIHVzZXI6IHN0cmluZywgcG9vbDogbnVtYmVyLCBibG9ja3M6IG51bWJlcltdLCBleHBlY3Q6IGJvb2xlYW4pID0+XG4vLyAgICAgYmxvY2tzLmZvckVhY2goYiA9PiB7XG4vLyAgICAgICAgIGxldCByZXMgPSBoYXNDbGFpbWVkQmxvY2soY2hhaW4sIHVzZXIsIHBvb2wsIGIpXG4vLyAgICAgICAgIHRyeSB7XG4vLyAgICAgICAgICAgcmVzLnJlc3VsdC5leHBlY3RCb29sKGV4cGVjdClcbi8vICAgICAgICAgfSBjYXRjaCAoZSkge1xuLy8gICAgICAgICAgIGNvbnNvbGUubG9nKHVzZXIsIGIpXG4vLyAgICAgICAgIH1cbi8vICAgICB9KVxuXG5jb25zdCBjcmVhdGVQYWlyID0gKCkgPT5cbiAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBbXG4gICAgdHlwZXMucHJpbmNpcGFsKHRva2VuMCksXG4gICAgdHlwZXMucHJpbmNpcGFsKHRva2VuMSksXG4gICAgdHlwZXMucHJpbmNpcGFsKGFkZHJlc3Nlcy5scF90b2tlbiksXG4gICAgc3dhcF9mZWUsXG4gICAgcHJvdG9jb2xfZmVlLFxuICAgIHJldl9zaGFyZSxcbl0sIGRlcGxveWVyKVxuXG5jb25zdCBpbml0ICA9IChjaGFpbjogQ2hhaW4pID0+IGNoYWluLm1pbmVFbXB0eUJsb2NrKEVQT0NIX0xFTkdUSClcbmNvbnN0IHNldHVwID0gKGNoYWluOiBDaGFpbiwgd2FsbGV0czogc3RyaW5nW10pID0+XG4gICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgLy8gc2hvcnRjdXRcbiAgICAgICAgbWludFdTVFgoZGlzdHJpYnV0b3IsIDEwXzAwMCksXG4gICAgICAgIG1pbnRWZWxhcihkaXN0cmlidXRvciwgMTBfMDAwKSxcbiAgICAgICAgLi4ud2FsbGV0cy5tYXAodyA9PiBtaW50VmVsYXIodywgNTAwXzAwMCkpLFxuICAgICAgICBjcmVhdGVQYWlyKCksXG4gICAgXSlcblxuLy8gVE9ETzogaG93IHRvIHNlbmQgcmV2ZW51ZVxuY29uc3Qgc2VuZFJldmV1ZUFzQ29yZSA9IChjaGFpbjogQ2hhaW4sIHBvb2w6IG51bWJlciwgaXNUb2tlbjA6IGJvb2xlYW4sIGFtdDogbnVtYmVyKSA9PlxuICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIHNldENvcmUoZGVwbG95ZXIsIGRlcGxveWVyKSxcbiAgICAgICAgc2VuZFJldmVudWUocG9vbCwgaXNUb2tlbjAsIGFtdCwgZGVwbG95ZXIpLFxuICAgIF0pXG5cbi8vID09PT09IEFQSVxuXG4vLyBzZXR0ZXJzXG5jb25zdCBzZXRPd25lciA9IChvd25lcjogc3RyaW5nLCBzZW5kZXI6IHN0cmluZykgPT5cbiAgICBUeC5jb250cmFjdENhbGwoJ2Rpc3RyaWJ1dG9yJywgJ3NldC1vd25lcicsIFtcbiAgICAgICAgdHlwZXMucHJpbmNpcGFsKG93bmVyKVxuICAgIF0sIHNlbmRlcilcblxuY29uc3Qgc2V0Q29yZSA9IChuZXdDb3JlOiBzdHJpbmcsIHNlbmRlcjogc3RyaW5nKSA9PlxuICAgIFR4LmNvbnRyYWN0Q2FsbCgnZGlzdHJpYnV0b3InLCAnc2V0LWNvcmUnLCBbXG4gICAgICAgIHR5cGVzLnByaW5jaXBhbChuZXdDb3JlKVxuICAgIF0sIHNlbmRlcilcblxuLy8gcmVhZC1vbmx5XG5jb25zdCBta2Vwb2NoID0gKGNoYWluOiBDaGFpbiwgc3RhcnRCbG9jazogbnVtYmVyKSA9PlxuICAgIGNoYWluLmNhbGxSZWFkT25seUZuKCdkaXN0cmlidXRvcicsICdta2Vwb2NoJywgW1xuICAgICAgICB0eXBlcy51aW50KHN0YXJ0QmxvY2spXG4gICAgXSwgZGVwbG95ZXIpXG5cbmNvbnN0IGdldFJldmVudWVBdCA9IChjaGFpbjogQ2hhaW4sIHBvb2w6IG51bWJlciwgYmxvY2s6IG51bWJlcikgPT5cbiAgICBjaGFpbi5jYWxsUmVhZE9ubHlGbignZGlzdHJpYnV0b3InLCAnZ2V0LXJldmVudWUtYXQnLCBbXG4gICAgICAgIHR5cGVzLnVpbnQocG9vbCksXG4gICAgICAgIHR5cGVzLnVpbnQoYmxvY2spLFxuICAgIF0sIGRlcGxveWVyKVxuXG5jb25zdCBoYXNDbGFpbWVkQmxvY2sgPSAoY2hhaW46IENoYWluLCB1c2VyOiBzdHJpbmcsIHBvb2w6IG51bWJlciwgYmxvY2s6IG51bWJlcikgPT5cbiAgICBjaGFpbi5jYWxsUmVhZE9ubHlGbignZGlzdHJpYnV0b3InLCAnaGFzLWNsYWltZWQtYmxvY2snLCBbXG4gICAgICAgIHR5cGVzLnByaW5jaXBhbCh1c2VyKSxcbiAgICAgICAgdHlwZXMudWludChwb29sKSxcbiAgICAgICAgdHlwZXMudWludChibG9jayksXG4gICAgXSwgZGVwbG95ZXIpXG5cbmNvbnN0IGNhbGNEaXN0cmlidXRlID0gKFxuICBjaGFpbjogQ2hhaW4sXG4gIHN0YWtlZDogbnVtYmVyLFxuICB0b3RhbDogbnVtYmVyLFxuICByZXZlbnVlMDogbnVtYmVyLFxuICByZXZlbnVlMTogbnVtYmVyXG4pID0+XG4gICAgY2hhaW4uY2FsbFJlYWRPbmx5Rm4oJ2Rpc3RyaWJ1dG9yJywgJ2NhbGMtZGlzdHJpYnV0ZScsIFtcbiAgICAgICAgdHlwZXMudHVwbGUoe1xuICAgICAgICAgICAgc3Rha2VkOiB0eXBlcy51aW50KHN0YWtlZCksXG4gICAgICAgICAgICB0b3RhbCA6IHR5cGVzLnVpbnQodG90YWwpLFxuICAgICAgICB9KSxcbiAgICAgICAgdHlwZXMudHVwbGUoe1xuICAgICAgICAgICAgdG9rZW4wOiB0eXBlcy51aW50KHJldmVudWUwKSxcbiAgICAgICAgICAgIHRva2VuMTogdHlwZXMudWludChyZXZlbnVlMSksXG4gICAgICAgIH0pXG4gICAgXSwgZGVwbG95ZXIpXG5cbmNvbnN0IGdldFJld2FyZHMgPSAoY2hhaW46IENoYWluLCB1c2VyOiBzdHJpbmcsIHBvb2w6IG51bWJlciwgc3RhcnRCbG9jazogbnVtYmVyKSA9PlxuICAgIGNoYWluLmNhbGxSZWFkT25seUZuKCdkaXN0cmlidXRvcicsICdnZXQtcmV3YXJkcycsIFtcbiAgICAgICAgdHlwZXMucHJpbmNpcGFsKHVzZXIpLFxuICAgICAgICB0eXBlcy51aW50KHBvb2wpLFxuICAgICAgICB0eXBlcy51aW50KHN0YXJ0QmxvY2spXG4gICAgXSwgZGVwbG95ZXIpXG4gICAgICAgIC5yZXN1bHQuZXhwZWN0VHVwbGUoKVxuXG5jb25zdCBnZXRSZXdhcmQgPSAoY2hhaW46IENoYWluLCB1c2VyOiBzdHJpbmcsIHBvb2w6IG51bWJlciwgc3RhcnRCbG9jazogbnVtYmVyKSA9PlxuICAgIGNoYWluLmNhbGxSZWFkT25seUZuKCdkaXN0cmlidXRvcicsICdnZXQtcmV3YXJkJywgW1xuICAgICAgICB0eXBlcy5wcmluY2lwYWwodXNlciksXG4gICAgICAgIHR5cGVzLnVpbnQocG9vbCksXG4gICAgICAgIHR5cGVzLnVpbnQoc3RhcnRCbG9jaylcbiAgICBdLCBkZXBsb3llcilcblxuLy8gTk9URToganVzdCBsb29rcyBhdCByZXdhcmRzLi5cbmNvbnN0IGhhc1Jld2FyZCA9IChjaGFpbjogQ2hhaW4sIHVzZXI6IHN0cmluZywgcG9vbDogbnVtYmVyLCBibG9jazogbnVtYmVyLCBhbXRzOiBudW1iZXJbXSkgPT5cbiAgICBjaGFpbi5jYWxsUmVhZE9ubHlGbignZGlzdHJpYnV0b3InLCAnaGFzLXJld2FyZCcsIFtcbiAgICAgICAgdHlwZXMudHVwbGUoe1xuICAgICAgICAgIHVzZXI6IHR5cGVzLnByaW5jaXBhbCh1c2VyKSxcbiAgICAgICAgICBwb29sOiB0eXBlcy51aW50KHBvb2wpLFxuICAgICAgICAgIGJsb2NrOiB0eXBlcy51aW50KGJsb2NrKSxcbiAgICAgICAgICByZXdhcmQ6IHR5cGVzLnR1cGxlKHtcbiAgICAgICAgICAgIHRva2VuMDogdHlwZXMudWludChhbXRzWzBdKSxcbiAgICAgICAgICAgIHRva2VuMTogdHlwZXMudWludChhbXRzWzFdKVxuICAgICAgICAgIH0pLFxuICAgICAgICB9KVxuICAgICAgXSwgZGVwbG95ZXIpXG5cbi8vIHB1YmxpY1xuY29uc3Qgc2VuZFJldmVudWUgPSAocG9vbDogbnVtYmVyLCBpc1Rva2VuMDogYm9vbGVhbiwgYW10OiBudW1iZXIsIHNlbmRlcjogc3RyaW5nKSA9PlxuICAgIFR4LmNvbnRyYWN0Q2FsbCgnZGlzdHJpYnV0b3InLCAnc2VuZC1yZXZlbnVlJywgW1xuICAgICAgICB0eXBlcy51aW50KHBvb2wpLFxuICAgICAgICB0eXBlcy5ib29sKGlzVG9rZW4wKSxcbiAgICAgICAgdHlwZXMudWludChhbXQpLFxuICAgIF0sIHNlbmRlcilcblxuY29uc3QgZGlzdHJpYnV0ZUJsb2NrID0gKHVzZXI6IHN0cmluZywgcG9vbDogbnVtYmVyLCBibG9jazogbnVtYmVyKSA9PlxuICAgIFR4LmNvbnRyYWN0Q2FsbCgnZGlzdHJpYnV0b3InLCAnZGlzdHJpYnV0ZS1ibG9jaycsIFtcbiAgICAgICAgdHlwZXMucHJpbmNpcGFsKHVzZXIpLFxuICAgICAgICB0eXBlcy51aW50KHBvb2wpLFxuICAgICAgICB0eXBlcy5wcmluY2lwYWwodG9rZW4wKSxcbiAgICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuMSksXG4gICAgICAgIHR5cGVzLnVpbnQoYmxvY2spLFxuICAgIF0sIGRlcGxveWVyKVxuXG4vLyBUT0RPOiB0ZXN0XG5jb25zdCBkaXN0cmlidXRlQmxvY2tzID0gKHVzZXI6IHN0cmluZywgcG9vbDogbnVtYmVyLCBibG9ja3M6IHN0cmluZ1tdKSA9PlxuICAgIFR4LmNvbnRyYWN0Q2FsbCgnZGlzdHJpYnV0b3InLCAnZGlzdHJpYnV0ZS1ibG9ja3MnLCBbXG4gICAgICAgIHR5cGVzLnByaW5jaXBhbCh1c2VyKSxcbiAgICAgICAgdHlwZXMudWludChwb29sKSxcbiAgICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuMCksXG4gICAgICAgIHR5cGVzLnByaW5jaXBhbCh0b2tlbjEpLFxuICAgICAgICB0eXBlcy5saXN0KGJsb2NrcyksXG4gICAgXSwgZGVwbG95ZXIpXG5cbi8vIGNvbnN0IHVuc3Rha2VBbmRDbGFpbSA9ICh1c2VyOiBzdHJpbmcsIHBvb2w6IG51bWJlciwgYW10OiBudW1iZXIpID0+XG4vLyAgICAgVHguY29udHJhY3RDYWxsKCdkaXN0cmlidXRvcicsICd1bnN0YWtlLWFuZC1jbGFpbScsIFtcbi8vICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHVzZXIpLFxuLy8gICAgICAgICB0eXBlcy51aW50KHBvb2wpLFxuLy8gICAgICAgICB0eXBlcy5wcmluY2lwYWwodG9rZW4wKSxcbi8vICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuMSksXG4vLyAgICAgICAgIHR5cGVzLnVpbnQoYW10KSxcbi8vICAgICBdLCB1c2VyKVxuXG4vLyBjb25zdCBjbGFpbSA9ICh1c2VyOiBzdHJpbmcsIHBvb2w6IG51bWJlciwgYW10OiBudW1iZXIpID0+XG4vLyAgICAgVHguY29udHJhY3RDYWxsKCdkaXN0cmlidXRvcicsICdjbGFpbScsIFtcbi8vICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHVzZXIpLFxuLy8gICAgICAgICB0eXBlcy51aW50KHBvb2wpLFxuLy8gICAgICAgICB0eXBlcy5wcmluY2lwYWwodG9rZW4wKSxcbi8vICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuMSksXG4vLyAgICAgICAgIHR5cGVzLnVpbnQoYW10KSxcbi8vICAgICBdLCB1c2VyKVxuXG4vLyA9PT09PSByZWFkLW9ubHkgZnVuY3Rpb25zXG5cbi8vIE5PVEU6IGlzIGl0IG5lY2Vzc2FyeSB0byBoYXZlIGEgdHVwbGU/IHdoeSBub3QganVzdCB1aW50IChibG9ja25yKVxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwibWtlcG9jaDogLi4uXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbikge1xuXG4gICAgICBsZXQgU1RBUlRfQkxPQ0sgPSAxXG4gICAgICBsZXQgcmVzID0gbWtlcG9jaChjaGFpbiwgU1RBUlRfQkxPQ0spLnJlc3VsdC5leHBlY3RMaXN0KClcblxuICAgICAgYXNzZXJ0RXF1YWxzKHJlcy5sZW5ndGgsIEVQT0NIX0xFTkdUSClcbiAgICAgIHJlc1swXS5leHBlY3RVaW50KFNUQVJUX0JMT0NLKVxuICAgICAgcmVzW3Jlcy5sZW5ndGggLSAxXS5leHBlY3RVaW50KEVQT0NIX0xFTkdUSCArIFNUQVJUX0JMT0NLIC0gMSlcblxuICAgICAgU1RBUlRfQkxPQ0sgPSBFUE9DSF9MRU5HVEhcbiAgICAgIHJlcyA9IG1rZXBvY2goY2hhaW4sIFNUQVJUX0JMT0NLKS5yZXN1bHQuZXhwZWN0TGlzdCgpXG5cbiAgICAgIGFzc2VydEVxdWFscyhyZXMubGVuZ3RoLCBFUE9DSF9MRU5HVEgpXG4gICAgICByZXNbMF0uZXhwZWN0VWludChFUE9DSF9MRU5HVEgpXG4gICAgICByZXNbcmVzLmxlbmd0aCAtIDFdLmV4cGVjdFVpbnQoRVBPQ0hfTEVOR1RIICsgU1RBUlRfQkxPQ0sgLSAxKVxuICB9LFxufSk7XG5cbkNsYXJpbmV0LnRlc3Qoe1xuICAgIG5hbWU6IFwiY2FsYy1kaXN0cmlidXRlOiAuLi5cIixcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4pIHtcblxuICAgICAgICAvLyBzdGFrZWQsIHRvdGFsLCByZXYwLCByZXYxXG4gICAgICAgIGxldCB0ZXN0cyA9IFtcbiAgICAgICAgICBbWzEwMCwgMV8wMDAsIDFfMDAwLCAwXSAgLCBbMTAwLCAwXV0sXG4gICAgICAgICAgW1s5MDAsIDFfMDAwLCAxMDAsIDEwMF0gICwgWzkwLCA5MF1dLFxuICAgICAgICAgIFtbMV8wMDAsIDFfMDAwLCAxMDAsIDEwMF0sIFsxMDAsIDEwMF1dLFxuICAgICAgICAgIFtbMV8wMDAsIDFfMDAwLCAwLCAwXSAgICAsIFswLCAwXV0sXG4gICAgICAgICAgW1swLCAxXzAwMCwgMV8wMDAsIDFfMDAwXSwgWzAsIDBdXSxcbiAgICAgICAgICAvLyBbWzFfMDAwLCAwLCAxXzAwMCwgMV8wMDBdLCBbMCwgMF1dLCAvLyBzaG91bGRuJ3QgaGFwcGVuXG4gICAgICAgICAgW1s1MDAsIDFfMDAwXzAwMCwgMV8wMDAsIDFfMDAwXSwgWzAsIDBdXSxcbiAgICAgICAgICBbWzUwMCwgMV8wMDBfMDAwLCAxMF8wMDAsIDEwXzAwMF0sIFs1LCA1XV0sXG4gICAgICAgICAgW1s1MDAsIDFfMDAwXzAwMCwgMTAwXzAwMCwgMTAwXzAwMF0sIFs1MCwgNTBdXSxcbiAgICAgICAgICBbWzUwMCwgMV8wMDBfMDAwLCAxXzAwMF8wMDAsIDFfMDAwXzAwMF0sIFs1MDAsIDUwMF1dLFxuICAgICAgICBdXG5cbiAgICAgICAgbGV0IHJlcyA9IHRlc3RzLm1hcCgoW2lucHV0XSkgPT4gY2FsY0Rpc3RyaWJ1dGUoY2hhaW4sIC4uLmlucHV0KSlcblxuICAgICAgICByZXMubWFwKCh7IHJlc3VsdCB9LCBpKSA9PiB7XG4gICAgICAgICAgbGV0IHR1cGxlID0gcmVzdWx0LmV4cGVjdFR1cGxlKClcbiAgICAgICAgICB0dXBsZS50b2tlbjAuZXhwZWN0VWludCh0ZXN0c1tpXVsxXVswXSlcbiAgICAgICAgICB0dXBsZS50b2tlbjEuZXhwZWN0VWludCh0ZXN0c1tpXVsxXVsxXSlcbiAgICAgICAgfSlcbiAgICB9XG59KVxuXG5cbkNsYXJpbmV0LnRlc3Qoe1xuICAgIG5hbWU6ICdzZW5kLXJldmVudWU6IGNhbiBvbmx5IGJlIGNhbGxlZCBieSBjb3JlIGNvbnRyYWN0JyxcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8U3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldCgnd2FsbGV0XzEnKSEuYWRkcmVzc1xuICAgICAgICBsZXQgYmxvY2sgPSBzZXR1cChjaGFpbiwgW10pXG5cbiAgICAgICAgbGV0IHJlcyA9IGNoYWluLmNhbGxSZWFkT25seUZuKCdkaXN0cmlidXRvcicsICdnZXQtY29yZScsIFtdLCBkZXBsb3llcilcbiAgICAgICAgcmVzLnJlc3VsdC5leHBlY3RQcmluY2lwYWwoY29yZSlcblxuICAgICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBzZW5kUmV2ZW51ZSgxLCB0cnVlLCAxMDBfMDAwLCBkZXBsb3llciksXG4gICAgICAgICAgICBzZW5kUmV2ZW51ZSgxLCB0cnVlLCAxMDBfMDAwLCB3YWxsZXRfMSksXG4gICAgICAgIF0pXG4gICAgICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKS5leHBlY3RVaW50KGVycl9jaGVja19jb3JlKVxuICAgICAgICBibG9jay5yZWNlaXB0c1sxXS5yZXN1bHQuZXhwZWN0RXJyKCkuZXhwZWN0VWludChlcnJfY2hlY2tfY29yZSlcbiAgICB9XG59KVxuXG5cbkNsYXJpbmV0LnRlc3Qoe1xuICAgIG5hbWU6IFwiZ2V0LXJld2FyZHM6IC4uLlwiLFxuICAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxTdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KCd3YWxsZXRfMScpIS5hZGRyZXNzXG4gICAgICAgIGNvbnN0IFBPT0wgPSAxXG5cbiAgICAgICAgbGV0IGJsb2NrID0gc2V0dXAoY2hhaW4sIFt3YWxsZXRfMV0pXG5cbiAgICAgICAgLy8gc3Rha2VcbiAgICAgICAgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgc3Rha2Uod2FsbGV0XzEsIDUwMF8wMDApLFxuICAgICAgICBdKVxuXG4gICAgICAgIHNlbmRSZXZldWVBc0NvcmUoY2hhaW4sIFBPT0wsIGZhbHNlLCAxMF8wMDApLFxuICAgICAgICBjaGFpbi5taW5lRW1wdHlCbG9jayhFUE9DSF9MRU5HVEggLyAzKVxuXG4gICAgICAgIC8vIHJld2FyZHNcbiAgICAgICAgc2VuZFJldmV1ZUFzQ29yZShjaGFpbiwgUE9PTCwgZmFsc2UsIDVfMDAwKVxuXG4gICAgICAgIGJsb2NrID0gY2hhaW4ubWluZUVtcHR5QmxvY2soRVBPQ0hfTEVOR1RIIC8gMylcbiAgICAgICAgYXNzZXJ0RXF1YWxzKGJsb2NrLmJsb2NrX2hlaWdodCwgNDA2KVxuXG4gICAgICAgIGxldCByZXMgPSBnZXRSZXdhcmRzKGNoYWluLCB3YWxsZXRfMSwgUE9PTCwgMSlcbiAgICAgICAgcmVzWydlbmQtYmxvY2snXS5leHBlY3RVaW50KDYwMSlcbiAgICAgICAgbGV0IGxpc3QgPSByZXNbJ3Jld2FyZC1ibG9ja3MnXS5leHBlY3RMaXN0KClcbiBcbiAgICAgICAgbGV0IHIxID0gbGlzdFswXS5leHBlY3RUdXBsZSgpXG4gICAgICAgIGxldCByMiA9IGxpc3RbMV0uZXhwZWN0VHVwbGUoKVxuICAgICAgICByMS5ibG9jay5leHBlY3RVaW50KDQpXG4gICAgICAgIGNoZWNrVHVwbGUocjEucmV3YXJkLCB7IHRva2VuMDogMCwgdG9rZW4xOiAxMF8wMDAgfSlcbiAgICAgICAgcjIuYmxvY2suZXhwZWN0VWludCgyMDUpXG4gICAgICAgIGNoZWNrVHVwbGUocjIucmV3YXJkLCB7IHRva2VuMDogMCwgdG9rZW4xOiA1XzAwMCB9KVxuICAgIH1cbn0pXG5cbi8vIGRpc3RyaWJ1dGlvblxuXG5DbGFyaW5ldC50ZXN0KHtcbiAgICBuYW1lOiBcImRpc3RyaWJ1dGUtYmxvY2s6IHByZWNvbmRpdGlvbiAoYmxvY2sgPCBoZWlnaHQpXCIsXG4gICAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPFN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8xJykhLmFkZHJlc3NcbiAgICAgICAgY29uc3QgUE9PTCA9IDFcblxuICAgICAgICBzZXR1cChjaGFpbiwgW10pXG5cbiAgICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIGRpc3RyaWJ1dGVCbG9jayh3YWxsZXRfMSwgUE9PTCwgMylcbiAgICAgICAgXSlcbiAgICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0XG4gICAgICAgICAgICAuZXhwZWN0RXJyKClcbiAgICAgICAgICAgIC5leHBlY3RVaW50KGVycl9kaXN0cmlidXRlX3ByZWNvbmRpdGlvbnMpXG4gICAgfVxufSlcblxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiZGlzdHJpYnV0ZS1ibG9jazogcHJlY29uZGl0aW9uIChhbHJlYWR5IGNsYWltZWQpXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxTdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldCgnd2FsbGV0XzEnKSEuYWRkcmVzc1xuICAgICAgY29uc3Qgd2FsbGV0XzIgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8yJykhLmFkZHJlc3NcbiAgICAgIGNvbnN0IFBPT0wgPSAxXG5cbiAgICAgIHNldHVwKGNoYWluLCBbd2FsbGV0XzEsIHdhbGxldF8yXSlcblxuICAgICAgLy8gc3Rha2UgJiBhZGQgcmV2ZW51ZVxuICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBzdGFrZSh3YWxsZXRfMSwgNTAwXzAwMCksXG4gICAgICAgICAgc3Rha2Uod2FsbGV0XzIsIDUwMF8wMDApLFxuICAgICAgXSlcbiAgICAgIGFzc2VydEVxdWFscyhibG9jay5oZWlnaHQsIDQpXG4gICAgICAvLyA0XG4gICAgICBzZW5kUmV2ZXVlQXNDb3JlKGNoYWluLCBQT09MLCB0cnVlLCAxXzAwMClcblxuICAgICAgLy8gbGV0IHBvb2wxID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oJ2NvcmUnLCAnZG8tZ2V0LXBvb2wnLCBbdHlwZXMudWludChQT09MKV0sIGRlcGxveWVyKVxuXG4gICAgICBsZXQgQkxPQ0tfTlIgPSA0XG4gICAgICAvLyBkaXN0cmlidXRlIHN0YWtlZCBibG9jayBmb3Igd2FsbGV0IDFcbiAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBkaXN0cmlidXRlQmxvY2sod2FsbGV0XzEsIFBPT0wsIEJMT0NLX05SKVxuICAgICAgXSlcblxuICAgICAgLy8gbGV0IHJlcyA9IGdldFJld2FyZHMoY2hhaW4sIHdhbGxldF8xLCBQT09MLCAxKVxuICAgICAgLy8gY29uc29sZS5sb2coYmxvY2ssIHJlcylcblxuICAgICAgLy8gY2xhaW1lZFxuICAgICAgbGV0IGNsYWltZWQxID0gaGFzQ2xhaW1lZEJsb2NrKGNoYWluLCB3YWxsZXRfMSwgUE9PTCwgQkxPQ0tfTlIpLnJlc3VsdFxuICAgICAgbGV0IGNsYWltZWQyID0gaGFzQ2xhaW1lZEJsb2NrKGNoYWluLCB3YWxsZXRfMiwgUE9PTCwgQkxPQ0tfTlIpLnJlc3VsdFxuICAgICAgY2xhaW1lZDEuZXhwZWN0Qm9vbCh0cnVlKVxuICAgICAgY2xhaW1lZDIuZXhwZWN0Qm9vbChmYWxzZSlcblxuICAgICAgLy8gYWxyZWFkeSBjbGFpbWVkIGJsb2NrXG4gICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgZGlzdHJpYnV0ZUJsb2NrKHdhbGxldF8xLCBQT09MLCBCTE9DS19OUilcbiAgICAgIF0pXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKCkuZXhwZWN0VWludChlcnJfZGlzdHJpYnV0ZV9wcmVjb25kaXRpb25zKVxuICB9XG59KVxuXG5DbGFyaW5ldC50ZXN0KHtcbiAgICBuYW1lOiBcImRpc3RyaWJ1dGUtYmxvY2s6IHByZWNvbmRpdGlvbiAod3JvbmcgdG9rZW4pXCIsXG4gICAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPFN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8xJykhLmFkZHJlc3NcbiAgICAgICAgc2V0dXAoY2hhaW4sIFt3YWxsZXRfMV0pXG4gICAgICAgIGxldCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBzdGFrZSh3YWxsZXRfMSwgNTAwXzAwMClcbiAgICAgICAgXSlcblxuICAgICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoJ2Rpc3RyaWJ1dG9yJywgJ2Rpc3RyaWJ1dGUtYmxvY2snLCBbXG4gICAgICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xKSxcbiAgICAgICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbCh2ZWxhciksXG4gICAgICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHdzdHgpLFxuICAgICAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICBdLCB3YWxsZXRfMSlcbiAgICAgICAgXSlcbiAgICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpLmV4cGVjdFVpbnQoZXJyX2Rpc3RyaWJ1dGVfcHJlY29uZGl0aW9ucylcbiAgICB9XG59KVxuXG5DbGFyaW5ldC50ZXN0KHtcbiAgICBuYW1lOiAnZGlzdHJpYnV0ZS1ibG9ja3M6IC4uLicsXG4gICAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPFN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KCd3YWxsZXRfMScpIS5hZGRyZXNzXG4gICAgICBjb25zdCBQT09MID0gMVxuXG4gICAgICBzZXR1cChjaGFpbiwgW3dhbGxldF8xXSlcblxuICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBzdGFrZSh3YWxsZXRfMSwgNTAwXzAwMClcbiAgICAgIF0pXG5cbiAgICAgIHNlbmRSZXZldWVBc0NvcmUoY2hhaW4sIFBPT0wsIHRydWUsIDFfMDAwKVxuICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2soMTApXG4gICAgICBzZW5kUmV2ZXVlQXNDb3JlKGNoYWluLCBQT09MLCB0cnVlLCAxXzAwMClcbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrKDUpXG4gICAgICBzZW5kUmV2ZXVlQXNDb3JlKGNoYWluLCBQT09MLCB0cnVlLCAxXzAwMClcbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrKDUpXG5cbiAgICAgIC8vIGdldCByZXdhcmQgYmxvY2tzXG4gICAgICBsZXQgcmVzID0gZ2V0UmV3YXJkcyhjaGFpbiwgd2FsbGV0XzEsIFBPT0wsIDEpXG4gICAgICBsZXQgbGlzdCA9IHJlc1sncmV3YXJkLWJsb2NrcyddLmV4cGVjdExpc3QoKVxuICAgICAgbGV0IGJsb2NrcyA9IGxpc3QubWFwKGIgPT4gYi5leHBlY3RUdXBsZSgpLmJsb2NrKVxuXG4gICAgICAvLyBjbGFpbSBibG9ja3NcbiAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBkaXN0cmlidXRlQmxvY2tzKHdhbGxldF8xLCBQT09MLCBibG9ja3MpXG4gICAgICBdKVxuICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdE9rKClcbiAgICB9XG59KVxuXG4vLyBURVNUOiBkaXN0cmlidXRlLWJsb2Nrc1xuXG4vLyBDbGFyaW5ldC50ZXN0KHtcbi8vICAgbmFtZTogXCJjbGFpbTogLi4uXCIsXG4vLyAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxTdHJpbmcsIEFjY291bnQ+KSB7XG4vLyAgICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldCgnd2FsbGV0XzEnKSEuYWRkcmVzc1xuLy8gICAgICAgY29uc3Qgd2FsbGV0XzIgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8yJykhLmFkZHJlc3Ncbi8vICAgICAgIGNvbnN0IFBPT0wgPSAxXG4gXG4vLyAgICAgICAvLyBOT1RFOiBjYW4gb25seSB1bnN0YWtlIG9uY2Ugd2UndmUgcGFzc2VkIHRoaXMuLlxuLy8gICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2soRVBPQ0hfTEVOR1RIKVxuLy8gICAgICAgc2V0dXAoY2hhaW4sIFt3YWxsZXRfMSwgd2FsbGV0XzJdKVxuXG4vLyAgICAgICAvLyBzdGFrZSAmIGFkZCByZXZlbnVlXG4vLyAgICAgICBsZXQgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuLy8gICAgICAgICAgIHN0YWtlKHdhbGxldF8xLCA1MDBfMDAwKSxcbi8vICAgICAgICAgICBzdGFrZSh3YWxsZXRfMiwgNTAwXzAwMCksXG4vLyAgICAgICBdKVxuLy8gICAgICAgc2VuZFJldmV1ZUFzQ29yZShjaGFpbiwgUE9PTCwgdHJ1ZSwgMV8wMDApLFxuLy8gICAgICAgc2VuZFJldmV1ZUFzQ29yZShjaGFpbiwgUE9PTCwgZmFsc2UsIDJfMDAwKSxcbiAgICBcbi8vICAgICAgIGxldCBCTE9DS19OUiA9IDYwNVxuLy8gICAgICAgYXNzZXJ0RXF1YWxzKGJsb2NrLmhlaWdodCwgQkxPQ0tfTlIpXG5cbi8vICAgICAgIGxldCByZXdhcmQxID0gZ2V0UmV3YXJkcyhjaGFpbiwgd2FsbGV0XzEsIFBPT0wsIDEwKVxuLy8gICAgICAgbGV0IHJld2FyZDIgPSBnZXRSZXdhcmRzKGNoYWluLCB3YWxsZXRfMiwgUE9PTCwgMTApXG4vLyAgICAgICBjb25zb2xlLmxvZyhyZXdhcmQxLCByZXdhcmQyKVxuXG4vLyAgICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4vLyAgICAgICAgICAgY2xhaW0od2FsbGV0XzEsIFBPT0wsIDUwMF8wMDApXG4vLyAgICAgICBdKVxuXG4vLyAgICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuXG4vLyAgICAgICAvLyBhZnRlciBjbGFpbVxuLy8gICAgICAgbGV0IHN0YWtlZDEgPSBzaGFyZUF0KGNoYWluLCB3YWxsZXRfMSwgQkxPQ0tfTlIgKyAxKVxuLy8gICAgICAgbGV0IHN0YWtlZDIgPSBzaGFyZUF0KGNoYWluLCB3YWxsZXRfMiwgQkxPQ0tfTlIgKyAxKVxuLy8gICAgICAgc3Rha2VkMS5zdGFrZWQuZXhwZWN0VWludCg1MDBfMDAwKVxuLy8gICAgICAgc3Rha2VkMi5zdGFrZWQuZXhwZWN0VWludCg1MDBfMDAwKVxuLy8gICAgICAgc3Rha2VkMi50b3RhbC5leHBlY3RVaW50KDFfMDAwXzAwMClcblxuLy8gICAgICAgbGV0IGFzc2V0cyA9IGNoYWluLmdldEFzc2V0c01hcHMoKS5hc3NldHNcbi8vICAgICAgIGNvbnNvbGUubG9nKGFzc2V0cylcbi8vICAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbJy52ZWxhci52ZWxhciddW3dhbGxldF8xXSwgMV8wMDApIC8vIHJld2FyZFxuLy8gICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1snU1RYJ11bd2FsbGV0XzFdLCBJTklUQUlMX1NUWCArIDUwMCkgIC8vIHJld2FyZFxuLy8gICB9XG4vLyB9KVxuXG4vLyBURVNUOiB1bnN0YWtlIHBhcnRcbi8vIFRFU1Q6IHVuc3Rha2UgPiBzdGFrZVxuLy8gVEVTVDogdW5zdGFrZSArIHJlc3Rha2Vcbi8vIFRFU1Q6IGZhaWxlZCB0eCBvZiBhbXQgLT4gc2hvdWxkIGZhaWxcbi8vIFRFU1Q6IGhhcy1jbGFpbWVkLWVwb2NoXG5cbi8vIENsYXJpbmV0LnRlc3Qoe1xuLy8gICBuYW1lOiBcInVuc3Rha2UtYW5kLWNsYWltOiB1bnN0YWtlIGFsbFwiLFxuLy8gICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8U3RyaW5nLCBBY2NvdW50Pikge1xuLy8gICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8xJykhLmFkZHJlc3Ncbi8vICAgICAgIGNvbnN0IHdhbGxldF8yID0gYWNjb3VudHMuZ2V0KCd3YWxsZXRfMicpIS5hZGRyZXNzXG4vLyAgICAgICBjb25zdCBQT09MID0gMVxuXG4vLyAgICAgICAvLyBOT1RFOiBjYW4gb25seSB1bnN0YWtlIG9uY2Ugd2UndmUgcGFzc2VkIHRoaXMuLlxuLy8gICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2soRVBPQ0hfTEVOR1RIKVxuXG4vLyAgICAgICBsZXQgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuLy8gICAgICAgICAgIC8vIHNob3J0Y3V0XG4vLyAgICAgICAgICAgbWludFdTVFgoZGlzdHJpYnV0b3IsIDEwXzAwMCksXG4vLyAgICAgICAgICAgbWludFZlbGFyKGRpc3RyaWJ1dG9yLCAxMF8wMDApLFxuLy8gICAgICAgICAgIG1pbnRWZWxhcih3YWxsZXRfMSwgNTAwXzAwMCksXG4vLyAgICAgICAgICAgbWludFZlbGFyKHdhbGxldF8yLCA1MDBfMDAwKSxcbi8vICAgICAgIF0pXG5cbi8vICAgICAgIC8vIHN0YWtlICYgYWRkIHJldmVudWVcbi8vICAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbi8vICAgICAgICAgICBzdGFrZSh3YWxsZXRfMSwgNTAwXzAwMCksXG4vLyAgICAgICAgICAgc3Rha2Uod2FsbGV0XzIsIDUwMF8wMDApLFxuLy8gICAgICAgXSlcblxuLy8gICAgICAgc2VuZFJldmV1ZUFzQ29yZShjaGFpbiwgUE9PTCwgdHJ1ZSwgMV8wMDApLFxuICAgIFxuLy8gICAgICAgYXNzZXJ0RXF1YWxzKGJsb2NrLmhlaWdodCwgNjA1KVxuXG4vLyAgICAgICBsZXQgYmxvY2tzID0gZ2V0UmV3YXJkcyhjaGFpbiwgd2FsbGV0XzEsIFBPT0wsIDEwKVxuLy8gICAgICAgbGV0IEJMT0NLX05SID0gNjA1XG5cbi8vICAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbi8vICAgICAgICAgICB1bnN0YWtlQW5kQ2xhaW0od2FsbGV0XzEsIFBPT0wsIDUwMF8wMDApXG4vLyAgICAgICBdKVxuXG4vLyAgICAgICAvLyBjb25zb2xlLmxvZyhibG9jay5yZWNlaXB0c1swXS5ldmVudHMpXG4vLyAgICAgICAvLyBjb25zb2xlLmxvZygnYmxvY2sgaGVpZ2h0JywgYmxvY2suaGVpZ2h0KVxuLy8gICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdE9rKClcblxuLy8gICAgICAgLy8gYmVmb3JlIHVuc3Rha2Vcbi8vICAgICAgIGxldCBzdGFrZWQxID0gc2hhcmVBdChjaGFpbiwgd2FsbGV0XzEsIEJMT0NLX05SKVxuLy8gICAgICAgbGV0IHN0YWtlZDIgPSBzaGFyZUF0KGNoYWluLCB3YWxsZXRfMiwgQkxPQ0tfTlIpXG4vLyAgICAgICBzdGFrZWQxLnN0YWtlZC5leHBlY3RVaW50KDUwMF8wMDApXG4vLyAgICAgICBzdGFrZWQyLnN0YWtlZC5leHBlY3RVaW50KDUwMF8wMDApXG4vLyAgICAgICBzdGFrZWQyLnRvdGFsLmV4cGVjdFVpbnQoMV8wMDBfMDAwKVxuLy8gICAgICAgLy8gYWZ0ZXIgdW5zdGFrZVxuLy8gICAgICAgc3Rha2VkMSA9IHNoYXJlQXQoY2hhaW4sIHdhbGxldF8xLCBCTE9DS19OUiArIDEpXG4vLyAgICAgICBzdGFrZWQyID0gc2hhcmVBdChjaGFpbiwgd2FsbGV0XzIsIEJMT0NLX05SICsgMSlcbi8vICAgICAgIHN0YWtlZDEuc3Rha2VkLmV4cGVjdFVpbnQoMClcbi8vICAgICAgIHN0YWtlZDIuc3Rha2VkLmV4cGVjdFVpbnQoNTAwXzAwMClcbi8vICAgICAgIHN0YWtlZDIudG90YWwuZXhwZWN0VWludCg1MDBfMDAwKVxuXG4vLyAgICAgICBsZXQgYXNzZXRzID0gY2hhaW4uZ2V0QXNzZXRzTWFwcygpLmFzc2V0c1xuLy8gICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1snLnZlbGFyLnZlbGFyJ11bd2FsbGV0XzFdLCA1MDBfMDAwKVxuLy8gICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1snU1RYJ11bd2FsbGV0XzFdLCBJTklUQUlMX1NUWCArIDUwMClcbi8vICAgfVxuLy8gfSlcblxuLy8gLy8gTk9URTogbG90cyBvZiBzbWFsbCB0cmFuc2ZlcnMsIGlzIHRoYXQgYSBwcm9ibGVtP1xuLy8gQ2xhcmluZXQudGVzdCh7XG4vLyAgICAgbmFtZTogXCJ1bnN0YWtlLWFuZC1jbGFpbTogdW5zdGFrZSBwYXJ0LCB0aGVuIGFsbFwiLFxuLy8gICAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxTdHJpbmcsIEFjY291bnQ+KSB7XG4vLyAgICAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KCd3YWxsZXRfMScpIS5hZGRyZXNzXG4vLyAgICAgICAgIGNvbnN0IFBPT0wgPSAxXG4vLyAgICAgICAgIGNvbnN0IElOSVRBSUxfU1RYID0gMTAwMDAwMDAwMDAwMDAwXG5cbi8vICAgICAgICAgLy8gTk9URTogY2FuIG9ubHkgdW5zdGFrZSBvbmNlIHdlJ3ZlIHBhc3NlZCB0aGlzLi5cbi8vICAgICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2soRVBPQ0hfTEVOR1RIKVxuXG4vLyAgICAgICAgIGxldCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4vLyAgICAgICAgICAgICAvLyBzaG9ydGN1dFxuLy8gICAgICAgICAgICAgbWludFdTVFgoZGlzdHJpYnV0b3IsIDEwXzAwMCksXG4vLyAgICAgICAgICAgICBtaW50VmVsYXIoZGlzdHJpYnV0b3IsIDEwXzAwMCksXG4vLyAgICAgICAgICAgICBtaW50VmVsYXIod2FsbGV0XzEsIDUwMF8wMDApLFxuLy8gICAgICAgICBdKVxuXG4vLyAgICAgICAgIC8vIHN0YWtlICYgYWRkIHJldmVudWVcbi8vICAgICAgICAgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuLy8gICAgICAgICAgICAgc3Rha2Uod2FsbGV0XzEsIDUwMF8wMDApLFxuLy8gICAgICAgICBdKVxuXG4vLyAgICAgICAgIHNlbmRSZXZldWVBc0NvcmUoY2hhaW4sIFBPT0wsIGZhbHNlLCAxXzAwMCksXG4gICAgICBcbi8vICAgICAgICAgYXNzZXJ0RXF1YWxzKGJsb2NrLmhlaWdodCwgNjA1KVxuLy8gICAgICAgICBsZXQgQkxPQ0tfTlIgPSA2MDVcblxuLy8gICAgICAgICAvLyB1bnN0YWtlIHNvbWVcbi8vICAgICAgICAgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuLy8gICAgICAgICAgICAgdW5zdGFrZUFuZENsYWltKHdhbGxldF8xLCBQT09MLCAyMDBfMDAwKVxuLy8gICAgICAgICBdKVxuLy8gICAgICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuXG4vLyAgICAgICAgIC8vIG1vcmUgcmV3YXJkc1xuLy8gICAgICAgICBzZW5kUmV2ZXVlQXNDb3JlKGNoYWluLCBQT09MLCBmYWxzZSwgMV8wMDApLFxuLy8gICAgICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuXG4vLyAgICAgICAgIC8vIHVuc3Rha2UgcmVzdFxuLy8gICAgICAgICAvLyBOT1RFOiB0aGlzIGZhaWxzIFVud3JhcEZhaWx1cmUgZGlzdHJpYnV0ZS1lcG9jaFxuLy8gICAgICAgICAvLyBhc3NlcnRpb246IChub3QgaGFzLWNsYWltZWQtYmxvY2sgZmFpbHM/KSB3aXRob3V0IG1hcCBpdCBzdWNjZWVkcywgYnV0IHVuc3Rha2UgZG9lc24ndCBoYXBwZW5cbi8vICAgICAgICAgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuLy8gICAgICAgICAgICAgdW5zdGFrZUFuZENsYWltKHdhbGxldF8xLCBQT09MLCAzMDBfMDAwKVxuLy8gICAgICAgICBdKVxuXG4vLyAgICAgICAgIGxldCByZXdhcmRzID0gZ2V0UmV3YXJkcyhjaGFpbiwgd2FsbGV0XzEsIFBPT0wsIDEwMClcbi8vICAgICAgICAgY29uc29sZS5sb2coJ3Jld2FyZC1ibG9ja3MnLCByZXdhcmRzWydyZXdhcmQtYmxvY2tzJ10pXG5cbi8vICAgICAgICAgLy8gY29uc29sZS5sb2coYmxvY2sucmVjZWlwdHNbMF0uZXZlbnRzKVxuLy8gICAgICAgICAvLyBjb25zb2xlLmxvZygnYmxvY2sgaGVpZ2h0JywgYmxvY2suaGVpZ2h0KVxuLy8gICAgICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuXG4vLyAgICAgICAgIC8vIGJlZm9yZSB1bnN0YWtlXG4vLyAgICAgICAgIGxldCBzdGFrZWQxID0gc2hhcmVBdChjaGFpbiwgd2FsbGV0XzEsIEJMT0NLX05SKVxuLy8gICAgICAgICBzdGFrZWQxLnN0YWtlZC5leHBlY3RVaW50KDUwMF8wMDApXG4vLyAgICAgICAgIC8vIGFmdGVyIHVuc3Rha2UgcGFydFxuLy8gICAgICAgICBzdGFrZWQxID0gc2hhcmVBdChjaGFpbiwgd2FsbGV0XzEsIEJMT0NLX05SICsgMSlcbi8vICAgICAgICAgc3Rha2VkMS5zdGFrZWQuZXhwZWN0VWludCgwKVxuLy8gICAgICAgICBsZXQgYXNzZXRzID0gY2hhaW4uZ2V0QXNzZXRzTWFwcygpLmFzc2V0c1xuLy8gICAgICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzWycudmVsYXIudmVsYXInXVt3YWxsZXRfMV0sIDIwMF8wMDApXG4vLyAgICAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbJ1NUWCddW3dhbGxldF8xXSwgSU5JVEFJTF9TVFggKyAxXzAwMClcbi8vICAgICAgICAgLy8gYWZ0ZXIgdW5zdGFrZSBhbGxcbi8vICAgICB9XG4vLyB9KVxuXG4vLyBURVNUOiBzdGFrZS91bnN0YWtlL2NsYWltIGF0IGRpZmZlcmVudCB0aW1lcywgbXVsdGlwbGUgdXNlcnMuLlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLFNBQVMsUUFBUSxFQUFFLEVBQUUsRUFBa0IsS0FBSyxRQUFvQiw4Q0FBOEMsQ0FBQztBQUMvRyxTQUFTLFlBQVksUUFBUSxpREFBaUQsQ0FBQztBQUMvRSxTQUFrQixLQUFLLFFBQWlCLG1CQUFtQixDQUFDO0FBQzVELFNBQVMsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLFFBQVUsV0FBVyxDQUFDO0FBQzlELFNBQVMsUUFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFNBQVMsUUFBUSxlQUFlLENBQUM7QUFFdkYsTUFBTSxFQUNKLFdBQVcsQ0FBQSxFQUNYLElBQUksQ0FBQSxFQUNKLElBQUksQ0FBQSxFQUNKLEtBQUssQ0FBQSxJQUNOLEdBQUcsU0FB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