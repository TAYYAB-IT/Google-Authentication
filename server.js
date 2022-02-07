const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./Middlewares/passport');

const app = express();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true ,cookie:{maxAge:60*60*24}}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/greeter',
    failureRedirect: '/auth/google/failure'
  })
);
// 
app.get('/greeter',isLoggedIn, (req, res) => {
 // res.send(`Hello ${req.user.displayName}`); //Name
 //res.send(req.user.emails[0].value) //first Email
 res.send(`<img src=${req.user.picture}></img>`)//Proffile
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
}); 

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.listen(3000, () => console.log('listening on port: 3000'));