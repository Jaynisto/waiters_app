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

app.get('/adminLogin',(req,res)=>{
    res.render('adminLogin')
})

// app.post('/adminLogin/:username', async (req,res)=>{
//     const { adminCode } = req.body;
//     const { username } = req.params;
//     console.log("User's Code: ", adminCode)

//     if (adminCode) {
//         //if code is valid
//         const user = await sendOrGetData.adminCodeVerification(adminCode);
//         console.log("User Presesnt: ",user);
//         if (user) {
//             // req.session.admin = user;
//             res.redirect(`days`)
//             return;
//         }
//     }
//     res.render("logIn")


//     res.render('adminLogin')
// })


app.get('/waiters/:username', async (req, res) => {
    const names = req.params.username;
    const weekdays =  await sendOrGetData.keepDaysChecked(names);
    // await sendOrGetData.getWeekdays();
   
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


app.get('/days', async (req, res) => {
    const days = await sendOrGetData.getEnteredWeekdays()
    res.render("admin", { days });
});

app.get('/registration', (req, res) => {
    res.render("signInUser")
})

app.post('/registration', async (req, res) => {
    let { username } = req.body;

    if (username) {
        const code = uniqueId();
        username = username.toLowerCase();
        const checking = await sendOrGetData.checkingExistingUsers(username)
        console.log(" The name ", checking)
        if (checking == 1) {
            req.flash('error', username + ' Already Exists.')
        }
        else {
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


app.post('/login', async (req, res) => {
    const { code } = req.body;
    console.log("User's Code: ", code)

    if (code) {
        //if code is valid
        const user = await sendOrGetData.codeVerification(code);
        if (user) {
            req.session.user = user;
            res.redirect(`waiters/${user.username}`)
            return;
        }
    }
    res.render("logIn")

})



const PORT = process.env.PORT || 5050;
app.listen(PORT, (req, res) => {
    console.log("Application Fired On " + PORT + "!")
});