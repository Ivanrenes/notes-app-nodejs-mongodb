const express = require('express');
const path = require('path');
const expresshbs = require('express-handlebars')
const methodOverride = require('method-override');
const session = require('express-session');

//Initializations
const app = express();

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expresshbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs'
}));

app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secretico',
    resave: 'true',
    saveUninitialized: 'true'
}))
//Globals Variables


//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Static Files



//Server is listening
app.listen(app.get('port'), () => {
    console.log('Server on port : ', app.get('port'))
})