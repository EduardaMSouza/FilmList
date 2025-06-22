"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = 'cdf13';
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};
exports.generateToken = generateToken;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não encontrado' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};
exports.authenticateToken = authenticateToken;
