const express = require('express')
const routes = express.Router()

const { verifyToken } = require('./config/auth')

//CONTROLES
const main = require('./controllers/main')

///main
routes.post('/cadastrarLead', main.cadastrarLead)
routes.post('/registrarDiagnostico', verifyToken, main.registrarDiagnostico)
routes.get('/respostaDiagnostico', verifyToken, main.respostaDiagnostico)
routes.get('/verificarTokken', verifyToken, main.verificarTokken)
routes.post('/gerarToken', main.gerarToken)
routes.post('/recuperarDados', verifyToken, main.recuperarDados)


module.exports = routes