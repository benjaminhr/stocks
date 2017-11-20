const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const finance = require('google-finance')
// const mysql = require('mysql')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

require('./routes')(app, finance)

var port = process.env.PORT || 8080
app.listen(port)
