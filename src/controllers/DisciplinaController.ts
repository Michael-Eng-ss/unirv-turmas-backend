import { Request, Response, NextFunction } from 'express';
import { DisciplinaService } from '../services/DisciplinaService';

const disciplinaService = new DisciplinaService();

export class DisciplinaController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const disciplinas = await disciplinaService.findAll();
      res.json(disciplinas);
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
      const disciplina = await disciplinaService.findById(id);
      if (disciplina) {
        res.json(disciplina);
      } else {
        res.status(404).json({ error: 'Disciplina não encontrada' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const disciplina = await disciplinaService.create(req.body);
      res.status(201).json(disciplina);
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
      const disciplina = await disciplinaService.update(id, req.body);
      res.json(disciplina);
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
      const disciplina = await disciplinaService.desativar(id);
      res.json(disciplina);
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
      const disciplina = await disciplinaService.reativar(id);
      res.json(disciplina);
    } catch (error: any) {
      next(error);
    }
  }

  async getInativos(req: Request, res: Response, next: NextFunction) {
    try {
      const disciplinas = await disciplinaService.findInativos();
      res.json(disciplinas);
    } catch (error: any) {
      next(error);
    }
  }
}