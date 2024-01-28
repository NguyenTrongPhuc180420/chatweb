var format = require("date-format");
const createMessage = (messageText, username) => {
  return {
    message: messageText,
    createAt: format("yyyy-MM-dd hh:mm:ss", new Date()),
    username,
  };
};
module.exports = {
  createMessage,
};
