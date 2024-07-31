const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

const port = 4040;

require('dotenv').config();

const User = require('./models/user')

// Set EJS as the view engine
app.set('view engine', 'ejs')
// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')))

// Connect to the MongoDB database
const dbUrl = process.env.DB_URL
// const dbUrl = 'mongodb://127.0.0.1:27017/signUp_signIn_form'

mongoose.connect(dbUrl);

const db = mongoose.connection;

// Log an error if the connection fails
db.on("error", console.error.bind(console, "CONNECTION ERROR"));
// Log a message once the database is connected
db.once("open", () => {
  console.log("DATABASE CONNECTED");
});

// Parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SESSION_SECRET
    }
});

store.on('error', function(e){
    console.log('SESSION STORE ERROR', e)
  })


// Configure session settings
const sessionConfig = {
    store,
    secret: process.env.SESSION_SECRET, // Secret used to sign the session ID cookie
    resave: false, // Do not save session if unmodified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: {
      httpOnly: true, // Ensure the cookie is sent only over HTTP(S), not client JavaScript
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Set cookie expiration to 7 days
      maxAge: 1000 * 60 * 60 * 24 * 7 // Set max age to 7 days
    }
}

// Use session middleware
app.use(session(sessionConfig))
// Use flash middleware for displaying messages
app.use(flash())

// Middleware to set flash message variables for views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Middleware to require login for certain routes
const requireLogin = (req, res, next) => {
    if(!req.session.user_id) {
        return res.redirect('/signin')
    }
    next();
}

// Home route
app.get('/', (req, res) => {
    res.render('signup');
  });

// Route to render signup page
app.get('/signup', (req, res) => {
    res.render("signup");
})

// Route to handle signup form submission
app.post('/signup', async(req, res) => {
    const { email, password, confirmPassword } = req.body;
    const user = new User({ email, password });
    try {
        // Check if passwords match
        if (password !== confirmPassword) {
          req.flash('error', 'Passwords do not match');
          return res.redirect('/signup');
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          req.flash('error', 'Email already exists');
          return res.redirect("/signup");
        }

        // Save the new user and set the session user ID
        await user.save();
        req.session.user_id = user._id
        res.redirect('/signin')

    } catch (error) {
        req.flash('error', 'Internal Server Error');
        res.redirect('/signup');
    }
})

// Route to render signin page
app.get('/signin', (req, res) => {
    res.render('signin')
})

// Route to handle signin form submission
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validate the user credentials
        const foundUser = await User.findAndValidate(email, password);
        if (foundUser) {
            req.session.user_id = foundUser._id;
            return res.redirect('home');
        } else {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/signin');
        }
    } catch (error) {
        console.error(error);
        req.flash('error', 'Internal Server Error');
        return res.redirect('/signin');
    }
});

// Route to render home page, requiring login
app.get('/home', requireLogin, (req, res) => {
    res.render('home');
})

// Route to handle logout
app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/signin')
})

// Start the server
app.listen(port, () => {
    console.log(`Server listening on localhost:${port}`)
})
