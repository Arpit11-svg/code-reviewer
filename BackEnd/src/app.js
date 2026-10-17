const express = require('express')
const aiRoutes = require('./routes/ai.routes')
const cors = require('cors')

const app = express()//create server
app.use(cors()) 

app.use(express.json())//parse incoming requests with JSON payloads

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/ai', aiRoutes)

module.exports = app