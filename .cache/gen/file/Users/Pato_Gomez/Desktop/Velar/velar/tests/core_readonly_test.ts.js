import { Clarinet, types } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { checkTupleResult, n, fee } from './util.ts';
import { deployer } from './contants.ts';
const calcMint = (chain, amt0, amt1, reserve0, reserve1, totalSupply)=>chain.callReadOnlyFn("core", "calc-mint", [
        types.uint(amt0),
        types.uint(amt1),
        types.uint(reserve0),
        types.uint(reserve1),
        types.uint(totalSupply), 
    ], deployer);
const calcBurn = (chain, liquidity, reserve0, reserve1, totalSupply)=>chain.callReadOnlyFn("core", "calc-burn", [
        types.uint(liquidity),
        types.uint(reserve0),
        types.uint(reserve1),
        types.uint(totalSupply), 
    ], deployer);
const calcSwap = (chain, amtIn, swapFee, protocolFee, revShare)=>chain.callReadOnlyFn("core", "calc-swap", [
        types.uint(amtIn),
        fee(swapFee[0], swapFee[1]),
        fee(protocolFee[0], protocolFee[1]),
        fee(revShare[0], revShare[1]), 
    ], deployer);
const check = (exp, rec)=>rec.result.expectUint(exp);
// --------
Clarinet.test({
    name: "calc-mint : inital mint ...",
    async fn (chain) {
        let tests = [
            [
                [
                    1,
                    1,
                    0,
                    0,
                    0
                ],
                1
            ],
            [
                [
                    n(15),
                    n(15),
                    0,
                    0,
                    0
                ],
                n(15)
            ],
            [
                [
                    n(18),
                    n(18),
                    0,
                    0,
                    0
                ],
                n(18)
            ], 
        ];
        let res = tests.map(([inputs])=>calcMint(chain, ...inputs));
        tests.map(([, exp], i)=>check(exp, res[i]));
    }
});
Clarinet.test({
    name: "calc-mint : non-initial mint ...",
    async fn (chain) {
        let tests = [
            [
                [
                    1,
                    1,
                    1,
                    1,
                    1
                ],
                1
            ],
            // ?
            [
                [
                    n(18),
                    n(18),
                    1_000,
                    1_000,
                    1_000
                ],
                n(18)
            ],
            [
                [
                    n(18),
                    n(18),
                    10_000,
                    10_000,
                    1_000
                ],
                n(17)
            ],
            // ?
            [
                [
                    n(18),
                    n(18),
                    n(37),
                    n(37),
                    1_000_000
                ],
                0
            ],
            [
                [
                    n(18),
                    n(18),
                    n(37),
                    n(37),
                    n(20)
                ],
                10
            ],
            // [[n(18), n(18), n(37), n(37), n(21)], overflow],
            [
                [
                    n(18),
                    n(18),
                    n(20),
                    n(20),
                    n(20)
                ],
                n(18)
            ], 
        ];
        let res = tests.map(([inputs])=>calcMint(chain, ...inputs));
        tests.map(([, exp], i)=>check(exp, res[i]));
    }
});
Clarinet.test({
    name: "calc-burn : ...",
    async fn (chain) {
        // contraints:
        // liquidity * reserve0 & liquidity * reserve1
        // totalSupply > 0
        let tests = [
            [
                [
                    1,
                    0,
                    0,
                    1
                ],
                {
                    amt0: 0,
                    amt1: 0
                }
            ],
            [
                [
                    10,
                    100,
                    100,
                    100
                ],
                {
                    amt0: 10,
                    amt1: 10
                }
            ],
            // NOTE: returns more than totalSupply
            [
                [
                    n(18),
                    n(15),
                    n(15),
                    n(15)
                ],
                {
                    amt0: n(18),
                    amt1: n(18)
                }
            ],
            [
                [
                    100,
                    1_000,
                    100_000,
                    1_000
                ],
                {
                    amt0: 100,
                    amt1: 10_000
                }
            ], 
        ];
        let res = tests.map(([inputs])=>calcBurn(chain, ...inputs));
        tests.map(([, exp], i)=>checkTupleResult(res[i], exp));
    }
});
Clarinet.test({
    name: "calc-swap : ...",
    async fn (chain) {
        const defaultFee = [
            997,
            1_000
        ];
        const defaultFee1 = [
            30,
            10_000
        ];
        const defaultFee2 = [
            50,
            100
        ];
        // amt-total = swap-fee of in
        // amt-protocol = protocol-fee of amt-total
        // amt-lps = amt-total - amt-protocol
        // amt-share = fee-share of amt-protocol 
        // amt-rest (revenue) = amt-protocol - amt-share
        let tests = [
            [
                [
                    1000,
                    defaultFee,
                    defaultFee1,
                    defaultFee2
                ],
                {
                    'amt-in-adjusted': 997,
                    'amt-fee-lps': 3,
                    'amt-fee-protocol': 0,
                    'amt-fee-share': 0,
                    'amt-fee-rest': 0
                }
            ],
            [
                [
                    1_000_000,
                    defaultFee,
                    defaultFee1,
                    defaultFee2
                ],
                {
                    'amt-in-adjusted': 997_000,
                    'amt-fee-lps': 2_991,
                    'amt-fee-protocol': 9,
                    'amt-fee-share': 4,
                    'amt-fee-rest': 5
                }
            ],
            [
                [
                    1_000_000_000,
                    defaultFee,
                    defaultFee1,
                    defaultFee2
                ],
                {
                    'amt-in-adjusted': 997_000_000,
                    'amt-fee-lps': 2_991_000,
                    'amt-fee-protocol': 9_000,
                    'amt-fee-share': 4_500,
                    'amt-fee-rest': 4_500
                }
            ],
            [
                [
                    100_000,
                    defaultFee,
                    [
                        30,
                        1_000
                    ],
                    [
                        0,
                        1
                    ]
                ],
                {
                    'amt-in-adjusted': 99_700,
                    'amt-fee-lps': 291,
                    'amt-fee-protocol': 9,
                    'amt-fee-share': 0,
                    'amt-fee-rest': 9
                }
            ],
            [
                [
                    10_000,
                    defaultFee,
                    [
                        1,
                        1
                    ],
                    [
                        1,
                        1
                    ]
                ],
                {
                    'amt-in-adjusted': 9970,
                    'amt-fee-lps': 0,
                    'amt-fee-protocol': 30,
                    'amt-fee-share': 30,
                    'amt-fee-rest': 0
                }
            ],
            [
                [
                    10_000,
                    defaultFee,
                    [
                        0,
                        1
                    ],
                    [
                        0,
                        1
                    ]
                ],
                {
                    'amt-in-adjusted': 9970,
                    'amt-fee-lps': 30,
                    'amt-fee-protocol': 0,
                    'amt-fee-share': 0,
                    'amt-fee-rest': 0
                }
            ], 
        ];
        let res = tests.map(([inputs])=>calcSwap(chain, ...inputs));
        tests.map(([, exp], i)=>checkTupleResult(res[i], exp, i));
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvUGF0b19Hb21lei9EZXNrdG9wL1ZlbGFyL3ZlbGFyL3Rlc3RzL2NvcmVfcmVhZG9ubHlfdGVzdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcblxuaW1wb3J0IHsgQ2xhcmluZXQsIFR4LCBDaGFpbiwgQWNjb3VudCwgdHlwZXMsIEVtcHR5QmxvY2ssIFR4UmVjZWlwdCB9IGZyb20gJ2h0dHBzOi8vZGVuby5sYW5kL3gvY2xhcmluZXRAdjEuNi4wL2luZGV4LnRzJztcbmltcG9ydCB7IGFzc2VydEVxdWFscyB9IGZyb20gJ2h0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjkwLjAvdGVzdGluZy9hc3NlcnRzLnRzJztcbmltcG9ydCB7IGNoZWNrVHVwbGVSZXN1bHQsIG4sIGZlZSB9IGZyb20gJy4vdXRpbC50cyc7XG5pbXBvcnQgeyBkZXBsb3llciB9IGZyb20gJy4vY29udGFudHMudHMnO1xuXG50eXBlIEJpZyA9IG51bWJlcnxzdHJpbmdcblxuY29uc3QgY2FsY01pbnQgPSAoY2hhaW4sIGFtdDA6IEJpZywgYW10MTogQmlnLCByZXNlcnZlMDogQmlnLCByZXNlcnZlMTogQmlnLCB0b3RhbFN1cHBseTogQmlnKSA9PlxuICAgIGNoYWluLmNhbGxSZWFkT25seUZuKFwiY29yZVwiLCBcImNhbGMtbWludFwiLCBbXG4gICAgICAgIHR5cGVzLnVpbnQoYW10MCksXG4gICAgICAgIHR5cGVzLnVpbnQoYW10MSksXG4gICAgICAgIHR5cGVzLnVpbnQocmVzZXJ2ZTApLFxuICAgICAgICB0eXBlcy51aW50KHJlc2VydmUxKSxcbiAgICAgICAgdHlwZXMudWludCh0b3RhbFN1cHBseSksXG4gICAgXSwgZGVwbG95ZXIpXG5cbmNvbnN0IGNhbGNCdXJuID0gKGNoYWluLCBsaXF1aWRpdHk6IEJpZywgcmVzZXJ2ZTA6IEJpZywgcmVzZXJ2ZTE6IEJpZywgdG90YWxTdXBwbHk6IEJpZykgPT5cbiAgICBjaGFpbi5jYWxsUmVhZE9ubHlGbihcImNvcmVcIiwgXCJjYWxjLWJ1cm5cIiwgW1xuICAgICAgICB0eXBlcy51aW50KGxpcXVpZGl0eSksXG4gICAgICAgIHR5cGVzLnVpbnQocmVzZXJ2ZTApLFxuICAgICAgICB0eXBlcy51aW50KHJlc2VydmUxKSxcbiAgICAgICAgdHlwZXMudWludCh0b3RhbFN1cHBseSksXG4gICAgXSwgZGVwbG95ZXIpXG4gICAgXG4gIGNvbnN0IGNhbGNTd2FwID0gKGNoYWluLCBhbXRJbjogQmlnLCBzd2FwRmVlOiBudW1iZXJbXSwgcHJvdG9jb2xGZWU6IG51bWJlcltdLCByZXZTaGFyZTogbnVtYmVyW10pID0+XG4gICAgY2hhaW4uY2FsbFJlYWRPbmx5Rm4oXCJjb3JlXCIsIFwiY2FsYy1zd2FwXCIsIFtcbiAgICAgICAgdHlwZXMudWludChhbXRJbiksXG4gICAgICAgIGZlZShzd2FwRmVlWzBdLCBzd2FwRmVlWzFdKSxcbiAgICAgICAgZmVlKHByb3RvY29sRmVlWzBdLCBwcm90b2NvbEZlZVsxXSksXG4gICAgICAgIGZlZShyZXZTaGFyZVswXSwgcmV2U2hhcmVbMV0pLFxuICAgIF0sIGRlcGxveWVyKVxuXG5jb25zdCBjaGVjayA9IChleHA6IEJpZywgcmVjOiBUeFJlY2VpcHQpID0+IHJlYy5yZXN1bHQuZXhwZWN0VWludChleHApXG5cbi8vIC0tLS0tLS0tXG5cbkNsYXJpbmV0LnRlc3Qoe1xuICAgIG5hbWU6IFwiY2FsYy1taW50IDogaW5pdGFsIG1pbnQgLi4uXCIsXG4gICAgYXN5bmMgZm4oY2hhaW46IENoYWluKSB7XG5cbiAgICAgICAgbGV0IHRlc3RzID0gW1xuICAgICAgICAgICAgW1sxLCAxLCAwLCAwLCAwXSwgMV0sXG4gICAgICAgICAgICBbW24oMTUpLCBuKDE1KSwgMCwgMCwgMF0sIG4oMTUpXSxcbiAgICAgICAgICAgIFtbbigxOCksIG4oMTgpLCAwLCAwLCAwXSwgbigxOCldLCAvLyBtYXhcbiAgICAgICAgICAgIC8vIFtbbigyMSksIG4oMjEpLCAwLCAwLCAwXSwgb3dlcmZsb3ddLFxuICAgICAgICBdXG5cbiAgICAgICAgbGV0IHJlcyA9IHRlc3RzLm1hcCgoW2lucHV0c10pID0+IGNhbGNNaW50KGNoYWluLCAuLi5pbnB1dHMpKVxuICAgICAgICB0ZXN0cy5tYXAoKFssIGV4cF0sIGkpID0+IGNoZWNrKGV4cCwgcmVzW2ldKSlcbiAgICB9LFxufSk7XG5cbkNsYXJpbmV0LnRlc3Qoe1xuICAgIG5hbWU6IFwiY2FsYy1taW50IDogbm9uLWluaXRpYWwgbWludCAuLi5cIixcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4pIHtcblxuICAgICAgICBsZXQgdGVzdHMgPSBbXG4gICAgICAgICAgICBbWzEsIDEsIDEsIDEsIDFdLCAxXSxcbiAgICAgICAgICAgIC8vID9cbiAgICAgICAgICAgIFtbbigxOCksIG4oMTgpLCAxXzAwMCwgMV8wMDAsIDFfMDAwXSwgbigxOCldLFxuICAgICAgICAgICAgW1tuKDE4KSwgbigxOCksIDEwXzAwMCwgMTBfMDAwLCAxXzAwMF0sIG4oMTcpXSxcbiAgICAgICAgICAgIC8vID9cbiAgICAgICAgICAgIFtbbigxOCksIG4oMTgpLCBuKDM3KSwgbigzNyksIDFfMDAwXzAwMF0sIDBdLFxuICAgICAgICAgICAgW1tuKDE4KSwgbigxOCksIG4oMzcpLCBuKDM3KSwgbigyMCldLCAxMF0sXG4gICAgICAgICAgICAvLyBbW24oMTgpLCBuKDE4KSwgbigzNyksIG4oMzcpLCBuKDIxKV0sIG92ZXJmbG93XSxcbiAgICAgICAgICAgIFtbbigxOCksIG4oMTgpLCBuKDIwKSwgbigyMCksIG4oMjApXSwgbigxOCldLFxuICAgICAgICBdXG5cbiAgICAgICAgbGV0IHJlcyA9IHRlc3RzLm1hcCgoW2lucHV0c10pID0+IGNhbGNNaW50KGNoYWluLCAuLi5pbnB1dHMpKVxuICAgICAgICB0ZXN0cy5tYXAoKFssIGV4cF0sIGkpID0+IGNoZWNrKGV4cCwgcmVzW2ldKSlcbiAgICB9LFxufSlcblxuQ2xhcmluZXQudGVzdCh7XG4gICAgbmFtZTogXCJjYWxjLWJ1cm4gOiAuLi5cIixcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4pIHtcblxuICAgICAgICAvLyBjb250cmFpbnRzOlxuICAgICAgICAvLyBsaXF1aWRpdHkgKiByZXNlcnZlMCAmIGxpcXVpZGl0eSAqIHJlc2VydmUxXG4gICAgICAgIC8vIHRvdGFsU3VwcGx5ID4gMFxuICAgICAgICBsZXQgdGVzdHMgPSBbXG4gICAgICAgICAgICBbWzEsIDAsIDAsIDFdLCB7IGFtdDA6IDAsIGFtdDE6IDAgfV0sXG4gICAgICAgICAgICBbWzEwLCAxMDAsIDEwMCwgMTAwXSwgeyBhbXQwOiAxMCwgYW10MTogMTAgfV0sXG4gICAgICAgICAgICAvLyBOT1RFOiByZXR1cm5zIG1vcmUgdGhhbiB0b3RhbFN1cHBseVxuICAgICAgICAgICAgW1tuKDE4KSwgbigxNSksIG4oMTUpLCBuKDE1KV0sIHsgYW10MDogbigxOCksIGFtdDE6IG4oMTgpIH1dLFxuICAgICAgICAgICAgW1sxMDAsIDFfMDAwLCAxMDBfMDAwLCAxXzAwMF0sIHsgYW10MDogMTAwLCBhbXQxOiAxMF8wMDAgfV0sXG4gICAgICAgICAgICAvLyBbW24oMTgpLCBuKDIxKSwgbigxOSksIDFfMDAwXSwgb3ZlcmZsb3ddLFxuICAgICAgICAgIF1cblxuICAgICAgICAgIGxldCByZXMgPSB0ZXN0cy5tYXAoKFtpbnB1dHNdKSA9PiBjYWxjQnVybihjaGFpbiwgLi4uaW5wdXRzKSlcbiAgICAgICAgICB0ZXN0cy5tYXAoKFssIGV4cF0sIGkpID0+IGNoZWNrVHVwbGVSZXN1bHQocmVzW2ldLCBleHApKVxuICAgICAgfVxufSlcblxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiY2FsYy1zd2FwIDogLi4uXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbikge1xuXG4gICAgICBjb25zdCBkZWZhdWx0RmVlID0gWzk5NywgMV8wMDBdXG4gICAgICBjb25zdCBkZWZhdWx0RmVlMSA9IFszMCwgMTBfMDAwXVxuICAgICAgY29uc3QgZGVmYXVsdEZlZTIgPSBbNTAsIDEwMF1cblxuICAgICAgLy8gYW10LXRvdGFsID0gc3dhcC1mZWUgb2YgaW5cbiAgICAgIC8vIGFtdC1wcm90b2NvbCA9IHByb3RvY29sLWZlZSBvZiBhbXQtdG90YWxcbiAgICAgIC8vIGFtdC1scHMgPSBhbXQtdG90YWwgLSBhbXQtcHJvdG9jb2xcbiAgICAgIC8vIGFtdC1zaGFyZSA9IGZlZS1zaGFyZSBvZiBhbXQtcHJvdG9jb2wgXG4gICAgICAvLyBhbXQtcmVzdCAocmV2ZW51ZSkgPSBhbXQtcHJvdG9jb2wgLSBhbXQtc2hhcmVcbiAgICAgIGxldCB0ZXN0cyA9IFtcbiAgICAgICAgICBbWzEwMDAsIGRlZmF1bHRGZWUsIGRlZmF1bHRGZWUxLCBkZWZhdWx0RmVlMl0sIHtcbiAgICAgICAgICAgICdhbXQtaW4tYWRqdXN0ZWQnIDogOTk3LFxuICAgICAgICAgICAgJ2FtdC1mZWUtbHBzJyAgICAgOiAzLFxuICAgICAgICAgICAgJ2FtdC1mZWUtcHJvdG9jb2wnOiAwLFxuICAgICAgICAgICAgJ2FtdC1mZWUtc2hhcmUnICAgOiAwLFxuICAgICAgICAgICAgJ2FtdC1mZWUtcmVzdCcgICAgOiAwLCAgICAgIFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIFtbMV8wMDBfMDAwLCBkZWZhdWx0RmVlLCBkZWZhdWx0RmVlMSwgZGVmYXVsdEZlZTJdLCB7XG4gICAgICAgICAgICAnYW10LWluLWFkanVzdGVkJyA6IDk5N18wMDAsXG4gICAgICAgICAgICAnYW10LWZlZS1scHMnICAgICA6IDJfOTkxLFxuICAgICAgICAgICAgJ2FtdC1mZWUtcHJvdG9jb2wnOiA5LFxuICAgICAgICAgICAgJ2FtdC1mZWUtc2hhcmUnICAgOiA0LFxuICAgICAgICAgICAgJ2FtdC1mZWUtcmVzdCcgICAgOiA1LFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIFtbMV8wMDBfMDAwXzAwMCwgZGVmYXVsdEZlZSwgZGVmYXVsdEZlZTEsIGRlZmF1bHRGZWUyXSwge1xuICAgICAgICAgICAgJ2FtdC1pbi1hZGp1c3RlZCcgOiA5OTdfMDAwXzAwMCxcbiAgICAgICAgICAgICdhbXQtZmVlLWxwcycgICAgIDogMl85OTFfMDAwLFxuICAgICAgICAgICAgJ2FtdC1mZWUtcHJvdG9jb2wnOiA5XzAwMCxcbiAgICAgICAgICAgICdhbXQtZmVlLXNoYXJlJyAgIDogNF81MDAsXG4gICAgICAgICAgICAnYW10LWZlZS1yZXN0JyAgICA6IDRfNTAwLFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIFtbMTAwXzAwMCwgZGVmYXVsdEZlZSwgWzMwLCAxXzAwMF0sIFswLDFdXSwge1xuICAgICAgICAgICAgJ2FtdC1pbi1hZGp1c3RlZCcgOiA5OV83MDAsXG4gICAgICAgICAgICAnYW10LWZlZS1scHMnICAgICA6IDI5MSxcbiAgICAgICAgICAgICdhbXQtZmVlLXByb3RvY29sJzogOSxcbiAgICAgICAgICAgICdhbXQtZmVlLXNoYXJlJyAgIDogMCxcbiAgICAgICAgICAgICdhbXQtZmVlLXJlc3QnICAgIDogOSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBbWzEwXzAwMCwgZGVmYXVsdEZlZSwgWzEsMV0sIFsxLDFdXSwge1xuICAgICAgICAgICAgJ2FtdC1pbi1hZGp1c3RlZCcgOiA5OTcwLFxuICAgICAgICAgICAgJ2FtdC1mZWUtbHBzJyAgICAgOiAwLFxuICAgICAgICAgICAgJ2FtdC1mZWUtcHJvdG9jb2wnOiAzMCxcbiAgICAgICAgICAgICdhbXQtZmVlLXNoYXJlJyAgIDogMzAsXG4gICAgICAgICAgICAnYW10LWZlZS1yZXN0JyAgICA6IDAsXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgW1sxMF8wMDAsIGRlZmF1bHRGZWUsIFswLDFdLCBbMCwxXV0sIHtcbiAgICAgICAgICAgICdhbXQtaW4tYWRqdXN0ZWQnIDogOTk3MCxcbiAgICAgICAgICAgICdhbXQtZmVlLWxwcycgICAgIDogMzAsXG4gICAgICAgICAgICAnYW10LWZlZS1wcm90b2NvbCc6IDAsXG4gICAgICAgICAgICAnYW10LWZlZS1zaGFyZScgICA6IDAsXG4gICAgICAgICAgICAnYW10LWZlZS1yZXN0JyAgICA6IDAsXG4gICAgICAgICAgfV0sXG4gICAgICAgIF1cblxuICAgICAgICBsZXQgcmVzID0gdGVzdHMubWFwKChbaW5wdXRzXSkgPT4gY2FsY1N3YXAoY2hhaW4sIC4uLmlucHV0cykpXG4gICAgICAgIHRlc3RzLm1hcCgoWywgZXhwXSwgaSkgPT4gY2hlY2tUdXBsZVJlc3VsdChyZXNbaV0sIGV4cCwgaSkpXG4gICAgfVxufSlcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxTQUFTLFFBQVEsRUFBc0IsS0FBSyxRQUErQiw4Q0FBOEMsQ0FBQztBQUUxSCxTQUFTLGdCQUFnQixFQUFFLENBQUMsRUFBRSxHQUFHLFFBQVEsV0FBVyxDQUFDO0FBQ3JELFNBQVMsUUFBUSxRQUFRLGVBQWUsQ0FBQztBQUl6QyxNQUFNLFFBQVEsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFTLEVBQUUsSUFBUyxFQUFFLFFBQWEsRUFBRSxRQUFhLEVBQUUsV0FBZ0IsR0FDekYsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFO1FBQ3RDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2hCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2hCLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3BCLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3BCLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0tBQzFCLEVBQUUsUUFBUSxDQUFDO0FBRWhCLE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBSyxFQUFFLFNBQWMsRUFBRSxRQUFhLEVBQUUsUUFBYSxFQUFFLFdBQWdCLEdBQ25GLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRTtRQUN0QyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNwQixLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNwQixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztLQUMxQixFQUFFLFFBQVEsQ0FBQztBQUVkLE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQVUsRUFBRSxPQUFpQixFQUFFLFdBQXFCLEVBQUUsUUFBa0IsR0FDL0YsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFO1FBQ3RDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hDLEVBQUUsUUFBUSxDQUFDO0FBRWhCLE1BQU0sS0FBSyxHQUFHLENBQUMsR0FBUSxFQUFFLEdBQWMsR0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7QUFFdEUsV0FBVztBQUVYLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDVixJQUFJLEVBQUUsNkJBQTZCO0lBQ25DLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRTtRQUVuQixJQUFJLEtBQUssR0FBRztZQUNSO2dCQUFDO0FBQUMscUJBQUM7QUFBRSxxQkFBQztBQUFFLHFCQUFDO0FBQUUscUJBQUM7QUFBRSxxQkFBQztpQkFBQztBQUFFLGlCQUFDO2FBQUM7WUFDcEI7Z0JBQUM7b0JBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQUUscUJBQUM7QUFBRSxxQkFBQztBQUFFLHFCQUFDO2lCQUFDO2dCQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFBQztZQUNoQztnQkFBQztvQkFBQyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFBRSxxQkFBQztBQUFFLHFCQUFDO0FBQUUscUJBQUM7aUJBQUM7Z0JBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUFDO1NBRW5DO1FBRUQsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUssUUFBUSxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsQ0FBQztRQUM3RCxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUssS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoRDtDQUNKLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDVixJQUFJLEVBQUUsa0NBQWtDO0lBQ3hDLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRTtRQUVuQixJQUFJLEtBQUssR0FBRztZQUNSO2dCQUFDO0FBQUMscUJBQUM7QUFBRSxxQkFBQztBQUFFLHFCQUFDO0FBQUUscUJBQUM7QUFBRSxxQkFBQztpQkFBQztBQUFFLGlCQUFDO2FBQUM7WUFDcEIsSUFBSTtZQUNKO2dCQUFDO29CQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUFFLHlCQUFLO0FBQUUseUJBQUs7QUFBRSx5QkFBSztpQkFBQztnQkFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO2FBQUM7WUFDNUM7Z0JBQUM7b0JBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQUUsMEJBQU07QUFBRSwwQkFBTTtBQUFFLHlCQUFLO2lCQUFDO2dCQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFBQztZQUM5QyxJQUFJO1lBQ0o7Z0JBQUM7b0JBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUFFLDZCQUFTO2lCQUFDO0FBQUUsaUJBQUM7YUFBQztZQUM1QztnQkFBQztvQkFBQyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQUM7QUFBRSxrQkFBRTthQUFDO1lBQ3pDLG1EQUFtRDtZQUNuRDtnQkFBQztvQkFBQyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQUM7Z0JBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUFDO1NBQy9DO1FBRUQsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUssUUFBUSxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsQ0FBQztRQUM3RCxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUssS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoRDtDQUNKLENBQUM7QUFFRixRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1YsSUFBSSxFQUFFLGlCQUFpQjtJQUN2QixNQUFNLEVBQUUsRUFBQyxLQUFZLEVBQUU7UUFFbkIsY0FBYztRQUNkLDhDQUE4QztRQUM5QyxrQkFBa0I7UUFDbEIsSUFBSSxLQUFLLEdBQUc7WUFDUjtnQkFBQztBQUFDLHFCQUFDO0FBQUUscUJBQUM7QUFBRSxxQkFBQztBQUFFLHFCQUFDO2lCQUFDO2dCQUFFO29CQUFFLElBQUksRUFBRSxDQUFDO29CQUFFLElBQUksRUFBRSxDQUFDO2lCQUFFO2FBQUM7WUFDcEM7Z0JBQUM7QUFBQyxzQkFBRTtBQUFFLHVCQUFHO0FBQUUsdUJBQUc7QUFBRSx1QkFBRztpQkFBQztnQkFBRTtvQkFBRSxJQUFJLEVBQUUsRUFBRTtvQkFBRSxJQUFJLEVBQUUsRUFBRTtpQkFBRTthQUFDO1lBQzdDLHNDQUFzQztZQUN0QztnQkFBQztvQkFBQyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO2lCQUFDO2dCQUFFO29CQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO2lCQUFFO2FBQUM7WUFDNUQ7Z0JBQUM7QUFBQyx1QkFBRztBQUFFLHlCQUFLO0FBQUUsMkJBQU87QUFBRSx5QkFBSztpQkFBQztnQkFBRTtvQkFBRSxJQUFJLEVBQUUsR0FBRztvQkFBRSxJQUFJLEVBQUUsTUFBTTtpQkFBRTthQUFDO1NBRTVEO1FBRUQsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUssUUFBUSxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsQ0FBQztRQUM3RCxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUssZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQzNEO0NBQ04sQ0FBQztBQUVGLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUUsaUJBQWlCO0lBQ3ZCLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRTtRQUVuQixNQUFNLFVBQVUsR0FBRztBQUFDLGVBQUc7QUFBRSxpQkFBSztTQUFDO1FBQy9CLE1BQU0sV0FBVyxHQUFHO0FBQUMsY0FBRTtBQUFFLGtCQUFNO1NBQUM7UUFDaEMsTUFBTSxXQUFXLEdBQUc7QUFBQyxjQUFFO0FBQUUsZUFBRztTQUFDO1FBRTdCLDZCQUE2QjtRQUM3QiwyQ0FBMkM7UUFDM0MscUNBQXFDO1FBQ3JDLHlDQUF5QztRQUN6QyxnREFBZ0Q7UUFDaEQsSUFBSSxLQUFLLEdBQUc7WUFDUjtnQkFBQztBQUFDLHdCQUFJO29CQUFFLFVBQVU7b0JBQUUsV0FBVztvQkFBRSxXQUFXO2lCQUFDO2dCQUFFO29CQUM3QyxpQkFBaUIsRUFBRyxHQUFHO29CQUN2QixhQUFhLEVBQU8sQ0FBQztvQkFDckIsa0JBQWtCLEVBQUUsQ0FBQztvQkFDckIsZUFBZSxFQUFLLENBQUM7b0JBQ3JCLGNBQWMsRUFBTSxDQUFDO2lCQUN0QjthQUFDO1lBQ0Y7Z0JBQUM7QUFBQyw2QkFBUztvQkFBRSxVQUFVO29CQUFFLFdBQVc7b0JBQUUsV0FBVztpQkFBQztnQkFBRTtvQkFDbEQsaUJBQWlCLEVBQUcsT0FBTztvQkFDM0IsYUFBYSxFQUFPLEtBQUs7b0JBQ3pCLGtCQUFrQixFQUFFLENBQUM7b0JBQ3JCLGVBQWUsRUFBSyxDQUFDO29CQUNyQixjQUFjLEVBQU0sQ0FBQztpQkFDdEI7YUFBQztZQUNGO2dCQUFDO0FBQUMsaUNBQWE7b0JBQUUsVUFBVTtvQkFBRSxXQUFXO29CQUFFLFdBQVc7aUJBQUM7Z0JBQUU7b0JBQ3RELGlCQUFpQixFQUFHLFdBQVc7b0JBQy9CLGFBQWEsRUFBTyxTQUFTO29CQUM3QixrQkFBa0IsRUFBRSxLQUFLO29CQUN6QixlQUFlLEVBQUssS0FBSztvQkFDekIsY0FBYyxFQUFNLEtBQUs7aUJBQzFCO2FBQUM7WUFDRjtnQkFBQztBQUFDLDJCQUFPO29CQUFFLFVBQVU7b0JBQUU7QUFBQywwQkFBRTtBQUFFLDZCQUFLO3FCQUFDO29CQUFFO0FBQUMseUJBQUM7QUFBQyx5QkFBQztxQkFBQztpQkFBQztnQkFBRTtvQkFDMUMsaUJBQWlCLEVBQUcsTUFBTTtvQkFDMUIsYUFBYSxFQUFPLEdBQUc7b0JBQ3ZCLGtCQUFrQixFQUFFLENBQUM7b0JBQ3JCLGVBQWUsRUFBSyxDQUFDO29CQUNyQixjQUFjLEVBQU0sQ0FBQztpQkFDdEI7YUFBQztZQUNGO2dCQUFDO0FBQUMsMEJBQU07b0JBQUUsVUFBVTtvQkFBRTtBQUFDLHlCQUFDO0FBQUMseUJBQUM7cUJBQUM7b0JBQUU7QUFBQyx5QkFBQztBQUFDLHlCQUFDO3FCQUFDO2lCQUFDO2dCQUFFO29CQUNuQyxpQkFBaUIsRUFBRyxJQUFJO29CQUN4QixhQUFhLEVBQU8sQ0FBQztvQkFDckIsa0JBQWtCLEVBQUUsRUFBRTtvQkFDdEIsZUFBZSxFQUFLLEVBQUU7b0JBQ3RCLGNBQWMsRUFBTSxDQUFDO2lCQUN0QjthQUFDO1lBQ0Y7Z0JBQUM7QUFBQywwQkFBTTtvQkFBRSxVQUFVO29CQUFFO0FBQUMseUJBQUM7QUFBQyx5QkFBQztxQkFBQztvQkFBRTtBQUFDLHlCQUFDO0FBQUMseUJBQUM7cUJBQUM7aUJBQUM7Z0JBQUU7b0JBQ25DLGlCQUFpQixFQUFHLElBQUk7b0JBQ3hCLGFBQWEsRUFBTyxFQUFFO29CQUN0QixrQkFBa0IsRUFBRSxDQUFDO29CQUNyQixlQUFlLEVBQUssQ0FBQztvQkFDckIsY0FBYyxFQUFNLENBQUM7aUJBQ3RCO2FBQUM7U0FDSDtRQUVELElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFLLFFBQVEsQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDLENBQUM7UUFDN0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFLLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDOUQ7Q0FDSixDQUFDIn0=