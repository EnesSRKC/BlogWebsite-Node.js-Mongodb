const express = require('express');
const router = express.Router();
const Posts = require('../models/post');
const Users = require('../models/user');
const Categories = require('../models/category');

router.get('/', (req, res) => {
    res.render('home/index');
});

router.get('/blog', (req, res) => {

    const postPerPage = 4;
    const page = req.query.page || 1;

    Posts
    .find({})
    .populate({ path: 'author', model: Users })
    .populate({ path: 'category', model: Categories })
    .sort({ $natural: -1 })
    .skip((page * postPerPage) - postPerPage)
    .limit(postPerPage)
    .then(posts => {
        Posts.countDocuments().then(postCount => {
            Categories.aggregate([
                {
                    $lookup: {
                        from: 'posts',
                        localField: '_id',
                        foreignField: 'category',
                        as: 'posts'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        post_count: { $size: '$posts' }
                    }
                }
            ]).then(categories => {
                Posts.find({}).limit(3).sort({ $natural: -1 }).then(latest_posts => {
                    res.render('home/blog', { 
                        posts: posts, 
                        categories: categories, 
                        latest_posts: latest_posts,
                        current: parseInt(page),
                        pages: Math.ceil(postCount/postPerPage)})
                });
            });
        });
    });
});


router.get('/contact', (req, res) => res.render('home/contact'));
router.get('/about', (req, res) => res.render('home/about'));

module.exports = router;