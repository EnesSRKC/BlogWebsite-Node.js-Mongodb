const express = require('express');
const path = require('path');
const Category = require('../../models/category');
const Post = require('../../models/post');
const router = express.Router();

router.get('/', (req, res) => {
    Post.find({}).populate({ path: 'category', model: Category }).then(post => {
        res.render('admin/post', { posts: post });
    });
});

router.get('/edit/:id', (req, res) => {
    Post.findOne({ _id: req.params.id }).populate({ path: 'category', model: Category}).then(post => {
        Category.find({}).then(categories => {
            res.render('admin/edit_post', { post: post, categories: categories });
        });
    });
});

router.put('/:id', (req, res) => {
    let image = req.files.post_image;
    image.mv(path.resolve(__dirname, '../../public/img/postImages', image.name));

    Post.findOne({ _id: req.params.id }).then(post => {
        Category.findOne({ name: req.body.category }).then(category => {
            post.title = req.body.title;
            post.content = req.body.content;
            post.image = `img/postImages/${image.name}`;
            post.category = category._id;

            post.save().then(post => {
                res.redirect('/admin/post');
            });
        });
    });
});

router.delete('/:id', (req, res) => {

    Post.deleteOne({ _id: req.params.id }, (err, post) => {
        req.session.sessionFlash = 'Deleting successful';
        res.redirect('/Admin/post');
    });
});

module.exports = router;