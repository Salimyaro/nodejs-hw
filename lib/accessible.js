import * as fs from 'fs/promises'

export const isAccessible = async (path) => {
  try {
    await fs.access(path)
    return true
  } catch (e) {
    return false
  }
}
