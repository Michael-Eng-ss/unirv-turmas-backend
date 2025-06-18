import express, { RequestHandler } from 'express';
import { AlunoController } from '../controllers/AlunoController';

const router = express.Router();
const alunoController = new AlunoController();


router.get('/', alunoController.getAll as RequestHandler);
router.get('/inativos', alunoController.getInativos as RequestHandler); // <-- ANTES do :id
router.get('/:id', alunoController.getById as RequestHandler);
router.post('/', alunoController.create as RequestHandler);
router.put('/:id', alunoController.update as RequestHandler);
router.patch('/:id/desativar', alunoController.desativar as RequestHandler);
router.patch('/:id/reativar', alunoController.reativar as RequestHandler);

export default router;