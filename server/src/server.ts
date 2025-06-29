import jsonServer from 'json-server'; 
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '../db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

const SECRET_KEY = 'seu_secret_key_super_secreto';

function generateToken(payload: object) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
}

function authenticateToken(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  try {
    const user = jwt.verify(token, SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }
}

server.post('/register', (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;
  const dbPath = path.join(__dirname, '../db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
  }

  const existingUser = db.usuarios.find((u: any) => u.email === email);
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
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.status(201).json({ message: 'Usuário registrado', user: newUser });
});

server.post('/login', (req: Request, res: Response) => {
  const { email, senha } = req.body;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf-8'));
  const user = db.usuarios.find((u: any) => u.email === email && u.senha === senha);

  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = generateToken({ userId: user.id, nome: user.nome });
  res.status(200).json({ token });
});

server.use((req: Request & { user?: any }, res: Response, next: NextFunction) => {
  if (
    req.path === '/login' ||
    req.path === '/register'
  ) {
    return next();
  }
  authenticateToken(req, res, next);
});

server.get('/movies', (req: Request, res: Response) => {
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf-8'));
  let movies = db.movies;
  const userMovies = db.userMovies || [];

  const { page = 1, limit = 10, year, yearMin, yearMax, genre } = req.query;

  if (year) {
    movies = movies.filter((m: any) => new Date(m.release_date).getFullYear() == Number(year));
  }

  if (yearMin && yearMax) {
    movies = movies.filter((m: any) => {
      const ano = new Date(m.release_date).getFullYear();
      return ano >= Number(yearMin) && ano <= Number(yearMax);
    });
  }

  if (genre) {
    movies = movies.filter((m: any) => {
      if (!m.genres) return false;
      if (Array.isArray(m.genres)) {
        return m.genres.includes(genre);
      }
      return typeof m.genres === 'string' && m.genres === genre;
    });
  }

  const start = (Number(page) - 1) * Number(limit);
  const paginatedMovies = movies.slice(start, start + Number(limit));

  const response = paginatedMovies.map((movie: any) => {
    const ratings = userMovies.filter((um: any) => um.movieId === movie.id && um.rating != null);
    const avgRating = ratings.length > 0 ?
      Math.round((ratings.reduce((sum: number, um: any) => sum + um.rating, 0) / ratings.length) * 10) / 10 : null;
    return {
      id: movie.id,
      title: movie.title,
      poster_url: movie.poster_url || movie.thumbnail || '',
      rating: avgRating,
      averageRating: avgRating,
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

server.get('/userMovies/:movieId', authenticateToken, (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const movieId = parseInt(req.params.movieId);
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf-8'));
  const userMovie = db.userMovies.find((um: any) => um.userId === userId && um.movieId === movieId);

  if (!userMovie) {
    return res.status(404).json({ message: 'Nenhum status definido para esse filme' });
  }

  res.status(200).json(userMovie);
});

server.get('/movies/:id', (req: Request & { user?: any }, res: Response) => {
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf-8'));
  const movieId = parseInt(req.params.id);
  const movie = db.movies.find((m: any) => m.id === movieId);

  if (!movie) {
    return res.status(404).json({ message: 'Filme não encontrado' });
  }

  const userMovies = db.userMovies.filter((r: any) => r.movieId === movieId);
    const ratings = userMovies.filter((um: any) => um.movieId === movie.id && um.rating != null);

  const avgRating = ratings.length > 0 ?
        Math.round((ratings.reduce((sum: number, um: any) => sum + um.rating, 0) / ratings.length) * 10) / 10 : null;

  let userMovieInfo = null;
  if (req.user) {
    userMovieInfo = db.userMovies.find((r: any) => r.movieId === movieId && r.userId === req.user.userId);
  }

  res.status(200).json({
    ...movie,
    averageRating: avgRating,
    totalUsers: userMovies.length,
    userRating: userMovieInfo?.rating ?? null,
    userStatus: userMovieInfo?.status ?? null 
  });
});


server.get('/userMovies', (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.userId;
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf-8'));

  let userMovies = db.userMovies.filter((um: any) => um.userId === userId);

  if (req.query.status) {
    userMovies = userMovies.filter((um: any) => um.status === req.query.status);
  }

  const response = userMovies.map((userMovie: any) => {
    const movie = db.movies.find((m: any) => m.id === userMovie.movieId);
    const allUserMovies = db.userMovies.filter((um: any) => um.movieId === userMovie.movieId && um.rating != null);
    const avgRating = allUserMovies.length > 0 ?
      Math.round((allUserMovies.reduce((sum: number, um: any) => sum + um.rating, 0) / allUserMovies.length) * 10) / 10 : null;
    return {
      ...userMovie,
      movie: movie ? { 
        ...movie, 
        rating: avgRating,
        averageRating: avgRating,
        genre_names: Array.isArray(movie.genres) ? movie.genres : (movie.genres ? [movie.genres] : [])
      } : null
    };
  });

  res.status(200).json(response);
});

server.post('/userMovies', (req: Request & { user?: any }, res: Response) => {
  const { movieId, status, rating } = req.body;
  const userId = req.user.userId;
  const dbPath = path.join(__dirname, '../db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  const movieExists = db.movies.find((m: any) => m.id === movieId);
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
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.status(201).json(newUserMovie);
});

server.patch('/userMovies/:id', (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { status, rating } = req.body;

  const dbPath = path.join(__dirname, '../db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  let userMovieIndex = db.userMovies.findIndex((um: any) => um.id == id);

  if (userMovieIndex === -1) {
    if (status == null) {
      return res.status(404).json({ message: 'Registro não encontrado' });
    }

    const newUserMovie = {
      id: Number(id),
      userId: userId,
      movieId: Number(id),
      status: status ?? null,
      rating: rating ?? null
    };
    db.userMovies.push(newUserMovie);

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    return res.status(201).json(newUserMovie);
  } else {
    const userMovie = db.userMovies[userMovieIndex];

    if (userMovie.userId !== userId) {
      return res.status(404).json({ message: 'Registro não encontrado ou sem permissão' });
    }

    if (status === null || status === undefined) {
      db.userMovies.splice(userMovieIndex, 1);
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      return res.status(200).json({ message: 'Registro removido' });
    }

    if (status !== undefined) userMovie.status = status;

    if (userMovie.status !== 'já assisti' && userMovie.rating != null) {
      userMovie.rating = null;
    } else {
      if (rating !== undefined) userMovie.rating = rating;
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    return res.status(200).json(userMovie);
  }
});

server.delete('/userMovies/:id', (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const dbPath = path.join(__dirname, '../db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  const userMovieIndex = db.userMovies.findIndex((um: any) => um.id == id && um.userId === userId);

  if (userMovieIndex === -1) {
    return res.status(404).json({ message: 'Registro não encontrado ou sem permissão' });
  }

  db.userMovies.splice(userMovieIndex, 1);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.status(204).send();
});

server.post('/ratings', authenticateToken, (req: Request & { user?: any }, res: Response) => {
  const { movieId, rating } = req.body;
  const userId = req.user.userId;
  const dbPath = path.join(__dirname, '../db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  const movieExists = db.movies.find((m: any) => m.id === movieId);
  if (!movieExists) {
    return res.status(404).json({ message: 'Filme não encontrado' });
  }

  const existingRating = db.userMovies.find((r: any) => r.movieId === movieId && r.userId === userId);

  if (existingRating) {
    existingRating.rating = rating;
  } else {
    const newRating = {
      id: db.userMovies.length > 0 ? db.userMovies[db.userMovies.length - 1].id + 1 : 1,
      movieId,
      userId,
      rating
    };
    db.userMovies.push(newRating);
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(200).json({ message: 'Nota salva' });
});

server.get('/ratings', (req: Request, res: Response) => {
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf-8'));
  const userMovies = db.userMovies || [];
  const ratings = userMovies.filter((um: any) => um.rating != null).map((um: any) => ({
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
