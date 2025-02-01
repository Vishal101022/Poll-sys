
const http = require("http");
const app = require("./app");
const { createWebSocketServer } = require("./websocket");
const logger = require("./config/logger.js");
const db = require("./config/db");

  // Create an HTTP server using the Express app
  const server = http.createServer(app);

  // Create the WebSocket server
  const io = createWebSocketServer(server);

  // Start the server
  const port = process.env.PORT || 3000;
server.listen(port, async() => {
    await db();
    logger.info(`Worker ${process.pid} is running on port ${port}`);
  });

  module.exports = { app, io };
// }
