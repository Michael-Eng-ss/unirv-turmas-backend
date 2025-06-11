import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import professorRoutes from './routes/professorRoutes';
import salaRoutes from './routes/salaRoutes';
import disciplinaRoutes from './routes/disciplinaRoutes';
import turmaRoutes from './routes/turmaRoutes';
import alunoRoutes from './routes/alunoRoutes';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/professores', professorRoutes);
app.use('/api/salas', salaRoutes);
app.use('/api/disciplinas', disciplinaRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/alunos', alunoRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Servidor está funcionando' });
});

app.use(((err, req, res, next) => {
  console.error('Erro:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body
  });

  if (err.message && (
    err.message.includes('inválido') ||
    err.message.includes('já cadastrado') ||
    err.message.includes('não encontrado') ||
    err.message.includes('já está'))) {
    return res.status(400).json({ error: err.message });
  }

  const response = process.env.NODE_ENV === 'production'
    ? { error: 'Erro interno do servidor' }
    : { error: err.message, stack: err.stack };

  res.status(500).json(response);
}) as express.ErrorRequestHandler);

export default app;