require('dotenv').config()
//CARREGANDO MODULOS
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const path = require("path")
const mongoose = require('mongoose')
const {mongoURI} = require("./config/db")
const routes = require('./routes')

const portApp = 8085

//CONFIGURAÇÕES
// cors
const corsOptions ={
    origin:['http://localhost:3000', 'https://www.raiox3p.com'], 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions))

const dir = path.join(__dirname, 'public');

app.use('/public', express.static(dir));
// Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Mongoose
mongoose.Promise = global.Promise
mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("MongoDB Conectado...")
}).catch((err) => {
    console.log("Ouve um Erro ao conectar: " + err)
})
// Public
app.use(express.static(path.join(__dirname, "public")))

app.use(routes)
//Outros
const PORT = portApp
app.listen(PORT, () => {
    console.log("Servidor rodando")
})