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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvUGF0b19Hb21lei9EZXNrdG9wL1ZlbGFyL3ZlbGFyL3Rlc3RzL2Z0LXBsdXMtdHJhaXRfdGVzdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IENsYXJpbmV0LCBUeCwgQ2hhaW4sIEFjY291bnQsIHR5cGVzIH0gZnJvbSAnaHR0cHM6Ly9kZW5vLmxhbmQveC9jbGFyaW5ldEB2MC4zMS4wL2luZGV4LnRzJztcbmltcG9ydCB7IGFzc2VydEVxdWFscyB9IGZyb20gJ2h0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjkwLjAvdGVzdGluZy9hc3NlcnRzLnRzJztcblxuQ2xhcmluZXQudGVzdCh7XG4gICAgbmFtZTogXCJFbnN1cmUgdGhhdCA8Li4uPlwiLFxuICAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICAgIGxldCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICAvKiBcbiAgICAgICAgICAgICAqIEFkZCB0cmFuc2FjdGlvbnMgd2l0aDogXG4gICAgICAgICAgICAgKiBUeC5jb250cmFjdENhbGwoLi4uKVxuICAgICAgICAgICAgKi9cbiAgICAgICAgXSk7XG4gICAgICAgIGFzc2VydEVxdWFscyhibG9jay5yZWNlaXB0cy5sZW5ndGgsIDApO1xuICAgICAgICBhc3NlcnRFcXVhbHMoYmxvY2suaGVpZ2h0LCAyKTtcblxuICAgICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICAvKiBcbiAgICAgICAgICAgICAqIEFkZCB0cmFuc2FjdGlvbnMgd2l0aDogXG4gICAgICAgICAgICAgKiBUeC5jb250cmFjdENhbGwoLi4uKVxuICAgICAgICAgICAgKi9cbiAgICAgICAgXSk7XG4gICAgICAgIGFzc2VydEVxdWFscyhibG9jay5yZWNlaXB0cy5sZW5ndGgsIDApO1xuICAgICAgICBhc3NlcnRFcXVhbHMoYmxvY2suaGVpZ2h0LCAzKTtcbiAgICB9LFxufSk7XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsU0FBUyxRQUFRLFFBQW1DLCtDQUErQyxDQUFDO0FBQ3BHLFNBQVMsWUFBWSxRQUFRLGlEQUFpRCxDQUFDO0FBRS9FLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDVixJQUFJLEVBQUUsbUJBQW1CO0lBQ3pCLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFLM0IsQ0FBQyxBQUFDO1FBQ0gsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTlCLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBS3ZCLENBQUMsQ0FBQztRQUNILFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2QyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNqQztDQUNKLENBQUMsQ0FBQyJ9