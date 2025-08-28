import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { userRouter, transactionRouter } from './routes/index.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/transactions', transactionRouter)

const swaggerDocument = JSON.parse(
    fs.readFileSync(join(__dirname, '../docs/swagger.json'), 'utf8'),
)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
export { app }
