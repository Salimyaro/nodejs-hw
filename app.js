import express from 'express'
import logger from 'morgan'
import cors from 'cors'

import contactsRouter from './routes/api/contacts.js'

const { json } = express;
const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(json())

app.use('/api/contacts', contactsRouter)

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: err.message })
})

export default app