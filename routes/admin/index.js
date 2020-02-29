const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('admin/index'));

const Post = require('./post');
const Category = require('./category');
router.use('/post', Post);
router.use('/category', Category);

module.exports = router;