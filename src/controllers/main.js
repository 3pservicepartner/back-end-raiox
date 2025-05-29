const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Lead = require('../models/Lead')
const Diagnostico = require('../models/Diagnostico')
const Usuario = require('../models/Usuario')


module.exports = {

    async cadastrarLead(req, res) {
        const {
            nome,
            nomeEmpresa,
            contato,
            email,
            segmento,
            faturamento,
            qtdFuncionario,
            termosAceito
        } = req.body;

        let casdastroTeste = false

        try {

            //verificando se os termos foram aceitos
            if (!termosAceito) {
                return res.status(400).json({ error: 'É necessário aceitar os termos para realizar o cadastro' })
            }

            //verificando se existe nome
            if (nome == '' || nome == null) {
                return res.status(400).json({ error: 'especifique o nome de contato' });
            }

            //verificando se existe nomeEmpresa 
            if (nomeEmpresa == '' || nomeEmpresa == null) {
                return res.status(400).json({ error: 'especifique o nome da empresa' });
            }

            //verificando se existe contato 
            if (contato == '' || contato == null) {
                return res.status(400).json({ error: 'especifique o contato do usuario' });
            }

            //verificando se existe email 
            if (email == '' || email == null) {
                return res.status(400).json({ error: 'especifique o email do usuario' });
            }


            // validar e-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Formato de e-mail inválido.' });
            }

            // validar contato
            const telefoneRegex = /^\d{10,11}$/;
            if (!telefoneRegex.test(contato)) {
                return res.status(400).json({ error: 'Formato de telefone inválido. Use apenas números com DDD, ex: 41999998888.' });
            }

            // Verificar se já existe um lead para o email 
            let leadExistente = await Lead.findOne({ email: email });
            if (leadExistente) {

                if (email === "silviorea@3pservicepartner.com.br" || email === "jamal@3pservicepartner.com.br") {
                    casdastroTeste = true
                } else {
                    return res.status(400).json({ error: 'Já existe um usuário cadastrado com esse email.' });
                }


            }

            // Verificar se já existe um lead para o contato 
            leadExistente = await Lead.findOne({ contato: contato });
            if (leadExistente && !casdastroTeste) {
                return res.status(400).json({ error: 'Já existe um usuário cadastrado com esse contato.' });
            }

            //verificando se existe contato 
            if (segmento == '' || segmento == null) {
                return res.status(400).json({ error: 'especifique o segmento' });
            }

            //verificando se existe contato 
            if (faturamento == '' || faturamento == null) {
                return res.status(400).json({ error: 'especifique o faturamento' });
            }

            //verificando se existe contato 
            if (qtdFuncionario == '' || qtdFuncionario == null) {
                return res.status(400).json({ error: 'especifique a quantidade de funcionários' });
            }

            //ainda necessario criar a verificação de um email valido 
            //ainda criar verificação se contato valido 
            if (!casdastroTeste) {
                // Cadastrar um novo lead
                const novoLead = new Lead({
                    nome: nome,
                    nomeEmpresa: nomeEmpresa,
                    contato: contato,
                    email: email,
                    segmento: segmento,
                    faturamento: faturamento,
                    qtdFuncionario: qtdFuncionario
                });

                await novoLead.save()

            } else {

                leadExistente.nome = nome
                leadExistente.nomeEmpresa = nomeEmpresa
                leadExistente.contato = contato
                leadExistente.email = email
                leadExistente.segmento = segmento
                leadExistente.faturamento = faturamento
                leadExistente.qtdFuncionario = qtdFuncionario

            }

            const secretKey = 'chave_teste' //process.env.SECRET_KEY;
            // Gerar token JWT após a autenticação do usuário
            const token = jwt.sign({ userEmail: novoLead.email }, secretKey, { expiresIn: '1h' });

            return res.status(201).json({ message: 'Lead cadastrado com sucesso!', token });

        } catch (error) {

            console.log(error);
            return res.status(500).json({ error: 'Erro ao registrar o Lead.' });

        }
    },
    async registrarDiagnostico(req, res) {

        console.log('ta vindo')

        const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = req.body

        try {

            const email = req.userEmail
            //verificando se o usuario ja respondeu a pergunta
            const diagnostico = await Diagnostico.findOne({ email: email })

            if (diagnostico) return res.status(500).json({ error: 'Diagnóstico já realizado' });

            const respostas = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];

            // Verificar se todos os valores são números e estão entre 1 e 5
            const invalidResponses = respostas.filter(q => typeof q !== 'number' || q < 1 || q > 5);

            if (invalidResponses.length > 0) {
                return res.status(400).json({
                    error: 'Responda todas as perguntas antes de enviar o diagnóstico.',
                    invalidValues: invalidResponses
                });
            }

            // Cadastrar um novo diagnostico
            const novoDiagnostico = new Diagnostico({
                email: email,
                q1: q1,
                q2: q2,
                q3: q3,
                q4: q4,
                q5: q5,
                q6: q6,
                q7: q7,
                q8: q8,
                q9: q9,
                q10: q10,
                total: q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + q9 + q10
            });

            await novoDiagnostico.save()

            return res.status(201).json({ message: 'Diagnóstico realizado com sucesso!' });

        } catch (error) {

            console.log(error);
            return res.status(500).json({ error: 'Erro ao registrar o Diagnóstico.' });

        }


    },
    async respostaDiagnostico(req, res) {

        try {

            const email = req.userEmail
            const diagnostico = await Diagnostico.findOne({ email: email })

            if (diagnostico) {
                return res.status(200).json({ diagnostico });
            } else {
                return res.status(400).json({ error: 'não foi localizado nenhum diagnostico para o lead' });
            }

        } catch (error) {

            return res.status(500).json({ error: 'Erro ao recuperar diagnóstico.' });

        }

    },
    async verificarTokken(req, res) {

        const email = req.userEmail
        //verificando se o usuario ja respondeu a pergunta
        let respondido = false
        const diagnostico = await Diagnostico.findOne({ email: email })
        if (diagnostico) {
            respondido = true
        }

        return res.status(200).json({ message: 'Usuario autenticado!', respondido });
    },
    async gerarToken(req, res) {

        let SendUser = req.body.email
        let SendKey = req.body.password
        let user = await Usuario.findOne({ email: SendUser })

        if (!user) return res.status(400).json({ error: "Senha ou Usario Incorreto" })

        const senhaCorreta = await bcrypt.compare(SendKey, user.senha);
        if (senhaCorreta) {

            const secretKey = 'chave_teste'
            // Gerar token JWT após a autenticação do usuário
            const token = jwt.sign({ userId: user.id }, secretKey);

            res.status(200).json(token);

        } else {

            return res.status(400).json({ error: "Senha ou Usario Incorreto" })

        }
    },
    async recuperarDados(req, res) {
        const { dataInicial, dataFinal } = req.body;

        // Função para validar o formato da data
        const validarData = (data) => {
            const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
            return regex.test(data);
        };

        // Função para converter a data no formato desejado
        const formatarData = (data) => {
            const options = { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            return new Date(data).toLocaleString('pt-BR', options);
        };

        // Validar as datas
        if (!validarData(dataInicial) || !validarData(dataFinal)) {
            return res.status(400).json({ error: 'Formato de data inválido. Use dd/mm/aaaa.' });
        }

        // Converter as datas para o formato ISO
        const [diaInicial, mesInicial, anoInicial] = dataInicial.split('/');
        const [diaFinal, mesFinal, anoFinal] = dataFinal.split('/');

        const inicio = new Date(`${anoInicial}-${mesInicial}-${diaInicial}T00:00:00Z`);
        const fim = new Date(`${anoFinal}-${mesFinal}-${diaFinal}T23:59:59Z`);

        // Verificar se a data final não é mais antiga que a inicial
        if (fim < inicio) {
            return res.status(400).json({ error: 'A data final não pode ser anterior à data inicial.' });
        }

        try {
            // Buscar registros de "Lead" e "Diagnostico"
            const leads = await Lead.find({ createdAt: { $gte: inicio, $lte: fim } });
            const diagnosticos = await Diagnostico.find({ createdAt: { $gte: inicio, $lte: fim } });

            // Formatar as datas antes de retornar
            const formatarRegistros = (registros) => {
                return registros.map(registro => ({
                    ...registro.toObject(),
                    createdAt: formatarData(registro.createdAt),
                    updatedAt: formatarData(registro.updatedAt),
                }));
            };

            const registrosFormatados = {
                leads: formatarRegistros(leads),
                diagnosticos: formatarRegistros(diagnosticos),
            };

            return res.json(registrosFormatados);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao recuperar os dados.' });
        }
    },
    async criaLoginTemp(req, res) {

        const novoUsuario = new Usuario({
            email: '3pservicepartner2@gmail.com',
            senha: '3pSenhaExcel'
        })

        bcrypt.genSalt(10, (erro, salt) => {
            bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                if (erro) {
                    res.send("Houve um erro durante o salvamento do usuario")
                }

                novoUsuario.senha = hash
                novoUsuario.save().then(() => {
                    res.send("Usuario criado com sucessso!")
                }).catch((err) => {
                    res.send("Houve um erro ao criar o usuario, tente novamente!")
                })


            })
        })


    }

}