require("dotenv").config();

const config = require("../../config/email.json");

class EmailService {
  constructor(env) {
    switch (env) {
      case "development":
        this.link = `${config.dev}${process.env.PORT}`;
        break;
      case "stage":
        this.link = config.stage;
        break;
      case "production":
        this.link = config.prod;
        break;
      default:
        this.link = `${config.dev}${process.env.PORT}`;
        break;
    }
  }

  async sendEmail(verifyToken, email, name) {
    console.log("__MOCKS__ EMAIL: Verification email sent");
  }
}

module.exports = EmailService;
