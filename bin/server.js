import app from "../app.js";
import db from "../model/db.js";
import checkOrMakeFolder from "../helpers/create-dir.js";
import dotenv from "dotenv";
dotenv.config();

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
