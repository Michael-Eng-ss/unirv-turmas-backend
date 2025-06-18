import express, { RequestHandler } from 'express';
import { TurmaController } from '../controllers/TurmaController';

const router = express.Router();
const turmaController = new TurmaController();

router.get('/', turmaController.getAll as RequestHandler);
router.get('/inativos', turmaController.getInativos as RequestHandler);
router.get('/:id', turmaController.getById as RequestHandler);
router.post('/', turmaController.create as RequestHandler);
router.put('/:id', turmaController.update as RequestHandler);
router.patch('/:id/desativar', turmaController.desativar as RequestHandler);
router.patch('/:id/reativar', turmaController.reativar as RequestHandler);
router.post('/:turmaId/alunos/:alunoId', turmaController.adicionarAluno as RequestHandler);
router.delete('/:turmaId/alunos/:alunoId', turmaController.removerAluno as RequestHandler);

export default router;