"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_server_1 = __importDefault(require("json-server"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const server = json_server_1.default.create();
const router = json_server_1.default.router(path_1.default.join(__dirname, '../db.json'));
const middlewares = json_server_1.default.defaults();
server.use(middlewares);
server.use(json_server_1.default.bodyParser);
const SECRET_KEY = 'seu_secret_key_super_secreto';
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token não enviado' });
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
}
// ==================== AUTH ====================
server.post('/register', (req, res) => {
    const { nome, email, senha } = req.body;
    const dbPath = path_1.default.join(__dirname, '../db.json');
    const db = JSON.parse(fs_1.default.readFileSync(dbPath, 'utf-8'));
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }
    const existingUser = db.usuarios.find((u) => u.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'Email já cadastrado' });
    }
    const newUser = {
        id: db.usuarios.length > 0 ? db.usuarios[db.usuarios.length - 1].id + 1 : 1,
        nome,
        email,
        senha
    };
    db.usuarios.push(newUser);
    fs_1.default.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(201).json({ message: 'Usuário registrado', user: newUser });
});
server.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const db = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../db.json'), 'utf-8'));
    const user = db.usuarios.find((u) => u.email === email && u.senha === senha);
    if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const token = generateToken({ userId: user.id, nome: user.nome });
    res.status(200).json({ token });
});
// ==================== PROTEÇÃO DE ROTAS ====================
server.use((req, res, next) => {
    if (req.path === '/login' ||
        req.path === '/register' ||
        req.path.startsWith('/movies')) {
        return next();
    }
    authenticateToken(req, res, next);
});
// ==================== MOVIES COM FILTRO + PAGINAÇÃO ====================
server.get('/movies', (req, res) => {
    const db = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../db.json'), 'utf-8'));
    let movies = db.movies;
    const { page = 1, limit = 10, year, genre } = req.query;
    if (year) {
        movies = movies.filter((m) => new Date(m.release_date).getFullYear() == Number(year));
    }
    if (genre) {
        movies = movies.filter((m) => m.genres && m.genres.includes(genre));
    }
    const start = (Number(page) - 1) * Number(limit);
    const paginatedMovies = movies.slice(start, start + Number(limit));
    const response = paginatedMovies.map((movie) => ({
        id: movie.id,
        title: movie.title,
        thumbnail: movie.thumbnail
    }));
    res.status(200).json({
        total: movies.length,
        page: Number(page),
        limit: Number(limit),
        data: response
    });
});
// ==================== DETALHE DO FILME + MÉDIA + NOTA DO USUÁRIO ====================
server.get('/movies/:id', (req, res) => {
    const db = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../db.json'), 'utf-8'));
    const movieId = parseInt(req.params.id);
    const movie = db.movies.find((m) => m.id === movieId);
    if (!movie) {
        return res.status(404).json({ message: 'Filme não encontrado' });
    }
    const ratings = db.ratings.filter((r) => r.movieId === movieId);
    const averageRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : null;
    const userRating = req.user
        ? db.ratings.find((r) => r.movieId === movieId && r.userId === req.user.userId)
        : null;
    res.status(200).json(Object.assign(Object.assign({}, movie), { averageRating, userRating: userRating ? userRating.rating : null }));
});
// ==================== USER MOVIES (Lista do usuário) ====================
server.get('/userMovies', (req, res) => {
    const userId = req.user.userId;
    const db = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../db.json'), 'utf-8'));
    const userMovies = db.userMovies.filter((um) => um.userId === userId);
    res.status(200).json(userMovies);
});
server.post('/userMovies', (req, res) => {
    const { movieId, status, rating } = req.body;
    const userId = req.user.userId;
    const dbPath = path_1.default.join(__dirname, '../db.json');
    const db = JSON.parse(fs_1.default.readFileSync(dbPath, 'utf-8'));
    const movieExists = db.movies.find((m) => m.id === movieId);
    if (!movieExists) {
        return res.status(404).json({ message: 'Filme não encontrado' });
    }
    const newUserMovie = {
        id: db.userMovies.length > 0 ? db.userMovies[db.userMovies.length - 1].id + 1 : 1,
        userId,
        movieId,
        status: status || 'quero assistir',
        rating: rating || null
    };
    db.userMovies.push(newUserMovie);
    fs_1.default.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(201).json(newUserMovie);
});
server.patch('/userMovies/:id', (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    const { status, rating } = req.body;
    const dbPath = path_1.default.join(__dirname, '../db.json');
    const db = JSON.parse(fs_1.default.readFileSync(dbPath, 'utf-8'));
    const userMovie = db.userMovies.find((um) => um.id == id);
    if (!userMovie || userMovie.userId !== userId) {
        return res.status(404).json({ message: 'Registro não encontrado ou sem permissão' });
    }
    if (status !== undefined)
        userMovie.status = status;
    if (rating !== undefined)
        userMovie.rating = rating;
    fs_1.default.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(200).json(userMovie);
});
server.delete('/userMovies/:id', (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    const dbPath = path_1.default.join(__dirname, '../db.json');
    const db = JSON.parse(fs_1.default.readFileSync(dbPath, 'utf-8'));
    const userMovieIndex = db.userMovies.findIndex((um) => um.id == id && um.userId === userId);
    if (userMovieIndex === -1) {
        return res.status(404).json({ message: 'Registro não encontrado ou sem permissão' });
    }
    db.userMovies.splice(userMovieIndex, 1);
    fs_1.default.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(204).send();
});
// ==================== RATINGS (Notas de Filmes) ====================
server.post('/ratings', authenticateToken, (req, res) => {
    const { movieId, rating } = req.body;
    const userId = req.user.userId;
    const dbPath = path_1.default.join(__dirname, '../db.json');
    const db = JSON.parse(fs_1.default.readFileSync(dbPath, 'utf-8'));
    const movieExists = db.movies.find((m) => m.id === movieId);
    if (!movieExists) {
        return res.status(404).json({ message: 'Filme não encontrado' });
    }
    const existingRating = db.ratings.find((r) => r.movieId === movieId && r.userId === userId);
    if (existingRating) {
        existingRating.rating = rating;
    }
    else {
        const newRating = {
            id: db.ratings.length > 0 ? db.ratings[db.ratings.length - 1].id + 1 : 1,
            movieId,
            userId,
            rating
        };
        db.ratings.push(newRating);
    }
    fs_1.default.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(200).json({ message: 'Nota salva' });
});
server.use(router);
server.listen(3000, () => {
    console.log('JSON Server rodando em http://localhost:3000');
});
