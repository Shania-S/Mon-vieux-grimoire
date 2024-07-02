const express = require('express');
const auth = require('../middleware/auth');
//le mettre apres auth parce qu'il faut qu'il finisse son travail en amont
//recup token d'identification, les info dedans et verifier le tout
const multer = require('../middleware/multer-config');
const router = express.Router();

const bookController = require('../controllers/book');

router.get('/bestrating', bookController.getThreeBestBooks);
router.post('/', auth, multer, bookController.addBook);
router.put('/:id', auth, multer, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);
router.get('/:id', bookController.getOneBook);
router.get('/', bookController.getAllBooks);
router.post('/:id/rating', auth, bookController.rateBook);

module.exports = router;
