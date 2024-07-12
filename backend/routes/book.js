// définissent les points de terminaison de l'API et la logique de routage
// elles indiquent comment les requêtes http doivent être traitées et quel controller doit etre appelé.
const express = require('express');
const auth = require('../middleware/auth');
//le mettre apres auth parce qu'il faut qu'il finisse son travail en amont
//recup token d'identification, les info dedans et verifier le tout
const multer = require('../middleware/multer-config');
const router = express.Router();

const bookController = require('../controllers/book');

router.get('/bestrating', bookController.getThreeBestBooks);
router.put('/:id', auth, multer, bookController.updateBook);
router.post('/', auth, multer, bookController.addBook); //On garantit également que seuls les utilisateurs authentifiés peuvent accéder aux ressources de l'API
router.delete('/:id', auth, bookController.deleteBook);
router.get('/:id', bookController.getOneBook);
router.get('/', bookController.getAllBooks);
router.post('/:id/rating', auth, bookController.rateBook);

module.exports = router;
