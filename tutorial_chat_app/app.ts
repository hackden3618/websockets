const clients = new Set();
const server = Bun.serve({
    port: 3000,
    fetch(request, server) {
        console.log(`${request.method} received to ${request.url}`);
        const upgraded = server.upgrade(request);
        if (upgraded) {
            return;
        }
        return new Response("Hey Dennis, First custom server from under the hood :)");
    },
    websocket: {
        open(ws) {
            clients.add(ws);
            console.log(`Websocket client ${ws} connected!`);
        },
        message(ws, message) {
            console.log(`Message received is: ${message} from ${ws}`);
            for (const client of clients) {
                if (client !== ws) {
                    client.send(`Broadcast: ${message}`);
                }
            }
        },
        close(ws) {
            clients.delete(ws);
            console.log("Websocket client disconnected");
        }
    }
});
console.log(`Listening on http://localhost:${server.port}`);