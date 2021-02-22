import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync.js'

const adapter = new FileSync('./model/contacts.json')
const db = low(adapter)

db.defaults({ contacts: [] }).write()

export default db
