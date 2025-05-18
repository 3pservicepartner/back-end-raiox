const jwt = require('jsonwebtoken');
const secretKey = 'chave_teste'; //process.env.SECRET_KEY;

module.exports = {
    verifyToken: function(req, res, next) {
        const authorizationHeader = req.headers.authorization;
        
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'credenciais-inválidas' });
        }
        
        const token = authorizationHeader.split(' ')[1];
        
        try {
            // Decodifica o token e verifica a assinatura
            const decoded = jwt.verify(token, secretKey);
            // Armazena o ID do usuário na propriedade 'userId' do objeto de requisição
            req.userEmail = decoded.userEmail;
            next();
        } catch (err) {
            res.status(401).json({ error: 'credenciais-inválidas' });
        }
    }
}