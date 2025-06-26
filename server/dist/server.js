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
    return jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: '24h' });
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
server.use((req, res, next) => {
    if (req.path === '/login' ||
        req.path === '/register') {
        return next();
    }
    authenticateToken(req, res, next);
});
server.get('/movies', (req, res) => {
    const db = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../db.json'), 'utf-8'));
    let movies = db.movies;
    const userMovies = db.userMovies || [];
    const { page = 1, limit = 10, year, yearMin, yearMax, genre } = req.query;
    if (year) {
        movies = movies.filter((m) => new Date(m.release_date).getFullYear() == Number(year));
    }
    if (yearMin && yearMax) {
        movies = movies.filter((m) => {
            const ano = new Date(m.release_date).getFullYear();
            return ano >= Number(yearMin) && ano <= Number(yearMax);
        });
    }
    if (genre) {
        movies = movies.filter((m) => {
            if (!m.genres)
                return false;
            if (Array.isArray(m.genres)) {
                return m.genres.includes(genre);
            }
            return typeof m.genres === 'string' && m.genres === genre;
        });
    }
    const start = (Number(page) - 1) * Number(limit);
    const paginatedMovies = movies.slice(start, start + Number(limit));
    const response = paginatedMovies.map((movie) => {
        const ratings = userMovies.filter((um) => um.movieId === movie.id && um.rating != null);
        const avgRating = ratings.length > 0 ?
            Math.round((ratings.reduce((sum, um) => sum + um.rating, 0) / ratings.length) * 10) / 10 : null;
        return {
            id: movie.id,
            title: movie.title,
            poster_url: movie.poster_url || movie.thumbnail || '',
            rating: avgRating,
            release_date: movie.release_date,
            genre_names: Array.isArray(movie.genres) ? movie.genres : (movie.genres ? [movie.genres] : []),
            overview: movie.overview || ''
        };
    });
    res.status(200).json({
        total: movies.length,
        page: Number(page),
        limit: Number(limit),
        data: response
    });
});
server.get('/userMovies/:movieId', authenticateToken, (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const movieId = parseInt(req.params.movieId);
    const db = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../db.json'), 'utf-8'));
    const userMovie = db.userMovies.find((um) => um.userId === userId && um.movieId === movieId);
    if (!userMovie) {
        return res.status(404).json({ message: 'Nenhum status definido para esse filme' });
    }
    res.status(200).json(userMovie);
});
server.get('/movies/:id', (req, res) => {
    var _a, _b;
    const db = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../db.json'), 'utf-8'));
    const movieId = parseInt(req.params.id);
    const movie = db.movies.find((m) => m.id === movieId);
    if (!movie) {
        return res.status(404).json({ message: 'Filme não encontrado' });
    }
    const userMovies = db.userMovies.filter((r) => r.movieId === movieId);
    const averageRating = userMovies.length > 0
        ? Math.round((userMovies.reduce((sum, r) => sum + r.rating, 0) / userMovies.length) * 10) / 10
        : null;
    let userMovieInfo = null;
    if (req.user) {
        userMovieInfo = db.userMovies.find((r) => r.movieId === movieId && r.userId === req.user.userId);
    }
    res.status(200).json(Object.assign(Object.assign({}, movie), { averageRating, totalUsers: userMovies.length, userRating: (_a = userMovieInfo === null || userMovieInfo === void 0 ? void 0 : userMovieInfo.rating) !== null && _a !== void 0 ? _a : null, userStatus: (_b = userMovieInfo === null || userMovieInfo === void 0 ? void 0 : userMovieInfo.status) !== null && _b !== void 0 ? _b : null }));
});
server.get('/userMovies', (req, res) => {
    const userId = req.user.userId;
    const db = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../db.json'), 'utf-8'));
    let userMovies = db.userMovies.filter((um) => um.userId === userId);
    if (req.query.status) {
        userMovies = userMovies.filter((um) => um.status === req.query.status);
    }
    const response = userMovies.map((userMovie) => {
        const movie = db.movies.find((m) => m.id === userMovie.movieId);
        const allUserMovies = db.userMovies.filter((um) => um.movieId === userMovie.movieId && um.rating != null);
        const avgRating = allUserMovies.length > 0 ?
            Math.round((allUserMovies.reduce((sum, um) => sum + um.rating, 0) / allUserMovies.length) * 10) / 10 : null;
        return Object.assign(Object.assign({}, userMovie), { movie: movie ? Object.assign(Object.assign({}, movie), { rating: avgRating, genre_names: Array.isArray(movie.genres) ? movie.genres : (movie.genres ? [movie.genres] : []) }) : null });
    });
    res.status(200).json(response);
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
    let userMovieIndex = db.userMovies.findIndex((um) => um.id == id);
    if (userMovieIndex === -1) {
        if (status == null) {
            return res.status(404).json({ message: 'Registro não encontrado' });
        }
        const newUserMovie = {
            id: Number(id),
            userId: userId,
            movieId: Number(id),
            status: status !== null && status !== void 0 ? status : null,
            rating: rating !== null && rating !== void 0 ? rating : null
        };
        db.userMovies.push(newUserMovie);
        fs_1.default.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        return res.status(201).json(newUserMovie);
    }
    else {
        const userMovie = db.userMovies[userMovieIndex];
        if (userMovie.userId !== userId) {
            return res.status(404).json({ message: 'Registro não encontrado ou sem permissão' });
        }
        if (status === null || status === undefined) {
            db.userMovies.splice(userMovieIndex, 1);
            fs_1.default.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return res.status(200).json({ message: 'Registro removido' });
        }
        if (status !== undefined)
            userMovie.status = status;
        if (userMovie.status !== 'já assisti' && userMovie.rating != null) {
            userMovie.rating = null;
        }
        else {
            if (rating !== undefined)
                userMovie.rating = rating;
        }
        fs_1.default.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        return res.status(200).json(userMovie);
    }
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
server.post('/ratings', authenticateToken, (req, res) => {
    const { movieId, rating } = req.body;
    const userId = req.user.userId;
    const dbPath = path_1.default.join(__dirname, '../db.json');
    const db = JSON.parse(fs_1.default.readFileSync(dbPath, 'utf-8'));
    const movieExists = db.movies.find((m) => m.id === movieId);
    if (!movieExists) {
        return res.status(404).json({ message: 'Filme não encontrado' });
    }
    const existingRating = db.userMovies.find((r) => r.movieId === movieId && r.userId === userId);
    if (existingRating) {
        existingRating.rating = rating;
    }
    else {
        const newRating = {
            id: db.userMovies.length > 0 ? db.userMovies[db.userMovies.length - 1].id + 1 : 1,
            movieId,
            userId,
            rating
        };
        db.userMovies.push(newRating);
    }
    fs_1.default.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(200).json({ message: 'Nota salva' });
});
server.get('/ratings', (req, res) => {
    const db = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../db.json'), 'utf-8'));
    const userMovies = db.userMovies || [];
    const ratings = userMovies.filter((um) => um.rating != null).map((um) => ({
        movieId: um.movieId,
        userId: um.userId,
        rating: um.rating
    }));
    res.status(200).json(ratings);
});
server.use(router);
server.listen(3000, () => {
    console.log('JSON Server rodando em http://localhost:3000');
});
