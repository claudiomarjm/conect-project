const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Token não fornecido' });

  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token malformado' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  });
}

module.exports = { authMiddleware, adminMiddleware };
