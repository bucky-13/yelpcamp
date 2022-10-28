
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.SECRET)

//******LIST OF CONST -> REQUIRE */
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError');
const passport = require('passport');
const localPassport = require('passport-local');
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const MongoStore = require('connect-mongo');

// const dbUrl = process.env.DB_URL
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelpcamp';

//***********MONGOOSE AND DATABASE SETUP */

// mongoose.connect('mongodb://localhost:27017/yelpcamp');
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});


app.engine('ejs', ejsMate)
//**************APP SET */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(mongoSanitize({
    replaceWith: '_'
}));

const secret = process.env.SECRET = 'evilsatanicbeaverritual'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }


});

store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e)
})

//******APP USE AND SETUP FOR EXPRESS-SESSION */
const sessionConfig = {
    store,
    name: 'tiyccilyd',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dpxheiyaz/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://images.bonnier.cloud/",
                "https://www.nar-och-vart.se/site/images/"

            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(session(sessionConfig))

app.use(passport.initialize());
//*******IMPORTANT! app.use(passport.session()); MUST BE USED AFTER  app.use(session(sessionConfig))*/
app.use(passport.session());
passport.use(new localPassport(User.authenticate()));
//*********IMPORTANT!passport.serializeUser should be between passport.use(new localPassport(User.authenticate())); & pp.use((req, res, next) => { res.locals.currentUser = req.user;

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//*********MIDDLEWARE FOR FLASH MESSAGES */
app.use(flash());

// app.use(helmet({ contentSecurityPolicy: false }));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//****************MIDDLEWARE ACTIVATION, APP USE */


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));





app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use(express.static(path.join(__dirname, 'public')));


//***************SETUP FOR MAIN PAGE  */
app.get('/', (req, res) => {
    res.render('home')
})

//*********************ERROR HANDLING************************** */

///********404 catcher */
app.all('*', (req, res, next) => {
    next(new ExpressError(404, '404 Page not found'))
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = `You're lost in the wilderness. You're not entirely sure what went wrong...`
    res.status(statusCode).render('error', { err });
})


//***************   LISTENING TO THE PORT. AKA MAKE SURE THE PAGE IS RUNNING */
app.listen(3000, () => {
    console.log('Serving on port 3000')
})