import { Clarinet } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvUGF0b19Hb21lei9EZXNrdG9wL1ZlbGFyL3ZlbGFyL3Rlc3RzL2xpYnJhcnktdjJfdGVzdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IENsYXJpbmV0LCBUeCwgQ2hhaW4sIEFjY291bnQsIHR5cGVzLCBFbXB0eUJsb2NrIH0gZnJvbSAnaHR0cHM6Ly9kZW5vLmxhbmQveC9jbGFyaW5ldEB2MS42LjAvaW5kZXgudHMnO1xuaW1wb3J0IHsgYXNzZXJ0RXF1YWxzIH0gZnJvbSAnaHR0cHM6Ly9kZW5vLmxhbmQvc3RkQDAuOTAuMC90ZXN0aW5nL2Fzc2VydHMudHMnO1xuXG5DbGFyaW5ldC50ZXN0KHtcbiAgICBuYW1lOiBcIkVuc3VyZSB0aGF0IDwuLi4+XCIsXG4gICAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIC8qIFxuICAgICAgICAgICAgICogQWRkIHRyYW5zYWN0aW9ucyB3aXRoOiBcbiAgICAgICAgICAgICAqIFR4LmNvbnRyYWN0Q2FsbCguLi4pXG4gICAgICAgICAgICAqL1xuICAgICAgICBdKTtcbiAgICAgICAgYXNzZXJ0RXF1YWxzKGJsb2NrLnJlY2VpcHRzLmxlbmd0aCwgMCk7XG4gICAgICAgIGFzc2VydEVxdWFscyhibG9jay5oZWlnaHQsIDIpO1xuXG4gICAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIC8qIFxuICAgICAgICAgICAgICogQWRkIHRyYW5zYWN0aW9ucyB3aXRoOiBcbiAgICAgICAgICAgICAqIFR4LmNvbnRyYWN0Q2FsbCguLi4pXG4gICAgICAgICAgICAqL1xuICAgICAgICBdKTtcbiAgICAgICAgYXNzZXJ0RXF1YWxzKGJsb2NrLnJlY2VpcHRzLmxlbmd0aCwgMCk7XG4gICAgICAgIGFzc2VydEVxdWFscyhibG9jay5oZWlnaHQsIDMpO1xuICAgIH0sXG59KTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxTQUFTLFFBQVEsUUFBK0MsOENBQThDLENBQUM7QUFDL0csU0FBUyxZQUFZLFFBQVEsaURBQWlELENBQUM7QUFFL0UsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNWLElBQUksRUFBRSxtQkFBbUI7SUFDekIsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUszQixDQUFDLEFBQUM7UUFDSCxZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFOUIsS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFLdkIsQ0FBQyxDQUFDO1FBQ0gsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2pDO0NBQ0osQ0FBQyxDQUFDIn0=