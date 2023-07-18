import { Clarinet, Tx, types } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
// Test to get owner
Clarinet.test({
    name: "Ensure we can get the owner of the contract initially set to deployer",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const call = chain.callReadOnlyFn("core", "get-owner", [], deployer.address);
        call.result.expectPrincipal(deployer.address);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test change owner
Clarinet.test({
    name: "Ensure current owner can change the owner",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("core", "set-owner", [
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test change owner
Clarinet.test({
    name: "Ensure that not owner can't change the owner",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("core", "set-owner", [
                types.principal(wallet_1.address)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to get fee-to address
Clarinet.test({
    name: "Ensure we can get the fee-to of the contract initially set to deployer",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const call = chain.callReadOnlyFn("core", "get-fee-to", [], deployer.address);
        call.result.expectPrincipal(deployer.address);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test change fee-to
Clarinet.test({
    name: "Ensure current owner can change the fee-to address",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("core", "set-fee-to", [
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test change fee-to
Clarinet.test({
    name: "Ensure that not owner can't change the fee-to address",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("core", "set-fee-to", [
                types.principal(wallet_1.address)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to get rev-share address
Clarinet.test({
    name: "Ensure we can get the rev-share of the contract initially set to deployer",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const call = chain.callReadOnlyFn("core", "get-rev-share", [], deployer.address);
        call.result.expectPrincipal(deployer.address);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test change rev-share
Clarinet.test({
    name: "Ensure current owner can change the rev-share address",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test change rev-share
Clarinet.test({
    name: "Ensure that not owner can't change the rev-share address",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal(wallet_1.address)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get nr-pools
Clarinet.test({
    name: "Ensure that nr-pools returns u0 if no pools have been created",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("core", "get-nr-pools", [], wallet_1.address)
        ]);
        block.receipts[0].result.expectUint(0);
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get nr-pools
Clarinet.test({
    name: "Ensure that nr-pools returns u1 if 1 pool has been created",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "get-nr-pools", [], wallet_1.address)
        ]);
        block.receipts[0].result.expectUint(1);
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get pool information
Clarinet.test({
    name: "Ensure that we get none from a non existing pool",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("core", "get-pool", [
                types.uint(1)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectNone();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get pool information
Clarinet.test({
    name: "Ensure that we get pool information from an existing pool",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "get-pool", [
                types.uint(1)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectSome();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get pool information
Clarinet.test({
    name: "Ensure that we get pool information from an existing pool with do-get-pool",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "do-get-pool", [
                types.uint(1)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get pool id
Clarinet.test({
    name: "Ensure that we get pool id from an existing pool",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "get-pool-id", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar")
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectSome().expectUint(1);
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get pool id
Clarinet.test({
    name: "Ensure that we get pool id from an existing pool with lookup-pool",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "lookup-pool", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar")
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectSome().expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get pool id
Clarinet.test({
    name: "Ensure that we get pool id from an existing pool with lookup-pool flipped",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "lookup-pool", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI")
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectSome().expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to get revenue from a pool
Clarinet.test({
    name: "Ensure we get the revenue of an existing pool",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const call = chain.callReadOnlyFn("core", "do-get-revenue", [
            types.uint(1)
        ], deployer.address);
        call.result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to check-fee
Clarinet.test({
    name: "Ensure we get FALSE if fee is not bigger than guard",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const call = chain.callReadOnlyFn("core", "check-fee", [
            types.tuple({
                num: types.uint(994),
                den: types.uint(1000)
            }),
            types.tuple({
                num: types.uint(995),
                den: types.uint(1000)
            }), 
        ], deployer.address);
        call.result.expectBool(false);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to check-fee
Clarinet.test({
    name: "Ensure we get TRUE if fee is bigger than guard",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const call = chain.callReadOnlyFn("core", "check-fee", [
            types.tuple({
                num: types.uint(996),
                den: types.uint(1000)
            }),
            types.tuple({
                num: types.uint(995),
                den: types.uint(1000)
            }), 
        ], deployer.address);
        call.result.expectBool(true);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to update-swap-fee
Clarinet.test({
    name: "Ensure we can update the swap-fee if owner",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "update-swap-fee", [
                types.uint(1),
                types.tuple({
                    num: types.uint(998),
                    den: types.uint(1000)
                })
            ], deployer.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to update-swap-fee
Clarinet.test({
    name: "Ensure we can update the swap-fee if owner get information back",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "update-swap-fee", [
                types.uint(1),
                types.tuple({
                    num: types.uint(998),
                    den: types.uint(1000)
                })
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "get-pool", [
                types.uint(1)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectSome();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to update-swap-fee
Clarinet.test({
    name: "Ensure we can not update the swap-fee if not owner",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "update-swap-fee", [
                types.uint(1),
                types.tuple({
                    num: types.uint(998),
                    den: types.uint(1000)
                })
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to update-swap-fee
Clarinet.test({
    name: "Ensure we can not update the swap-fee if it is not bigger than MAX-SWAP-FEE",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "update-swap-fee", [
                types.uint(1),
                types.tuple({
                    num: types.uint(994),
                    den: types.uint(1000)
                })
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to update-protocol-fee
Clarinet.test({
    name: "Ensure we can update the protocol-fee if owner",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "update-protocol-fee", [
                types.uint(1),
                types.tuple({
                    num: types.uint(998),
                    den: types.uint(1000)
                })
            ], deployer.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to update-protocol-fee
Clarinet.test({
    name: "Ensure we can update the protocol-fee if owner get information back",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "update-protocol-fee", [
                types.uint(1),
                types.tuple({
                    num: types.uint(998),
                    den: types.uint(1000)
                })
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "get-pool", [
                types.uint(1)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectSome();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to update-protocol-fee
Clarinet.test({
    name: "Ensure we can not update the protocol-fee if not owner",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "update-protocol-fee", [
                types.uint(1),
                types.tuple({
                    num: types.uint(998),
                    den: types.uint(1000)
                })
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to update-share-fee
Clarinet.test({
    name: "Ensure we can update the share-fee if owner",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "update-share-fee", [
                types.uint(1),
                types.tuple({
                    num: types.uint(998),
                    den: types.uint(1000)
                })
            ], deployer.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to update-share-fee
Clarinet.test({
    name: "Ensure we can update the share-fee if owner get information back",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "update-share-fee", [
                types.uint(1),
                types.tuple({
                    num: types.uint(998),
                    den: types.uint(1000)
                })
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "get-pool", [
                types.uint(1)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectSome();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to update-share-fee
Clarinet.test({
    name: "Ensure we can not update the share-fee if not owner",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "update-share-fee", [
                types.uint(1),
                types.tuple({
                    num: types.uint(998),
                    den: types.uint(1000)
                })
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to create a pool
Clarinet.test({
    name: "Ensure we can create a pool if owner",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to create a pool
Clarinet.test({
    name: "Ensure we can not create a pool if not owner",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to create a pool
Clarinet.test({
    name: "Ensure we can not create a pool even if tokens flipped",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token-2"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to create a pool
Clarinet.test({
    name: "Ensure we can not create pool if same tokens",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to create a pool
Clarinet.test({
    name: "Ensure we can not create a pool if same tokens for second pool",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to create a pool
Clarinet.test({
    name: "Ensure we can not create a pool if same lp-token for second pool",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH-2"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to create a pool
Clarinet.test({
    name: "Ensure we can not create pool if swap-fee num bigger than den",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(1001),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to create a pool
Clarinet.test({
    name: "Ensure we can not create pool if protocol-fee num bigger than den",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(1001),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to create a pool
Clarinet.test({
    name: "Ensure we can not create pool if share-fee num bigger than den",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(1001),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to create a pool
Clarinet.test({
    name: "Ensure we can not create pool if swap-fee is smaller than MAX-SWAP-FEE",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(994),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to mint 
Clarinet.test({
    name: "Ensure we can mint to an existing pool",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(100000)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to mint 
Clarinet.test({
    name: "Ensure we can mint twice to an existing pool",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000),
                types.uint(1000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(200000),
                types.uint(1)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to mint 
Clarinet.test({
    name: "Ensure we can mint twice to an existing pool and reserves are updated",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000),
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(200000),
                types.uint(1)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "get-pool", [
                types.uint(1)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectSome().expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
////////////////////////////
////////////////////////////
////////// Failed //////////
////////////////////////////
////////////////////////////
// // Test to mint 
// Clarinet.test({
//   name: "Ensure we can mint to an existing pool even if tokens flipped",
//   async fn(chain: Chain, accounts: Map<string, Account>) {
//       const deployer = accounts.get("deployer")!;
//       const wallet_1 = accounts.get("wallet_1")!;
//       chain.mineBlock([
//         Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
//       ])
//       chain.mineBlock([
//         Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
//       ])
//       chain.mineBlock([
//         Tx.contractCall("core", "create", 
//           [
//             types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
//             types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
//             types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
//             types.tuple({ num: types.uint(996), den: types.uint(1000) }),
//             types.tuple({ num: types.uint(996), den: types.uint(1000) }),
//             types.tuple({ num: types.uint(996), den: types.uint(1000) }),
//           ], deployer.address)
//       ]);
//       const block = chain.mineBlock([
//         Tx.contractCall("core", "mint", 
//           [
//             types.uint(1),
//             types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
//             types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
//             types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
//             types.uint(100000),
//             types.uint(100000)
//           ], wallet_1.address)
//       ]);
//     block.receipts[0].result.expectOk()
//     console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
//   },
// });
// Test to mint 
Clarinet.test({
    name: "Ensure we can not mint to an existing pool if not the correct lp-token",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token-2"),
                types.uint(100000),
                types.uint(100000)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to mint 
Clarinet.test({
    name: "Ensure we can not mint to an existing pool if not the correct token-0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(100000)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to mint 
Clarinet.test({
    name: "Ensure we can not mint to an existing pool if not the correct token-1",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(100000)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to mint 
Clarinet.test({
    name: "Ensure we can not mint to an existing pool if token-0 is 0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(0),
                types.uint(100000)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to mint 
Clarinet.test({
    name: "Ensure we can not mint to an existing pool if token-1 is 0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(0)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to burn 
Clarinet.test({
    name: "Ensure we can burn",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(100000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "burn", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000), 
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to burn 
Clarinet.test({
    name: "Ensure we can burn when minting different amounts",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(1)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "burn", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(316), 
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to burn 
Clarinet.test({
    name: "Ensure we can burn when minting different amounts and we burn the total of our liquidity we receive back the total we added",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(100000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(1)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "burn", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100001), 
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to burn 
Clarinet.test({
    name: "Ensure we can burn when minting different amounts and we burn only 1 and then 1 again and again",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(100000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(1)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "burn", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1), 
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "burn", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1), 
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "burn", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1), 
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to burn 
Clarinet.test({
    name: "Ensure we can burn when minting different amounts and we burn and reserves are updated",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(100000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(1)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "burn", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1), 
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "burn", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000), 
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "get-pool", [
                types.uint(1)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectSome().expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to burn 
Clarinet.test({
    name: "Ensure we can not burn if lp-token not the same as pool",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("ETH", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("ETH-2", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH-2"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token-2"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(100000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(2),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH-2"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token-2"),
                types.uint(100000),
                types.uint(100000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "burn", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token-2"),
                types.uint(100000), 
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to burn 
Clarinet.test({
    name: "Ensure we can not burn if token-0 not the same as pool",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(100000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "burn", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000), 
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to burn 
Clarinet.test({
    name: "Ensure we can not burn if token-1 not the same as pool",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(100000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "burn", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000), 
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to burn 
Clarinet.test({
    name: "Ensure we can not burn if liquidity is 0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(100000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "burn", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(0), 
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to burn 
Clarinet.test({
    name: "Ensure we can not burn if amt0 is 0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1),
                types.uint(100000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "burn", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1), 
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to burn 
Clarinet.test({
    name: "Ensure we can not burn if amt1 is 1",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(100000),
                types.uint(1)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "burn", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1), 
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to burn 
Clarinet.test({
    name: "Ensure we can not burn if not enough balance to burn",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "burn", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000001), 
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can swap",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(995)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can't swap if token-in is not token-0 or token-1",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(995)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can't swap if token-out is not token-0 or token-1",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(995)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can't swap if token-in is equal to token-out",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(995)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can't swap if rev-share wrong",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(995)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can't swap if token-in is 0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(0),
                types.uint(995)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can't swap if token-in is 0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(0)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can't swap if token-out is 0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1),
                types.uint(1)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can't swap if not enought amount to transfer token-in",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(1000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(1000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(995)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can't swap if token-in is 0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(996)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we update revenue",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(995)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(995)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "do-get-revenue", [
                types.uint(1)
            ], deployer.address)
        ]);
        block.receipts[0].result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can collect",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(995)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(995)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "collect", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"), 
            ], deployer.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can not collect if tokens mixed",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(995)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(995)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "collect", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"), 
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can not collect if not fee-to address",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(995)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(995)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "collect", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"), 
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can not collect if no revenue",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "collect", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"), 
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can not collect if no revenue on token0 ",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000),
                types.uint(1000000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000),
                types.uint(995)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "collect", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"), 
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Ensure we can not collect if no revenue on token1",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000000000),
                types.uint(1000000000000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000000000),
                types.uint(995000000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "collect", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"), 
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to swap 
Clarinet.test({
    name: "Testing swap",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("DAI", "mint", [
                types.uint(10000000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "set-rev-share", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "create", [
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }),
                types.tuple({
                    num: types.uint(996),
                    den: types.uint(1000)
                }), 
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("core", "mint", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
                types.uint(1000000000000),
                types.uint(1000000000000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("core", "swap", [
                types.uint(1),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
                types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
                types.uint(1000000000),
                types.uint(995008971)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvUGF0b19Hb21lei9EZXNrdG9wL1ZlbGFyL3ZlbGFyL3Rlc3RzL2NvcmUtU3RyYXRhX3Rlc3QudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2xhcmluZXQsIFR4LCBDaGFpbiwgQWNjb3VudCwgdHlwZXMsIEVtcHR5QmxvY2sgfSBmcm9tICdodHRwczovL2Rlbm8ubGFuZC94L2NsYXJpbmV0QHYxLjYuMC9pbmRleC50cyc7XG5pbXBvcnQgeyBhc3NlcnRFcXVhbHMgfSBmcm9tICdodHRwczovL2Rlbm8ubGFuZC9zdGRAMC45MC4wL3Rlc3RpbmcvYXNzZXJ0cy50cyc7XG5cbi8vIFRlc3QgdG8gZ2V0IG93bmVyXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGdldCB0aGUgb3duZXIgb2YgdGhlIGNvbnRyYWN0IGluaXRpYWxseSBzZXQgdG8gZGVwbG95ZXJcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNvbnN0IGNhbGwgPSBjaGFpbi5jYWxsUmVhZE9ubHlGbihcImNvcmVcIiwgXCJnZXQtb3duZXJcIiwgW10sIGRlcGxveWVyLmFkZHJlc3MpXG5cbiAgICAgIGNhbGwucmVzdWx0LmV4cGVjdFByaW5jaXBhbChkZXBsb3llci5hZGRyZXNzKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShjYWxsLnJlc3VsdCkgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IGNoYW5nZSBvd25lclxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIGN1cnJlbnQgb3duZXIgY2FuIGNoYW5nZSB0aGUgb3duZXJcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwic2V0LW93bmVyXCIsIFt0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RPaygpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgY2hhbmdlIG93bmVyXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgdGhhdCBub3Qgb3duZXIgY2FuJ3QgY2hhbmdlIHRoZSBvd25lclwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJzZXQtb3duZXJcIiwgW3R5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gZ2V0IGZlZS10byBhZGRyZXNzXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGdldCB0aGUgZmVlLXRvIG9mIHRoZSBjb250cmFjdCBpbml0aWFsbHkgc2V0IHRvIGRlcGxveWVyXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjb25zdCBjYWxsID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oXCJjb3JlXCIsIFwiZ2V0LWZlZS10b1wiLCBbXSwgZGVwbG95ZXIuYWRkcmVzcylcblxuICAgICAgY2FsbC5yZXN1bHQuZXhwZWN0UHJpbmNpcGFsKGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgY2hhbmdlIGZlZS10b1xuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIGN1cnJlbnQgb3duZXIgY2FuIGNoYW5nZSB0aGUgZmVlLXRvIGFkZHJlc3NcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwic2V0LWZlZS10b1wiLCBbdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IGNoYW5nZSBmZWUtdG9cbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB0aGF0IG5vdCBvd25lciBjYW4ndCBjaGFuZ2UgdGhlIGZlZS10byBhZGRyZXNzXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInNldC1mZWUtdG9cIiwgW3R5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gZ2V0IHJldi1zaGFyZSBhZGRyZXNzXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGdldCB0aGUgcmV2LXNoYXJlIG9mIHRoZSBjb250cmFjdCBpbml0aWFsbHkgc2V0IHRvIGRlcGxveWVyXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjb25zdCBjYWxsID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oXCJjb3JlXCIsIFwiZ2V0LXJldi1zaGFyZVwiLCBbXSwgZGVwbG95ZXIuYWRkcmVzcylcblxuICAgICAgY2FsbC5yZXN1bHQuZXhwZWN0UHJpbmNpcGFsKGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgY2hhbmdlIHJldi1zaGFyZVxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIGN1cnJlbnQgb3duZXIgY2FuIGNoYW5nZSB0aGUgcmV2LXNoYXJlIGFkZHJlc3NcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwic2V0LXJldi1zaGFyZVwiLCBbdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IGNoYW5nZSByZXYtc2hhcmVcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB0aGF0IG5vdCBvd25lciBjYW4ndCBjaGFuZ2UgdGhlIHJldi1zaGFyZSBhZGRyZXNzXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInNldC1yZXYtc2hhcmVcIiwgW3R5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgZ2V0IG5yLXBvb2xzXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgdGhhdCBuci1wb29scyByZXR1cm5zIHUwIGlmIG5vIHBvb2xzIGhhdmUgYmVlbiBjcmVhdGVkXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImdldC1uci1wb29sc1wiLCBbXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0VWludCgwKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IGdldCBuci1wb29sc1xuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHRoYXQgbnItcG9vbHMgcmV0dXJucyB1MSBpZiAxIHBvb2wgaGFzIGJlZW4gY3JlYXRlZFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJnZXQtbnItcG9vbHNcIiwgW10sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdFVpbnQoMSlcbiAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCBnZXQgcG9vbCBpbmZvcm1hdGlvblxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHRoYXQgd2UgZ2V0IG5vbmUgZnJvbSBhIG5vbiBleGlzdGluZyBwb29sXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImdldC1wb29sXCIsIFt0eXBlcy51aW50KDEpXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0Tm9uZSgpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgZ2V0IHBvb2wgaW5mb3JtYXRpb25cbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB0aGF0IHdlIGdldCBwb29sIGluZm9ybWF0aW9uIGZyb20gYW4gZXhpc3RpbmcgcG9vbFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJnZXQtcG9vbFwiLCBbdHlwZXMudWludCgxKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdFNvbWUoKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IGdldCBwb29sIGluZm9ybWF0aW9uXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgdGhhdCB3ZSBnZXQgcG9vbCBpbmZvcm1hdGlvbiBmcm9tIGFuIGV4aXN0aW5nIHBvb2wgd2l0aCBkby1nZXQtcG9vbFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJkby1nZXQtcG9vbFwiLCBbdHlwZXMudWludCgxKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdFR1cGxlKClcbiAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCBnZXQgcG9vbCBpZFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHRoYXQgd2UgZ2V0IHBvb2wgaWQgZnJvbSBhbiBleGlzdGluZyBwb29sXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImdldC1wb29sLWlkXCIsIFt0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0U29tZSgpLmV4cGVjdFVpbnQoMSlcbiAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCBnZXQgcG9vbCBpZFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHRoYXQgd2UgZ2V0IHBvb2wgaWQgZnJvbSBhbiBleGlzdGluZyBwb29sIHdpdGggbG9va3VwLXBvb2xcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibG9va3VwLXBvb2xcIiwgW3R5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSwgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIildLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RTb21lKCkuZXhwZWN0VHVwbGUoKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IGdldCBwb29sIGlkXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgdGhhdCB3ZSBnZXQgcG9vbCBpZCBmcm9tIGFuIGV4aXN0aW5nIHBvb2wgd2l0aCBsb29rdXAtcG9vbCBmbGlwcGVkXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImxvb2t1cC1wb29sXCIsIFt0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSwgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0U29tZSgpLmV4cGVjdFR1cGxlKClcbiAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBnZXQgcmV2ZW51ZSBmcm9tIGEgcG9vbFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGdldCB0aGUgcmV2ZW51ZSBvZiBhbiBleGlzdGluZyBwb29sXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBjYWxsID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oXCJjb3JlXCIsIFwiZG8tZ2V0LXJldmVudWVcIiwgW3R5cGVzLnVpbnQoMSldLCBkZXBsb3llci5hZGRyZXNzKVxuXG4gICAgICBjYWxsLnJlc3VsdC5leHBlY3RUdXBsZSgpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gY2hlY2stZmVlXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgZ2V0IEZBTFNFIGlmIGZlZSBpcyBub3QgYmlnZ2VyIHRoYW4gZ3VhcmRcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNvbnN0IGNhbGwgPSBjaGFpbi5jYWxsUmVhZE9ubHlGbihcImNvcmVcIiwgXCJjaGVjay1mZWVcIiwgW3R5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NCksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSwgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk1KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLF0sIGRlcGxveWVyLmFkZHJlc3MpXG5cbiAgICAgIGNhbGwucmVzdWx0LmV4cGVjdEJvb2woZmFsc2UpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gY2hlY2stZmVlXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgZ2V0IFRSVUUgaWYgZmVlIGlzIGJpZ2dlciB0aGFuIGd1YXJkXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjb25zdCBjYWxsID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oXCJjb3JlXCIsIFwiY2hlY2stZmVlXCIsIFt0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NSksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxdLCBkZXBsb3llci5hZGRyZXNzKVxuXG4gICAgICBjYWxsLnJlc3VsdC5leHBlY3RCb29sKHRydWUpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gdXBkYXRlLXN3YXAtZmVlXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIHVwZGF0ZSB0aGUgc3dhcC1mZWUgaWYgb3duZXJcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInVwZGF0ZS1zd2FwLWZlZVwiLCBbdHlwZXMudWludCgxKSx0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTgpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdE9rKClcbiAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gdXBkYXRlLXN3YXAtZmVlXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIHVwZGF0ZSB0aGUgc3dhcC1mZWUgaWYgb3duZXIgZ2V0IGluZm9ybWF0aW9uIGJhY2tcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJ1cGRhdGUtc3dhcC1mZWVcIiwgW3R5cGVzLnVpbnQoMSksdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk4KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICBdKTtcblxuICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJnZXQtcG9vbFwiLCBbdHlwZXMudWludCgxKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0U29tZSgpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIHVwZGF0ZS1zd2FwLWZlZVxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgdXBkYXRlIHRoZSBzd2FwLWZlZSBpZiBub3Qgb3duZXJcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInVwZGF0ZS1zd2FwLWZlZVwiLCBbdHlwZXMudWludCgxKSx0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTgpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIHVwZGF0ZS1zd2FwLWZlZVxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgdXBkYXRlIHRoZSBzd2FwLWZlZSBpZiBpdCBpcyBub3QgYmlnZ2VyIHRoYW4gTUFYLVNXQVAtRkVFXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJ1cGRhdGUtc3dhcC1mZWVcIiwgW3R5cGVzLnVpbnQoMSksdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk0KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byB1cGRhdGUtcHJvdG9jb2wtZmVlXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIHVwZGF0ZSB0aGUgcHJvdG9jb2wtZmVlIGlmIG93bmVyXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJ1cGRhdGUtcHJvdG9jb2wtZmVlXCIsIFt0eXBlcy51aW50KDEpLHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5OCksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byB1cGRhdGUtcHJvdG9jb2wtZmVlXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIHVwZGF0ZSB0aGUgcHJvdG9jb2wtZmVlIGlmIG93bmVyIGdldCBpbmZvcm1hdGlvbiBiYWNrXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwidXBkYXRlLXByb3RvY29sLWZlZVwiLCBbdHlwZXMudWludCgxKSx0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTgpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgIF0pO1xuXG4gICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImdldC1wb29sXCIsIFt0eXBlcy51aW50KDEpXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RTb21lKClcbiAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gdXBkYXRlLXByb3RvY29sLWZlZVxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgdXBkYXRlIHRoZSBwcm90b2NvbC1mZWUgaWYgbm90IG93bmVyXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJ1cGRhdGUtcHJvdG9jb2wtZmVlXCIsIFt0eXBlcy51aW50KDEpLHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5OCksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKClcbiAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gdXBkYXRlLXNoYXJlLWZlZVxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiB1cGRhdGUgdGhlIHNoYXJlLWZlZSBpZiBvd25lclwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwidXBkYXRlLXNoYXJlLWZlZVwiLCBbdHlwZXMudWludCgxKSx0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTgpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdE9rKClcbiAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gdXBkYXRlLXNoYXJlLWZlZVxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiB1cGRhdGUgdGhlIHNoYXJlLWZlZSBpZiBvd25lciBnZXQgaW5mb3JtYXRpb24gYmFja1wiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInVwZGF0ZS1zaGFyZS1mZWVcIiwgW3R5cGVzLnVpbnQoMSksdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk4KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICBdKTtcblxuICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJnZXQtcG9vbFwiLCBbdHlwZXMudWludCgxKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0U29tZSgpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIHVwZGF0ZS1zaGFyZS1mZWVcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gbm90IHVwZGF0ZSB0aGUgc2hhcmUtZmVlIGlmIG5vdCBvd25lclwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwidXBkYXRlLXNoYXJlLWZlZVwiLCBbdHlwZXMudWludCgxKSx0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTgpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIGNyZWF0ZSBhIHBvb2xcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gY3JlYXRlIGEgcG9vbCBpZiBvd25lclwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdE9rKClcbiAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gY3JlYXRlIGEgcG9vbFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgY3JlYXRlIGEgcG9vbCBpZiBub3Qgb3duZXJcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBjcmVhdGUgYSBwb29sXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIG5vdCBjcmVhdGUgYSBwb29sIGV2ZW4gaWYgdG9rZW5zIGZsaXBwZWRcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuLTJcIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIGNyZWF0ZSBhIHBvb2xcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gbm90IGNyZWF0ZSBwb29sIGlmIHNhbWUgdG9rZW5zXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIGNyZWF0ZSBhIHBvb2xcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gbm90IGNyZWF0ZSBhIHBvb2wgaWYgc2FtZSB0b2tlbnMgZm9yIHNlY29uZCBwb29sXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKClcbiAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gY3JlYXRlIGEgcG9vbFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgY3JlYXRlIGEgcG9vbCBpZiBzYW1lIGxwLXRva2VuIGZvciBzZWNvbmQgcG9vbFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkVUSC0yXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uRVRIXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIGNyZWF0ZSBhIHBvb2xcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gbm90IGNyZWF0ZSBwb29sIGlmIHN3YXAtZmVlIG51bSBiaWdnZXIgdGhhbiBkZW5cIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoMTAwMSksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKClcbiAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gY3JlYXRlIGEgcG9vbFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgY3JlYXRlIHBvb2wgaWYgcHJvdG9jb2wtZmVlIG51bSBiaWdnZXIgdGhhbiBkZW5cIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoMTAwMSksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKClcbiAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gY3JlYXRlIGEgcG9vbFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgY3JlYXRlIHBvb2wgaWYgc2hhcmUtZmVlIG51bSBiaWdnZXIgdGhhbiBkZW5cIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoMTAwMSksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKClcbiAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gY3JlYXRlIGEgcG9vbFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgY3JlYXRlIHBvb2wgaWYgc3dhcC1mZWUgaXMgc21hbGxlciB0aGFuIE1BWC1TV0FQLUZFRVwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTQpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIG1pbnQgXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIG1pbnQgdG8gYW4gZXhpc3RpbmcgcG9vbFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibWludFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RPaygpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIG1pbnQgXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIG1pbnQgdHdpY2UgdG8gYW4gZXhpc3RpbmcgcG9vbFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcIm1pbnRcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDApLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibWludFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMjAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSlcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBtaW50IFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBtaW50IHR3aWNlIHRvIGFuIGV4aXN0aW5nIHBvb2wgYW5kIHJlc2VydmVzIGFyZSB1cGRhdGVkXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJEQUlcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibWludFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDApXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibWludFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMjAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSlcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImdldC1wb29sXCIsIFt0eXBlcy51aW50KDEpXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RTb21lKCkuZXhwZWN0VHVwbGUoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLyBGYWlsZWQgLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vLyAvLyBUZXN0IHRvIG1pbnQgXG4vLyBDbGFyaW5ldC50ZXN0KHtcbi8vICAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIG1pbnQgdG8gYW4gZXhpc3RpbmcgcG9vbCBldmVuIGlmIHRva2VucyBmbGlwcGVkXCIsXG4vLyAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4vLyAgICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbi8vICAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4vLyAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuLy8gICAgICAgICBUeC5jb250cmFjdENhbGwoXCJEQUlcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbi8vICAgICAgIF0pXG5cbi8vICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4vLyAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4vLyAgICAgICBdKVxuXG4vLyAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuLy8gICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuLy8gICAgICAgICAgIFtcbi8vICAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbi8vICAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuLy8gICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4vLyAgICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4vLyAgICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4vLyAgICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4vLyAgICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbi8vICAgICAgIF0pO1xuXG4vLyAgICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4vLyAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsIFxuLy8gICAgICAgICAgIFtcbi8vICAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4vLyAgICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbi8vICAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbi8vICAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuLy8gICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDApLFxuLy8gICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDApXG4vLyAgICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbi8vICAgICAgIF0pO1xuXG4vLyAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdE9rKClcbi8vICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuLy8gICB9LFxuLy8gfSk7XG5cbi8vIFRlc3QgdG8gbWludCBcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gbm90IG1pbnQgdG8gYW4gZXhpc3RpbmcgcG9vbCBpZiBub3QgdGhlIGNvcnJlY3QgbHAtdG9rZW5cIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcIkRBSVwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcIm1pbnRcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW4tMlwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBtaW50IFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgbWludCB0byBhbiBleGlzdGluZyBwb29sIGlmIG5vdCB0aGUgY29ycmVjdCB0b2tlbi0wXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJEQUlcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkVUSFwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibWludFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uRVRIXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBtaW50IFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgbWludCB0byBhbiBleGlzdGluZyBwb29sIGlmIG5vdCB0aGUgY29ycmVjdCB0b2tlbi0xXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJEQUlcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5FVEhcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBtaW50IFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgbWludCB0byBhbiBleGlzdGluZyBwb29sIGlmIHRva2VuLTAgaXMgMFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibWludFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKClcbiAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gbWludCBcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gbm90IG1pbnQgdG8gYW4gZXhpc3RpbmcgcG9vbCBpZiB0b2tlbi0xIGlzIDBcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcIkRBSVwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcIm1pbnRcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDApXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIGJ1cm4gXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGJ1cm5cIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcIkRBSVwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDApLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDApXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJidXJuXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDApLFxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RPaygpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIGJ1cm4gXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGJ1cm4gd2hlbiBtaW50aW5nIGRpZmZlcmVudCBhbW91bnRzXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJEQUlcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibWludFwiLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDApLFxuICAgICAgICAgICAgdHlwZXMudWludCgxKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiYnVyblwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMzE2KSxcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBidXJuIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBidXJuIHdoZW4gbWludGluZyBkaWZmZXJlbnQgYW1vdW50cyBhbmQgd2UgYnVybiB0aGUgdG90YWwgb2Ygb3VyIGxpcXVpZGl0eSB3ZSByZWNlaXZlIGJhY2sgdGhlIHRvdGFsIHdlIGFkZGVkXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJEQUlcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibWludFwiLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDApLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDApXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibWludFwiLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDApLFxuICAgICAgICAgICAgdHlwZXMudWludCgxKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiYnVyblwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAxKSxcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBidXJuIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBidXJuIHdoZW4gbWludGluZyBkaWZmZXJlbnQgYW1vdW50cyBhbmQgd2UgYnVybiBvbmx5IDEgYW5kIHRoZW4gMSBhZ2FpbiBhbmQgYWdhaW5cIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcIkRBSVwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiYnVyblwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiYnVyblwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJidXJuXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBidXJuIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBidXJuIHdoZW4gbWludGluZyBkaWZmZXJlbnQgYW1vdW50cyBhbmQgd2UgYnVybiBhbmQgcmVzZXJ2ZXMgYXJlIHVwZGF0ZWRcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcIkRBSVwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiYnVyblwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiYnVyblwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKSxcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImdldC1wb29sXCIsIFt0eXBlcy51aW50KDEpXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RTb21lKCkuZXhwZWN0VHVwbGUoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBidXJuIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgYnVybiBpZiBscC10b2tlbiBub3QgdGhlIHNhbWUgYXMgcG9vbFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiRVRIXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJFVEgtMlwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5FVEhcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5FVEgtMlwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuLTJcIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibWludFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcIm1pbnRcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgyKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkVUSFwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkVUSC0yXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW4tMlwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiYnVyblwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlbi0yXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDApLFxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBidXJuIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgYnVybiBpZiB0b2tlbi0wIG5vdCB0aGUgc2FtZSBhcyBwb29sXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJEQUlcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibWludFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiYnVyblwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uRVRIXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKSxcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKClcbiAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gYnVybiBcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gbm90IGJ1cm4gaWYgdG9rZW4tMSBub3QgdGhlIHNhbWUgYXMgcG9vbFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcIm1pbnRcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImJ1cm5cIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkVUSFwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDApLFxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBidXJuIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgYnVybiBpZiBsaXF1aWRpdHkgaXMgMFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcIm1pbnRcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImJ1cm5cIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDApLFxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBidXJuIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgYnVybiBpZiBhbXQwIGlzIDBcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcIkRBSVwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiYnVyblwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIGJ1cm4gXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIG5vdCBidXJuIGlmIGFtdDEgaXMgMVwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcIm1pbnRcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJidXJuXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKClcbiAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gYnVybiBcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gbm90IGJ1cm4gaWYgbm90IGVub3VnaCBiYWxhbmNlIHRvIGJ1cm5cIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcIkRBSVwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImJ1cm5cIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMDEpLFxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBzd2FwIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBzd2FwXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJEQUlcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwic2V0LXJldi1zaGFyZVwiLCBbdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uZGlzdHJpYnV0b3JcIildLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcIm1pbnRcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMDApLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwic3dhcFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5kaXN0cmlidXRvclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDk5NSlcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBzd2FwIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbid0IHN3YXAgaWYgdG9rZW4taW4gaXMgbm90IHRva2VuLTAgb3IgdG9rZW4tMVwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInNldC1yZXYtc2hhcmVcIiwgW3R5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInN3YXBcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkVUSFwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uZGlzdHJpYnV0b3JcIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDApLFxuICAgICAgICAgICAgdHlwZXMudWludCg5OTUpXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIHN3YXAgXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuJ3Qgc3dhcCBpZiB0b2tlbi1vdXQgaXMgbm90IHRva2VuLTAgb3IgdG9rZW4tMVwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInNldC1yZXYtc2hhcmVcIiwgW3R5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInN3YXBcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkVUSFwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoOTk1KVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBzd2FwIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbid0IHN3YXAgaWYgdG9rZW4taW4gaXMgZXF1YWwgdG8gdG9rZW4tb3V0XCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJEQUlcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwic2V0LXJldi1zaGFyZVwiLCBbdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uZGlzdHJpYnV0b3JcIildLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcIm1pbnRcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMDApLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwic3dhcFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoOTk1KVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBzd2FwIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbid0IHN3YXAgaWYgcmV2LXNoYXJlIHdyb25nXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJEQUlcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibWludFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMDApXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJzd2FwXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoOTk1KVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBzd2FwIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbid0IHN3YXAgaWYgdG9rZW4taW4gaXMgMFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInNldC1yZXYtc2hhcmVcIiwgW3R5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInN3YXBcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uZGlzdHJpYnV0b3JcIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDApLFxuICAgICAgICAgICAgdHlwZXMudWludCg5OTUpXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIHN3YXAgXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuJ3Qgc3dhcCBpZiB0b2tlbi1pbiBpcyAwXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJEQUlcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwic2V0LXJldi1zaGFyZVwiLCBbdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uZGlzdHJpYnV0b3JcIildLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcIm1pbnRcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMDApLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwic3dhcFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5kaXN0cmlidXRvclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDApXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIHN3YXAgXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuJ3Qgc3dhcCBpZiB0b2tlbi1vdXQgaXMgMFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInNldC1yZXYtc2hhcmVcIiwgW3R5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInN3YXBcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uZGlzdHJpYnV0b3JcIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBzd2FwIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbid0IHN3YXAgaWYgbm90IGVub3VnaHQgYW1vdW50IHRvIHRyYW5zZmVyIHRva2VuLWluXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJEQUlcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInNldC1yZXYtc2hhcmVcIiwgW3R5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInN3YXBcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uZGlzdHJpYnV0b3JcIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDApLFxuICAgICAgICAgICAgdHlwZXMudWludCg5OTUpXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIHN3YXAgXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuJ3Qgc3dhcCBpZiB0b2tlbi1pbiBpcyAwXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJEQUlcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwic2V0LXJldi1zaGFyZVwiLCBbdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uZGlzdHJpYnV0b3JcIildLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNyZWF0ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgICAgdHlwZXMudHVwbGUoeyBudW06IHR5cGVzLnVpbnQoOTk2KSwgZGVuOiB0eXBlcy51aW50KDEwMDApIH0pLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcIm1pbnRcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMDApLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwic3dhcFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5kaXN0cmlidXRvclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDk5NilcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKClcbiAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gc3dhcCBcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSB1cGRhdGUgcmV2ZW51ZVwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInNldC1yZXYtc2hhcmVcIiwgW3R5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJzd2FwXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoOTk1KVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInN3YXBcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uZGlzdHJpYnV0b3JcIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDApLFxuICAgICAgICAgICAgdHlwZXMudWludCg5OTUpXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJkby1nZXQtcmV2ZW51ZVwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdFR1cGxlKClcbiAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gc3dhcCBcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gY29sbGVjdFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInNldC1yZXYtc2hhcmVcIiwgW3R5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJzd2FwXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoOTk1KVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInN3YXBcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uZGlzdHJpYnV0b3JcIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDApLFxuICAgICAgICAgICAgdHlwZXMudWludCg5OTUpXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjb2xsZWN0XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBzd2FwIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgY29sbGVjdCBpZiB0b2tlbnMgbWl4ZWRcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcIkRBSVwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJzZXQtcmV2LXNoYXJlXCIsIFt0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5kaXN0cmlidXRvclwiKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibWludFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMDApXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwic3dhcFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5kaXN0cmlidXRvclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDk5NSlcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJzd2FwXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoOTk1KVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY29sbGVjdFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIHN3YXAgXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIG5vdCBjb2xsZWN0IGlmIG5vdCBmZWUtdG8gYWRkcmVzc1wiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInNldC1yZXYtc2hhcmVcIiwgW3R5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJzd2FwXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoOTk1KVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInN3YXBcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uZGlzdHJpYnV0b3JcIiksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDApLFxuICAgICAgICAgICAgdHlwZXMudWludCg5OTUpXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjb2xsZWN0XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKClcbiAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gc3dhcCBcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gbm90IGNvbGxlY3QgaWYgbm8gcmV2ZW51ZVwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInNldC1yZXYtc2hhcmVcIiwgW3R5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNvbGxlY3RcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBzd2FwIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgY29sbGVjdCBpZiBubyByZXZlbnVlIG9uIHRva2VuMCBcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcIkRBSVwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJzZXQtcmV2LXNoYXJlXCIsIFt0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5kaXN0cmlidXRvclwiKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibWludFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMDApXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwic3dhcFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5kaXN0cmlidXRvclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDk5NSlcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcImNvbGxlY3RcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgIF0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBzd2FwIFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgY29sbGVjdCBpZiBubyByZXZlbnVlIG9uIHRva2VuMVwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiREFJXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwiY29yZVwiLCBcInNldC1yZXYtc2hhcmVcIiwgW3R5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJjcmVhdGVcIiwgXG4gICAgICAgICAgW1xuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICAgIHR5cGVzLnR1cGxlKHsgbnVtOiB0eXBlcy51aW50KDk5NiksIGRlbjogdHlwZXMudWludCgxMDAwKSB9KSxcbiAgICAgICAgICBdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJtaW50XCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmxwLXRva2VuXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwMDAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwMDAwMDAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJzd2FwXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoOTk1MDAwMDAwKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY29sbGVjdFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIHN3YXAgXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJUZXN0aW5nIHN3YXBcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcIkRBSVwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJzZXQtcmV2LXNoYXJlXCIsIFt0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5kaXN0cmlidXRvclwiKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwiY3JlYXRlXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLkRBSVwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLnZlbGFyXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00ubHAtdG9rZW5cIiksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgICB0eXBlcy50dXBsZSh7IG51bTogdHlwZXMudWludCg5OTYpLCBkZW46IHR5cGVzLnVpbnQoMTAwMCkgfSksXG4gICAgICAgICAgXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJjb3JlXCIsIFwibWludFwiLCBcbiAgICAgICAgICBbXG4gICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00uREFJXCIpLFxuICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKFwiU1QxUFFIUUtWMFJKWFpGWTFER1g4TU5TTllWRTNWR1pKU1JUUEdaR00udmVsYXJcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5scC10b2tlblwiKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwMDAwMDAwMDAwMCksXG4gICAgICAgICAgICB0eXBlcy51aW50KDEwMDAwMDAwMDAwMDApXG4gICAgICAgICAgXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcImNvcmVcIiwgXCJzd2FwXCIsIFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS5EQUlcIiksXG4gICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwoXCJTVDFQUUhRS1YwUkpYWkZZMURHWDhNTlNOWVZFM1ZHWkpTUlRQR1pHTS52ZWxhclwiKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChcIlNUMVBRSFFLVjBSSlhaRlkxREdYOE1OU05ZVkUzVkdaSlNSVFBHWkdNLmRpc3RyaWJ1dG9yXCIpLFxuICAgICAgICAgICAgdHlwZXMudWludCgxMDAwMDAwMDAwKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoOTk1MDA4OTcxKVxuICAgICAgICAgIF0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKTsgXG5cbiAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTsiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUyxRQUFRLEVBQUUsRUFBRSxFQUFrQixLQUFLLFFBQW9CLDhDQUE4QyxDQUFDO0FBRy9HLG9CQUFvQjtBQUNwQixRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1osSUFBSSxFQUFFLHVFQUF1RTtJQUM3RSxNQUFNLEVBQUUsRUFBQyxLQUFZLEVBQUUsUUFBOEIsRUFBRTtRQUNuRCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFDM0MsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBRTNDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUU1RSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0tBQ3JFO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsb0JBQW9CO0FBQ3BCLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUUsMkNBQTJDO0lBQ2pELE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUMzQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FB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