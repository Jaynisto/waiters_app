const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const ShortUniqueId = require("short-unique-id");
const db = require("./database/connectionString");
const factoryFunction = require("./database/factoryFunction");


let app = express()
let sendOrGetData = factoryFunction(db);
const uniqueId = new ShortUniqueId({ length: 5 });



//Configuring Handlebars
const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');
app.use(express.static("public"));

//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session
app.use(session({
    secret: 'codeforgeek',
    resave: true,
    saveUninitialized: true
}));

// Flash
app.use(flash());

app.get('/', (req,res)=>{
    res.render("index")
})



app.get('/waiters/:username', async (req, res) => {
    const names = req.params.username;
    const weekdays =  await sendOrGetData.keepDaysChecked(names);  
    res.render("daysSelection", {
        names,
        weekdays
    })
})

app.post('/waiters/:username', async (req, res) => {
    const names = req.params.username;
    const { days } = req.body;
    const userDetails = await sendOrGetData.waitersDays(names, days);
    res.redirect("/waiters/" + names)
})


app.get('/adminLogin', async (req, res) => { 
    const days = await sendOrGetData.getEnteredWeekdays()
    res.render("adminLogin", { 
        days
    });
});

app.post('/adminLogin', async (req, res) => {
    const { adminName } = req.body;
    const { adminPassword } = req.body;
    if(adminName || adminPassword ){
        const name = await sendOrGetData.checkingExistingAdminName(adminName);
        const password = await sendOrGetData.checkingExistingAdminPassword(adminPassword);
        if (name.count == 0) {
            req.flash('error', 'Wrong User Name Entry')
            res.redirect("/adminLogin")
        }
        if (password.count == 0) {
            req.flash('error', 'Wrong Password Entry')
            res.redirect("/adminLogin")
        }
        if(name != 0 || password != 0){
            res.redirect("admin")
            return;
        }
    }
})

app.get('/signInUser', (req, res) => {
    res.render("signInUser")
})

app.post('/signInUser', async (req, res) => {
    let { username } = req.body;

    if (username) {
        const code = uniqueId();
        username = username.toLowerCase();
        const checking = await sendOrGetData.checkingExistingUsers(username)
        if (checking.count != 0) {
            req.flash('error', username + ' Already Exists.')
        }
        if(checking.count == 0){
            await sendOrGetData.storingUserNames(username, code);
            req.flash('success', 'User was Added -- use the provide code to Log in : ' + code);
        }
    }
    else {
        req.flash('error', 'No Username Provided')
    }

    res.render("signInUser")
})

app.get('/login', (req, res) => {
    res.render("logIn")
})

app.get('/admin', async (req,res)=>{
    const days = await sendOrGetData.getEnteredWeekdays();
    const users = await sendOrGetData.viewingUsers();
    console.log(users);
    res.render("admin", {
        days,
        users
    })
})

app.post('/clearingUser', async (req,res)=>{
    const waiter = req.body.waiters;
    const { id } = waiter;
    console.log(waiter);
    const clearing = await sendOrGetData.clearingWaiter(waiter)
    res.redirect("admin",{
        clearing
    })
})


app.post('/login', async (req, res) => {
    const { code } = req.body;
    if(code){
        //if code is valid
        const user = await sendOrGetData.codeVerification(code);
        if(user) {
            req.session.user = user;
            res.redirect(`waiters/${user.username}`)
            return;
        }else{
            res.redirect("/signInUser")
        }
    }
    else{
        res.redirect("/login")
    }

})



const PORT = process.env.PORT || 5050;
app.listen(PORT, (req, res) => {
    console.log("Application Fired On " + PORT + "!")
});