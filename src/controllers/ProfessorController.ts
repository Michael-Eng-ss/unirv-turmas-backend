import { Request, Response, NextFunction } from 'express';
import { ProfessorService } from '../services/ProfessorService';

const professorService = new ProfessorService();

export class ProfessorController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const professores = await professorService.findAll();
      res.json(professores);
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
      const professor = await professorService.findById(id);
      if (professor) {
        res.json(professor);
      } else {
        res.status(404).json({ error: 'Professor não encontrado' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const professor = await professorService.create(req.body);
      res.status(201).json(professor);
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
      const professor = await professorService.update(id, req.body);
      res.json(professor);
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
      const professor = await professorService.desativar(id);
      res.json(professor);
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
      const professor = await professorService.reativar(id);
      res.json(professor);
    } catch (error: any) {
      next(error);
    }
  }

  async getInativos(req: Request, res: Response, next: NextFunction) {
    try {
      const professores = await professorService.findInativos();
      res.json(professores);
    } catch (error: any) {
      next(error);
    }
  }
}