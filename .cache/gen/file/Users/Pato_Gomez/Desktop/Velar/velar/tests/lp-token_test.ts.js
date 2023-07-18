import { Clarinet } from 'https://deno.land/x/clarinet@v0.31.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
Clarinet.test({
    name: "Ensure that <...>",
    async fn (chain, accounts) {
        let block = chain.mineBlock([]);
        assertEquals(block.receipts.length, 0);
        assertEquals(block.height, 2);
        block = chain.mineBlock([]);
        assertEquals(block.receipts.length, 0);
        assertEquals(block.height, 3);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvUGF0b19Hb21lei9EZXNrdG9wL1ZlbGFyL3ZlbGFyL3Rlc3RzL2xwLXRva2VuX3Rlc3QudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBDbGFyaW5ldCwgVHgsIENoYWluLCBBY2NvdW50LCB0eXBlcyB9IGZyb20gJ2h0dHBzOi8vZGVuby5sYW5kL3gvY2xhcmluZXRAdjAuMzEuMC9pbmRleC50cyc7XG5pbXBvcnQgeyBhc3NlcnRFcXVhbHMgfSBmcm9tICdodHRwczovL2Rlbm8ubGFuZC9zdGRAMC45MC4wL3Rlc3RpbmcvYXNzZXJ0cy50cyc7XG5cbkNsYXJpbmV0LnRlc3Qoe1xuICAgIG5hbWU6IFwiRW5zdXJlIHRoYXQgPC4uLj5cIixcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgICBsZXQgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgLyogXG4gICAgICAgICAgICAgKiBBZGQgdHJhbnNhY3Rpb25zIHdpdGg6IFxuICAgICAgICAgICAgICogVHguY29udHJhY3RDYWxsKC4uLilcbiAgICAgICAgICAgICovXG4gICAgICAgIF0pO1xuICAgICAgICBhc3NlcnRFcXVhbHMoYmxvY2sucmVjZWlwdHMubGVuZ3RoLCAwKTtcbiAgICAgICAgYXNzZXJ0RXF1YWxzKGJsb2NrLmhlaWdodCwgMik7XG5cbiAgICAgICAgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgLyogXG4gICAgICAgICAgICAgKiBBZGQgdHJhbnNhY3Rpb25zIHdpdGg6IFxuICAgICAgICAgICAgICogVHguY29udHJhY3RDYWxsKC4uLilcbiAgICAgICAgICAgICovXG4gICAgICAgIF0pO1xuICAgICAgICBhc3NlcnRFcXVhbHMoYmxvY2sucmVjZWlwdHMubGVuZ3RoLCAwKTtcbiAgICAgICAgYXNzZXJ0RXF1YWxzKGJsb2NrLmhlaWdodCwgMyk7XG4gICAgfSxcbn0pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLFNBQVMsUUFBUSxRQUFtQywrQ0FBK0MsQ0FBQztBQUNwRyxTQUFTLFlBQVksUUFBUSxpREFBaUQsQ0FBQztBQUUvRSxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1YsSUFBSSxFQUFFLG1CQUFtQjtJQUN6QixNQUFNLEVBQUUsRUFBQyxLQUFZLEVBQUUsUUFBOEIsRUFBRTtRQUNuRCxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBSzNCLENBQUMsQUFBQztRQUNILFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2QyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUU5QixLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUt2QixDQUFDLENBQUM7UUFDSCxZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDakM7Q0FDSixDQUFDLENBQUMifQ==