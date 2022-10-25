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

app.get('/waiters/:username', async (req, res) => {
    const  names  = req.params.username;
    const weekdays = await sendOrGetData.getWeekdays();
    res.render("daysSelection", {
        names,
        weekdays
    })
})

app.post('/waiters/:username', async (req, res) => {
    const names = req.params.username;
    const { days } = req.body;
    // console.log(days)
    // await sendOrGetData.waitersDays(names, days)
    const userDetails = await sendOrGetData.userSelection(names);
    console.log(userDetails)

    res.redirect("/waiters/" + names)
})


const PORT = process.env.PORT || 5050;
app.listen(PORT, (req, res) => {
    console.log("Application Fired On " + PORT + "!")
});