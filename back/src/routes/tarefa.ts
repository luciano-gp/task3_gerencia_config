import { Router } from 'express';
import { atualizarHandler, buscarHandler, criarHandler, deletarHandler, editarHandler, listarHandler, relatorioHandler } from '../handlers/tarefa';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/tarefas/:id', auth, buscarHandler);
router.get('/tarefas', auth, listarHandler);
router.post('/tarefas', auth, criarHandler);
router.put('/tarefas/:id', auth, editarHandler);
router.patch('/tarefas/:id', auth, atualizarHandler);
router.delete('/tarefas/:id', auth, deletarHandler);
router.get('/tarefas/relatorio/pdf', auth, relatorioHandler);

export default router;
