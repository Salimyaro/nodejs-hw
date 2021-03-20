import Mailgen from "mailgen";
import sgMail from "@sendgrid/mail";
import config from "../config/email.json";

import dotenv from "dotenv";
dotenv.config();

class EmailService {
  #sender = sgMail;
  #GenerateTemplate = Mailgen;
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

  #createTemplate(verifyToken, name = "Guest") {
    const mailGenerator = new this.#GenerateTemplate({
      theme: "neopolitan",
      product: {
        name: "System Contacts",
        link: this.link,
      },
    });
    const template = {
      body: {
        name,
        intro: "Это у нас интро и где ты находишся?",
        action: {
          instructions: "Чтобы закончить регистрацию кликните на кнопку",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Подтвердить свой аккаунт",
            link: `${this.link}/api/users/auth/verify/${verifyToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    return mailGenerator.generate(template);
  }

  async sendEmail(verifyToken, email, name) {
    const emailBody = this.#createTemplate(verifyToken, name);
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: process.env.SENDGRID_API_EMAIL, // Use the email address or domain you verified above
      subject: "Подтверждение регистрации",
      html: emailBody,
    };
    try {
      await this.#sender.send(msg);
      console.log("Verification email sent");
    } catch (error) {
      console.log(error)
    }
  }
}

export default EmailService;