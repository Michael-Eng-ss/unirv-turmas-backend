import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import professorRoutes from './routes/professorRoutes';
import salaRoutes from './routes/salaRoutes';
import disciplinaRoutes from './routes/disciplinaRoutes';
import turmaRoutes from './routes/turmaRoutes';
import alunoRoutes from './routes/alunoRoutes';

const app = express();

// 1. Configuração de CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Middleware para JSON
app.use(express.json());

// 3. Rotas principais
app.use('/api/professores', professorRoutes);
app.use('/api/salas', salaRoutes);
app.use('/api/disciplinas', disciplinaRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/alunos', alunoRoutes);

// 4. Rota de health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Servidor está funcionando' });
});

// 5. Tratamento de erros
app.use(((err, req, res, next) => {
  console.error('Erro:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body
  });
  
  // Tratamento de erros específicos
  if (err.message && (
      err.message.includes('inválido') || 
      err.message.includes('já cadastrado') || 
      err.message.includes('não encontrado') ||
      err.message.includes('já está'))) {
    return res.status(400).json({ error: err.message });
  }
  
  // Erro genérico (não mostra detalhes em produção)
  const response = process.env.NODE_ENV === 'production'
    ? { error: 'Erro interno do servidor' }
    : { error: err.message, stack: err.stack };
    
  res.status(500).json(response);
}) as express.ErrorRequestHandler);

export default app;