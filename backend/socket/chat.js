const Message = require("../models/mongoose_message.model");

function socketHandler(io) {
  io.on("connection", (socket) => {});
}

module.exports = socketHandler;
