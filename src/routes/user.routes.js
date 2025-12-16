const express = require('express');
const router = express.Router();
const { upload } = require('../utils/multer');

const controller = require('../controllers/user.controller');

router.get('/', controller.findAll);
router.post('/', upload.single('image'), controller.create);
router.put('/:id', upload.single('image'), controller.update);
router.delete('/:id', controller.delete);

module.exports = router;