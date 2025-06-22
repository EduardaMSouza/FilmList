"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_server_1 = __importDefault(require("json-server"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("./auth");
const server = json_server_1.default.create();
const router = json_server_1.default.router(path_1.default.join(__dirname, '../db.json'));
const middlewares = json_server_1.default.defaults();
server.use(middlewares);
server.use(json_server_1.default.bodyParser);
server.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const db = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../db.json'), 'utf-8'));
    const user = db.usuarios.find((u) => u.email === email && u.senha === senha);
    if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const token = (0, auth_1.generateToken)({ userId: user.id, nome: user.nome });
    return res.status(200).json({ token });
});
// Proteger todas as rotas exceto /login e /usuarios
server.use((req, res, next) => {
    if (req.path === '/login' || req.path.startsWith('/usuarios')) {
        return next();
    }
    (0, auth_1.authenticateToken)(req, res, next);
});
// Vincular userId ao criar movie
server.post('/movies', (req, res, next) => {
    var _a;
    req.body.userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    next();
});
// Filtrar movies por userId do token
server.get('/movies', (req, res, next) => {
    const db = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../db.json'), 'utf-8'));
    const movies = db.movies.filter((movie) => { var _a; return movie.userId === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId); });
    res.status(200).json(movies);
});
// Permitir editar/deletar só os próprios movies
server.use('/movies/:id', (req, res, next) => {
    var _a;
    const db = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../db.json'), 'utf-8'));
    const movie = db.movies.find((m) => m.id == req.params.id);
    if (!movie) {
        return res.status(404).json({ message: 'Filme não encontrado' });
    }
    if (movie.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
        return res.status(403).json({ message: 'Sem permissão para alterar esse filme' });
    }
    next();
});
server.use(router);
server.listen(3000, () => {
    console.log('JSON Server rodando em http://localhost:3000');
});
