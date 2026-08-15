const router = require('express').Router();
const {getBlog, createBlog, deleteBlog, updateBlog, updateLikes, updateShareCount} = require('../controller/blogController');
const multerUpload = require('../config/multerConfig');
const authenticator = require('../middleware/authenticator');

router.get('/', getBlog);
router.patch('/:id', authenticator,  multerUpload.single('image'), updateBlog);
router.patch('/updateLikes/:id',updateLikes);
router.patch('/:id/updateShareCount', updateShareCount)
router.post('/', authenticator,  multerUpload.single('image'), createBlog);
router.delete('/:id',authenticator, deleteBlog);


module.exports = router;