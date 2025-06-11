import express, { RequestHandler } from 'express';
import { DisciplinaController } from '../controllers/DisciplinaController';

const router = express.Router();
const disciplinaController = new DisciplinaController();

router.get('/', disciplinaController.getAll as RequestHandler);
router.get('/:id', disciplinaController.getById as RequestHandler);
router.post('/', disciplinaController.create as RequestHandler);
router.put('/:id', disciplinaController.update as RequestHandler);
router.patch('/:id/desativar', disciplinaController.desativar as RequestHandler);
router.patch('/:id/reativar', disciplinaController.reativar as RequestHandler);

export default router;