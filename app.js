var express=require("express");
var app=express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var Comment = require("./models/comment");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var passport = require("passport");
var passportlocalmongoose = require("passport-local-mongoose");
var LocalStrategy = require("passport-local");
var expressSession = require("express-session");
var methodOverride = require("method-override");
var User = require("./models/user");
mongoose.connect("mongodb://localhost/Yelp_camp",{ useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false});
//****************************************************************************************************************** */

app.use(methodOverride("_method"));
app.use(expressSession({
    secret:"Meddy meddy everywhere",
    saveUninitialized: false,
    resave: false
}))
app.use(express.static(__dirname + '\public'));
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
//seedDB(); //seed the database

//****************************************************************************************************************** */

app.get('/register',function(req,res){
    res.render("register.ejs");
});

app.post('/register',function(req,res){
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register.ejs");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect('/campgrounds');
            })
        }
    });
});

app.get('/login',function(req,res){
    res.render("login.ejs");
});

app.post('/login',passport.authenticate("local",{
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}),function(req,res){

});

app.get('/logout',function(req,res){
    req.logOut();
    res.redirect('/campgrounds');
})

app.get('/',function(req,res){
    res.render("landing.ejs");
});

app.get('/campgrounds',function(req,res){
    Campground.find({},function(err,cg){
        if(err){
            console.log("Error!");
        }
        else{
            res.render("campgrounds/campgrounds.ejs",{campgrounds:cg});
        }
    });
});

app.post('/campgrounds', isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var obj={title: name,image: image,desc: desc,author: author};
    Campground.create(obj,function(err,cg){
        if(err){
            console.log("Error!!");
        }
        else{
            console.log("One record entered! (through form)");
            console.log(cg);
        }
    });
    res.redirect('/campgrounds');
})

app.get('/campgrounds/new', isLoggedIn,function(req,res){
    res.render("campgrounds/newcg.ejs"); 
});

app.get('/campgrounds/:id',function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,ncg){
        if(err){
            console.log("Error!");
        }
        else{
            res.render("campgrounds/show.ejs",{campground:ncg});
        }
    })
});

app.get('/campgrounds/:id/edit', checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id,function(err,foundcg){
        if(err){
            res.redirect('/campgrounds');
        }
        else{
            res.render("campgrounds/edit.ejs",{campground:foundcg});
        }
    })
})

app.put('/campgrounds/:id', checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.cg,function(err,updatedcg){
        if(err){
            res.redirect('/campgrounds');
        }
        else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    })
})

app.delete('/campgrounds/:id', checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndDelete(req.params.id,function(err){
        res.redirect('/campgrounds');
    })
})

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            res.render("comments/newcmnt.ejs",{campground:campground});
        }
    })
});

app.post('/campgrounds/:id/comments', isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,cg){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment,function(err,ncm){
                if(err){
                    console.log(err);
                    res.redirect('/campgrounds');
                } else {
                    ncm.author.id = req.user._id;
                    ncm.author.username = req.user.username;
                    ncm.save();
                    cg.comments.push(ncm);
                    cg.save();
                    res.redirect('/campgrounds/' + cg._id);
                }
            })
        }
    })
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/login');
    }
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.send("You are not authorized.");
                }
            }
        })
    } else {
        res.redirect('/login');
    }
}

app.listen(3000,function(req,res){
    console.log("YelpCamp server has started!");
});