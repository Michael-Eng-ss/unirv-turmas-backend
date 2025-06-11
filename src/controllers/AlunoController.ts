import { Request, Response, NextFunction } from 'express';
import { AlunoService } from '../services/AlunoService';

const alunoService = new AlunoService();

export class AlunoController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const alunos = await alunoService.findAll();
      // Normalizar status para maiúsculas
      const alunosNormalizados = alunos.map(aluno => ({
        ...aluno,
        status: aluno.status.toUpperCase()
      }));
      res.json(alunosNormalizados);
    } catch (error: any) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const aluno = await alunoService.findById(id);
      if (aluno) {
        // Normalizar status para maiúsculas
        res.json({
          ...aluno,
          status: aluno.status.toUpperCase()
        });
      } else {
        res.status(404).json({ error: 'Aluno não encontrado' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const aluno = await alunoService.create(req.body);
      // Normalizar status para maiúsculas
      res.status(201).json({
        ...aluno,
        status: aluno.status.toUpperCase()
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const aluno = await alunoService.update(id, req.body);
      // Normalizar status para maiúsculas
      if (aluno) {
        res.json({
          ...aluno,
          status: aluno.status.toUpperCase()
        });
      } else {
        res.status(404).json({ error: 'Aluno não encontrado' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async desativar(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const aluno = await alunoService.desativar(id);
      if (aluno) {
        // Normalizar status para maiúsculas
        res.json({
          ...aluno,
          status: aluno.status.toUpperCase()
        });
      } else {
        res.status(404).json({ error: 'Aluno não encontrado' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async reativar(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const aluno = await alunoService.reativar(id);
      // Normalizar status para maiúsculas
      if (aluno) {
        res.json({
          ...aluno,
          status: aluno.status.toUpperCase()
        });
      } else {
        res.status(404).json({ error: 'Aluno não encontrado' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async getInativos(req: Request, res: Response, next: NextFunction) {
    try {
      const alunos = await alunoService.findInativos();
      // Normalizar status para maiúsculas
      const alunosNormalizados = alunos.map(aluno => ({
        ...aluno,
        status: aluno.status.toUpperCase()
      }));
      res.json(alunosNormalizados);
    } catch (error: any) {
      next(error);
    }
  }
}