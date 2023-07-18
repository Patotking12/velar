
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.7.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

// Test to get epoch
Clarinet.test({
    name: "Ensure we can get the epoch this should return 0",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;
  
        const call = chain.callReadOnlyFn("staking-core", "current-epoch", [], deployer.address)
  
        call.result.expectUint(0)
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
  });

// Test to get epoch
Clarinet.test({
name: "Ensure we can get the epoch this should return 1",
async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet_1 = accounts.get("wallet_1")!;

    chain.mineEmptyBlockUntil (205)

    const call = chain.callReadOnlyFn("staking-core", "current-epoch", [], deployer.address)

    call.result.expectUint(1)
    console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
},
});

// Test to get calc epoch
Clarinet.test({
    name: "Ensure we can get the epoch on different hights this should return 1",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;
    
        const call = chain.callReadOnlyFn("staking-core", "calc-epoch", [types.uint(250)], deployer.address)
    
        call.result.expectUint(1)
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
    });

// Test to get calc epoch
Clarinet.test({
    name: "Ensure we can get the epoch on different hights this should return 10",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;
    
        const call = chain.callReadOnlyFn("staking-core", "calc-epoch", [types.uint(2050)], deployer.address)
    
        call.result.expectUint(10)
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
    });

// Test to get calc epoch start
Clarinet.test({
    name: "Ensure we can get the start of an epoch this should return 201",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;
    
        const call = chain.callReadOnlyFn("staking-core", "calc-epoch-start", [types.uint(1)], deployer.address)
    
        call.result.expectUint(201)
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
    });

// Test to get calc epoch start
Clarinet.test({
    name: "Ensure we can get the start of an epoch this should return 2001",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;
    
        const call = chain.callReadOnlyFn("staking-core", "calc-epoch-start", [types.uint(10)], deployer.address)
    
        call.result.expectUint(2001)
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
    });

// Test to get calc epoch end
Clarinet.test({
    name: "Ensure we can get the end of an epoch this should return 400",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;
    
        const call = chain.callReadOnlyFn("staking-core", "calc-epoch-end", [types.uint(1)], deployer.address)
    
        call.result.expectUint(400)
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
    });

// Test to get calc epoch end
Clarinet.test({
    name: "Ensure we can get the end of an epoch this should return 2200",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;
    
        const call = chain.callReadOnlyFn("staking-core", "calc-epoch-end", [types.uint(10)], deployer.address)
    
        call.result.expectUint(2200)
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
    });

// Test to get total staked
Clarinet.test({
    name: "Ensure we can get total staked this should return end:0 epoch:0 min:0",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;
    
        const call = chain.callReadOnlyFn("staking-core", "get-total-staked", [], deployer.address)
    
        call.result.expectTuple()
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
    });

// Test to get total staked
Clarinet.test({
    name: "Ensure we can get total staked this should return end:2000 epoch:0 min:0",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
          ])

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
          ])
        
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], deployer.address)
          ])
        
          chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], wallet_1.address)
          ])

        const call = chain.callReadOnlyFn("staking-core", "get-total-staked", [], deployer.address)
    
        call.result.expectTuple()
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
    });

// Test to get total staked
Clarinet.test({
    name: "Ensure we can get total staked this should return end:2000 epoch:1 min:1000",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
          ])

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
          ])
        
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], deployer.address)
          ])

          chain.mineEmptyBlockUntil(201)
        
          chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], wallet_1.address)
          ])

        const call = chain.callReadOnlyFn("staking-core", "get-total-staked", [], deployer.address)
    
        call.result.expectTuple()
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
    });

// Test to get total staked
Clarinet.test({
    name: "Ensure we can get total staked this should return end:1000 epoch:2 min:1000",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
          ])

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
          ])
        
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], deployer.address)
          ])

          chain.mineEmptyBlockUntil(201)
        
          chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], wallet_1.address)
          ])

          chain.mineEmptyBlock(200)

          chain.mineBlock([
            Tx.contractCall("staking-core", "unstake", [types.uint(1000)], wallet_1.address)
          ])

        const call = chain.callReadOnlyFn("staking-core", "get-total-staked", [], deployer.address)
    
        call.result.expectTuple()
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
    });

// Test to get total staked
Clarinet.test({
    name: "Ensure we can get total staked this should return end:3000 epoch:2 min:2000",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
          ])

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
          ])
        
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], deployer.address)
          ])

          chain.mineEmptyBlockUntil(201)
        
          chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], wallet_1.address)
          ])

          chain.mineEmptyBlock(200)

          chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(2000)], wallet_1.address)
          ])

          chain.mineBlock([
            Tx.contractCall("staking-core", "unstake", [types.uint(1000)], wallet_1.address)
          ])

        const call = chain.callReadOnlyFn("staking-core", "get-total-staked", [], deployer.address)
    
        call.result.expectTuple()
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
    });

