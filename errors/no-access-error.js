const Error = require("./error");

class NoAccessError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = NoAccessError;
