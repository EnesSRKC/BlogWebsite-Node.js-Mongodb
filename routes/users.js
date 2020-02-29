const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/register', (req, res) => res.render('security/register'));

router.post('/register', (req, res) => {
    User.create(req.body, (err, user) => {
        res.redirect('/');
    });
});

router.get('/login', (req, res) => res.render('security/login'));

router.post('/login', (req, res) => {
    const {email, password} = req.body;

    User.findOne({email}, (err, user) => {
        if (user) {
            if (user.password == password) {
                req.session.user_id = user._id;
                res.redirect('/')
            } else {
                res.redirect('/user/login');
            }
        } else {
            res.redirect('/user/login')
        }
    })
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
});

module.exports = router;