import express from 'express'
import cors from 'cors'
import { routes } from './routes'
import path from 'path'

const port = process.env.PORT || 5002

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.static(__dirname + '/uploads'));

app.use(routes)

app.listen(port, () => console.log(`Server run on port ${port}`))