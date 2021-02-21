import commander from "commander";
const { Command } = commander;
const program = new Command();

program
  .version("0.0.1")
  .option("-a, --action <action>", "Get action")
  .option("-id, --id <id>", "Get id")
  .option("-n, --name <name>", "Get new user name")
  .option("-m, --email <email>", "Get new user email")
  .option("-p, --phone <phone>", "Get new user phone");

  export default program;