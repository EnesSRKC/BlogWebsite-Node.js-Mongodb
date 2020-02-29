const express = require('express');
const path = require('path');
const router = express.Router();
const Posts = require('../models/post');
const Users = require('../models/user');
const Categories = require('../models/category');

router.get('/new', (req, res) => {
    Categories.find({}).then(categories => {
        res.render('posts/addpost', { categories: categories });
    })
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/search", (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Posts.find({ "title": regex }).populate({ path: 'author', model: Users }).sort({ $natural: -1 }).then(posts => {
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
                Posts.find({}).limit(3).then(latest_posts => {
                    res.render('home/blog', { posts: posts, categories: categories, latest_posts: latest_posts })
                })
            })
        });
    }
});

router.get('/:id', (req, res) => {
    Posts.findOne({ _id: req.params.id }).populate({ path: 'author', model: Users }).then(post => {
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
            Posts.find({}).limit(3).then(latest_posts => {
                res.render('posts/post', { post: post, categories: categories, latest_posts: latest_posts });
            });
        });
    })
});

router.get('/category/:id', (req, res) => {
    Posts.find({ category: req.params.id }).populate({ path: 'category', model: Categories }).populate({ path: 'author', model: Users }).then(posts => {
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
            Posts.find({}).limit(3).then(latest_posts => {
                res.render('home/blog', { posts: posts, categories: categories, latest_posts: latest_posts });
            });
        });

    });
});

router.post('/kaydet', (req, res) => {
    let image = req.files.post_image;
    image.mv(path.resolve(__dirname, '../public/img/postImages', image.name));

    Categories.findOne({ name: req.body.category }, (err, doc) => {
        Posts.create({
            ...req.body,
            image: `img/postImages/${image.name}`,
            author: req.session.user_id,
            category: doc._id
        });
    });




    res.redirect('/');
});

module.exports = router;