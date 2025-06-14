const express = require('express');
const router = express.Router();
const triagemController = require('../controllers/triagemController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', triagemController.criar);
router.get('/', triagemController.listar);
router.get('/:id', triagemController.obter);
router.put('/:id', triagemController.atualizar);
router.delete('/:id', triagemController.deletar);

module.exports = router;