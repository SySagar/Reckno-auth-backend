const express = require('express');
const passport = require('passport');
const session = require('express-session')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
require('./GoogleAuth');
require('./GithubAuth');
const up = require('./update')
const ch = require('./check')
const app = express()
require('dotenv').config()
var cors = require('cors')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors({
    origin: '*'
}));

app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [process.env.COOKIE_KEY] // encrypts the cookie in browser
}))

//app.use(session({ secret: "cats", resave: false }));
app.use(passport.initialize());
app.use(passport.session());

const mongoose = require('mongoose');
const User = require('./user');
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_URI,()=>{
    console.log("connected to mongodb");
} , e=> console.error(e));


function isLogged(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a><br/> <a href="/auth/github">Authenticate with Github</a>');
    
})


app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure'
    }))


//github authentication
app.get('/auth/github',
    passport.authenticate('github', { scope: ['user'] }));

app.get('/auth/github/callback',
    passport.authenticate('github', {  
        successRedirect: '/protected',
         failureRedirect: '/auth/failure' 
        }))


    //basic endpoints

    app.get('/auth/failure', (req, res) => {
        res.send("INVALID LOGIN")
    })
    
    app.get('/protected', isLogged, (req, res) => {
        res.send("https://reckno-git-main-sysagar.vercel.app/home/#home");
        // redirect('https://reckno-git-main-sysagar.vercel.app/home/#home')
        //res.send(`${req.user.displayname}`)
    })
    
    app.get('/logout', (req, res) => {
        req.logOut();
        res.send('Goodbye!');
    })

    app.post('/dataset',async (req,res)=>{

        await User.findOne({email: req.email}).then((currentUser)=>{
            if(currentUser)
            {
                
                console.log('user exists');
               console.log(currentUser)
            }

            else
            res.send(404)

    })
})

app.post('/group', async(req,res)=>{

   console.log(req.body.group)
    up.update(req.body.userName , req.body.group , (data)=>{
        res.send(data)
    })

})

app.post('/check',(req,res)=>{
    console.log(req.body.userName)
    ch.check(req.body.userName,(data)=>{
        res.send(data)

    })
})
    

app.listen(3000 || process.env.PORT, () => {
    console.log("listening");
})