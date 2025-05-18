const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Lead = new Schema({
    nome: {
        type: String,
        required: true
    },
    nomeEmpresa: {
        type: String,
        required: true
    },
    contato: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    segmento: {
        type: String,
        required: true
    },
    faturamento: {
        type: String,
        required: true
    },
    qtdFuncionario: {
        type: String,
        required: true
    },

}, { timestamps: true });

module.exports = mongoose.model("lead", Lead)