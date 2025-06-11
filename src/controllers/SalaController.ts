import { Request, Response, NextFunction } from 'express';
import { SalaService } from '../services/SalaService';

const salaService = new SalaService();

export class SalaController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const salas = await salaService.findAll();
      res.json(salas);
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
      const sala = await salaService.findById(id);
      if (sala) {
        res.json(sala);
      } else {
        res.status(404).json({ error: 'Sala não encontrada' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const sala = await salaService.create(req.body);
      res.status(201).json(sala);
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
      const sala = await salaService.update(id, req.body);
      res.json(sala);
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
      const sala = await salaService.desativar(id);
      res.json(sala);
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
      const sala = await salaService.reativar(id);
      res.json(sala);
    } catch (error: any) {
      next(error);
    }
  }

  async getInativos(req: Request, res: Response, next: NextFunction) {
    try {
      const salas = await salaService.findInativos();
      res.json(salas);
    } catch (error: any) {
      next(error);
    }
  }
}