const app = require("../app");
const db = require("../model/db");
const checkOrMakeFolder = require("../helpers/create-dir");
require("dotenv").config();

const PORT = process.env.PORT || 1313;

db.then(() => {
  app.listen(PORT, async () => {
    await checkOrMakeFolder(process.env.UPLOAD_DIR);
    await checkOrMakeFolder(process.env.USERS_AVATARS_DIR);
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((err) => {
  console.log(`Server not running. Error message: ${err.message}`);
  process.exit(1);
});
