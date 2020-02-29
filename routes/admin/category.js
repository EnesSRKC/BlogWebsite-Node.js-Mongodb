const express = require('express');
const Category = require('../../models/category')
const router = express.Router();

router.get('/', (req, res) => {
    Category.find({}).sort({ $natural: -1 }).then(categories => {
        res.render('admin/category', { categories: categories });
    });
});

router.post('/Add', (req, res) => {
    Category.create(req.body, (err, category) => {
        if (!err) {
            req.session.sessionFlash = 'Adding successful';
            res.redirect('/Admin/Category');
        }else{
            req.session.sessionFlash = 'Adding failed';
            res.redirect('/Admin/Category');
        }
    });
});

router.delete('/:id', (req, res) => {

    Category.deleteOne({ _id: req.params.id }, (err, cat) => {
        req.session.sessionFlash = 'Deleting successful';
        res.redirect('/Admin/Category');
    });
});

module.exports = router;