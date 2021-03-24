const fs = require("fs").promises;

const isAccessible = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch (e) {
    return false;
  }
};

const checkOrMakeFolder = async (folder) => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

module.exports = checkOrMakeFolder;
