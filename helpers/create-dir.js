import fs from "fs/promises";

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

export default checkOrMakeFolder;
