const server = require("./app");
const port = process.env.PORT || 3335;

server.listen(port, console.log(`Backend is Running on Port: ${port}`));
