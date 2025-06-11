import { Request, Response, NextFunction } from 'express';
import { TurmaService } from '../services/TurmaService';

const turmaService = new TurmaService();

export class TurmaController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const turmas = await turmaService.findAll();
      res.json(turmas);
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
      const turma = await turmaService.findById(id);
      if (turma) {
        res.json(turma);
      } else {
        res.status(404).json({ error: 'Turma não encontrada' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const turmaData = {
        ...req.body,
        professor: { id: req.body.professor_id },
        disciplina: { id: req.body.disciplina_id },
        sala: { id: req.body.sala_id }
      };
      
      const turma = await turmaService.create(turmaData);
      res.status(201).json(turma);
    } catch (error: any) {
      next(error);
    }
  }


  async update(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    try {
      const turmaData = {
        ...req.body,
        professor: req.body.professor_id ? { id: req.body.professor_id } : undefined,
        disciplina: req.body.disciplina_id ? { id: req.body.disciplina_id } : undefined,
        sala: req.body.sala_id ? { id: req.body.sala_id } : undefined
      };
      
      const turma = await turmaService.update(id, turmaData);
      res.json(turma);
    } catch (error: any) {
      next(error);
    }
  }

  async desativar(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    try {
      const turma = await turmaService.desativar(id);
      res.json(turma);
    } catch (error: any) {
      next(error);
    }
  }

  async reativar(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    try {
      const turma = await turmaService.reativar(id);
      res.json(turma);
    } catch (error: any) {
      next(error);
    }
  }

  async adicionarAluno(req: Request, res: Response, next: NextFunction) {
    const turmaId = parseInt(req.params.turmaId);
    const alunoId = parseInt(req.params.alunoId);
    
    if (isNaN(turmaId) || isNaN(alunoId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    try {
      const result = await turmaService.adicionarAluno(turmaId, alunoId);
      res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async removerAluno(req: Request, res: Response, next: NextFunction) {
    const turmaId = parseInt(req.params.turmaId);
    const alunoId = parseInt(req.params.alunoId);
    
    if (isNaN(turmaId) || isNaN(alunoId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    try {
      const result = await turmaService.removerAluno(turmaId, alunoId);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }

  async getInativos(req: Request, res: Response, next: NextFunction) {
    try {
      const turmas = await turmaService.findInativas();
      res.json(turmas);
    } catch (error: any) {
      next(error);
    }
  }
}