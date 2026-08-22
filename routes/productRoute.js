const router = require('express').Router();
const {getProduct, createProduct, deleteProduct, updateProduct} = require('../controller/productController');
const multerUpload = require('../config/multerConfig');
const authenticator = require('../middleware/authenticator');

router.get('/', getProduct);
router.patch('/:id', authenticator,  multerUpload.single('image'), updateProduct);
router.post('/', authenticator,  multerUpload.single('image'), createProduct);
router.delete('/:id',authenticator, deleteProduct);


module.exports = router;