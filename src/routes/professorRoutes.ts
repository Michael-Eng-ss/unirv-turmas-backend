import express, { RequestHandler } from 'express';
import { ProfessorController } from '../controllers/ProfessorController';

const router = express.Router();
const professorController = new ProfessorController();

router.get('/', professorController.getAll as RequestHandler);
router.get('/:id', professorController.getById as RequestHandler);
router.post('/', professorController.create as RequestHandler);
router.put('/:id', professorController.update as RequestHandler);
router.patch('/:id/desativar', professorController.desativar as RequestHandler);
router.patch('/:id/reativar', professorController.reativar as RequestHandler);

export default router;