import { Router } from 'express';
import { cadastroHandler, loginHandler, refreshTokenHandler } from '../handlers/usuario';

const router = Router();

router.post('/usuarios', cadastroHandler);
router.post('/login', loginHandler);
router.post('/refresh-token', refreshTokenHandler);

export default router;
