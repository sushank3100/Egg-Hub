const express       = require('express'),
      app           = express(),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      User          = require("./models/user.js"),
      Campground    = require("./models/campground.js"),
      Comment       = require("./models/comment.js"),
      Country       = require("./models/countries.js"),
      methodOverride= require("method-override"),
      SeedDB        = require("./seeds.js");

const   indexRoutes       = require("./routes/index"),
        campgroundRoutes  = require("./routes/campgrounds"),
        commentRoutes     = require("./routes/comments");

// SeedDB();
mongoose.connect('mongodb://localhost:27017/eggs', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error.message));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(methodOverride("_method"));

// Passport Configuration
//=================================
app.use(require("express-session")({
    secret: "Used for password hashing",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


// var county= { name: "South Africa",
//   total_population: "5.78 Cr",
//   eggs_produced: "998 Ton",
//   eggs_consumption: "1142 Ton"};
// Country.create(county)
// .then(function(res){
//     console.log(res);
// })
// .catch(function(err){
//     console.log(err);
// });

app.get("/dashboard", function(req,res){
    res.render("dashboard");
});

app.get("/supplymap", function(req,res){
  res.render("supplymap");
});

app.get("/demandmap", function(req,res){
  res.render("demandmap");
});

app.get("/about", function(req,res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/compare", function(req, res){
  res.render("compare");
});

app.get("/compare/ans", function(req,res){
    Country.find({name: req.query.country1})
      .then(function(c1){
        Country.find({name: req.query.country2})
          .then(function(c2){
            res.render("compare_ans", {c1 : c1, c2: c2});
          });
      });
});

app.listen(3000, function(){
    console.log("Connected");
});