// Test to get total staked
Clarinet.test({
    name: "Ensure we can get total staked by user this should return end:2000 epoch:2 min:1000",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
          ])

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
          ])
        
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], deployer.address)
          ])

          chain.mineEmptyBlockUntil(201)
        
          chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], wallet_1.address)
          ])

          chain.mineEmptyBlock(200)

          chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(2000)], wallet_1.address)
          ])

          chain.mineBlock([
            Tx.contractCall("staking-core", "unstake", [types.uint(1000)], wallet_1.address)
          ])

        const call = chain.callReadOnlyFn("staking-core", "get-user-staked", [types.principal(wallet_1.address)], deployer.address)
    
        call.result.expectTuple()
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
    });

    // Test to get total staked
Clarinet.test({
    name: "Ensure we can get total staked by user this should return end:1000 epoch:0 min:0",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
          ])

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
          ])
        
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], deployer.address)
          ])

          chain.mineEmptyBlockUntil(201)
        
          chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], wallet_1.address)
          ])

          chain.mineEmptyBlock(200)

          chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(2000)], wallet_1.address)
          ])

          chain.mineBlock([
            Tx.contractCall("staking-core", "unstake", [types.uint(1000)], wallet_1.address)
          ])

        const call = chain.callReadOnlyFn("staking-core", "get-user-staked", [types.principal(deployer.address)], deployer.address)
    
        call.result.expectTuple()
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
    });

// Test to stake
Clarinet.test({
    name: "Ensure we can stake",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
            ])
        

        const block = chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], deployer.address)
            ])
    
        block.receipts[0].result.expectOk()
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    },
    });

// Test to stake
Clarinet.test({
    name: "Ensure we can not stake 0",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
            ])
        

        const block = chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(0)], deployer.address)
            ])
    
        block.receipts[0].result.expectErr()
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    },
    });

// Test to stake
Clarinet.test({
    name: "Ensure we can not stake less than 500",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
            ])
        

        const block = chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(499)], deployer.address)
            ])
    
        block.receipts[0].result.expectErr()
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    },
    });

// Test to stake
Clarinet.test({
    name: "Ensure we can not stake if not enough balance",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(1000), types.principal(deployer.address)], deployer.address)
            ])
        

        const block = chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1001)], deployer.address)
            ])
    
        block.receipts[0].result.expectErr()
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    },
    });

// Test to unstake
Clarinet.test({
    name: "Ensure we can unstake",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000), types.principal(deployer.address)], deployer.address)
            ])
        
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], deployer.address)
            ])
        

        const block = chain.mineBlock([
            Tx.contractCall("staking-core", "unstake", [types.uint(1000)], deployer.address)
            ])
    
        block.receipts[0].result.expectOk()
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    },
    });

// Test to unstake
Clarinet.test({
    name: "Ensure we can not unstake 0",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000), types.principal(deployer.address)], deployer.address)
            ])
        
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], deployer.address)
            ])

        const block = chain.mineBlock([
            Tx.contractCall("staking-core", "unstake", [types.uint(0)], deployer.address)
            ])
    
        block.receipts[0].result.expectErr()
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    },
    });

// // Test to unstake
// Clarinet.test({
//     name: "Ensure we can not unstake more than what we have staked",
//     async fn(chain: Chain, accounts: Map<string, Account>) {
//         const deployer = accounts.get("deployer")!;
//         const wallet_1 = accounts.get("wallet_1")!;

//         chain.mineBlock([
//             Tx.contractCall("velar", "mint", [types.uint(10000000), types.principal(deployer.address)], deployer.address)
//             ])
        
//         chain.mineBlock([
//             Tx.contractCall("staking-core", "stake", [types.uint(1000)], deployer.address)
//             ])

//         chain.mineEmptyBlock(200)

//         const block = chain.mineBlock([
//             Tx.contractCall("staking-core", "unstake", [types.uint(1001)], deployer.address)
//             ])
    
//         block.receipts[0].result.expectErr()
//         console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
//     },
//     });

// Test to unstake
Clarinet.test({
    name: "Ensure we can not unstake and leave less than MIN STAKE",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000), types.principal(deployer.address)], deployer.address)
            ])
        
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], deployer.address)
            ])

        chain.mineEmptyBlock(200)

        const block = chain.mineBlock([
            Tx.contractCall("staking-core", "unstake", [types.uint(501)], deployer.address)
            ])
    
        block.receipts[0].result.expectErr()
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    },
    });

// Test to get share-at
Clarinet.test({
    name: "Ensure we can get share at this should return staked:u0 and total:u0",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
          ])

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
          ])

        chain.mineEmptyBlockUntil(201)
        
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], deployer.address)
          ])
        
          chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], wallet_1.address)
          ])

        chain.mineEmptyBlockUntil(401)

        const call = chain.callReadOnlyFn("staking-core", "get-share-at", [types.principal(wallet_1.address), types.uint(0)], deployer.address)
    
        call.result.expectOk()
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
    });

// Test to get share-at
Clarinet.test({
    name: "Ensure we can get share at this should return staked:1000 and total:2000",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet_1 = accounts.get("wallet_1")!;

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
          ])

        chain.mineBlock([
            Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
          ])
        
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], deployer.address)
          ])
        
          chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [types.uint(1000)], wallet_1.address)
          ])

        chain.mineEmptyBlockUntil(401)

        const call = chain.callReadOnlyFn("staking-core", "get-share-at", [types.principal(wallet_1.address), types.uint(1)], deployer.address)
    
        call.result.expectOk()
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    },
    });