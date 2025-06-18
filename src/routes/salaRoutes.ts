import express, { RequestHandler } from 'express';
import { SalaController } from '../controllers/SalaController';

const router = express.Router();
const salaController = new SalaController();

router.get('/', salaController.getAll as RequestHandler);
router.get('/inativos', salaController.getInativos as RequestHandler);
router.get('/:id', salaController.getById as RequestHandler);
router.post('/', salaController.create as RequestHandler);
router.put('/:id', salaController.update as RequestHandler);
router.patch('/:id/desativar', salaController.desativar as RequestHandler);
router.patch('/:id/reativar', salaController.reativar as RequestHandler);

export default router;