const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');

const session = require('express-session');
const {ensureAuthenticated} = require('./helpers/auth');


const app = express();

//Load routes
const entry = require('./routes/entry');
const users = require('./routes/users');


//Passport
require('./config/passport')(passport);


// data base configuration
const db = require('./config/database');

//mongosee promise
mongoose.Promise = global.Promise;
//Connect to Mongoose
mongoose.connect(db.mongoURI , {
    useNewUrlParser: true
}).then(()=>{
    console.log('MongoDB connected..')
}).catch(err => console.log(err));

// Load Schema
require('./models/Diary');
const Diary = mongoose.model('diary');


// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

/* BODY PARSE MIDDLE WARE */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//static folder
app.use(express.static(path.join(__dirname,'public')));

// method overide middleware
app.use(methodOverride('_method'))

//session middle ware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
    
  }));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

  //flash middle ware
  app.use(flash());

  //Globals
  app.use(function (req,res,next){
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      res.locals.user = req.user || null;
      next();

  });

// INDEX ROUTE
app.get('/', (req,res) =>{
    const title = 'Welcome to Daily Journal';
    res.render('index', {
        title: title
    });

});


// ABOUT ROUTE
app.get('/about', (req,res) =>{
    res.render('About');
});







//Entry routes
app.use('/entry', entry);

//User routes
app.use('/users', users);


const port = process.env.port || 5000;



app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})