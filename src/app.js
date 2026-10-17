const express =  require('express')

const app = express()//create server

app.get('/', (req, res) =>{
    res.send('Hello World')
})

module.exports = app