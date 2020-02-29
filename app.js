const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();
const port = process.env.PORT || 3000;
const hostname = 'https://heroku-blogsite.herokuapp.com';

mongoose.connect('mongodb://127.0.0.1/nodeblog_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));


app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use(express.static('public'));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.use((req, res, next) => {
  const { user_id } = req.session;
  if (user_id) {
    res.locals = {
      displayLink: true
    }
  } else {
    res.locals = {
      displayLink: false
    }
  }
  next();
});

app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

/*  HELPERS   */
const {generateDate, truncate, paginate} = require('./helpers/hbs')

const hbs = exphbs.create({
  helpers: {
    generateDate: generateDate,
    truncate: truncate,
    paginate: paginate
  }
})


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


const main = require('./routes/main');
const posts = require('./routes/posts');
const users = require('./routes/users');
const admin = require('./routes/admin/index');
app.use('/', main);
app.use('/post', posts);
app.use('/user', users);
app.use('/admin', admin);




app.listen(port, hostname, () => console.log(`Example app listening on this url http://${hostname}:${port}`));
