var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");


router.get("/campgrounds/:id/comments/new", isLoggedIn ,function(req, res){
    Campground.findById(req.params.id)
    .then(function(campground){
        res.render("comments/new", {campground: campground});
    })
    .catch(function(err){
        console.log(err);
    });
});

router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req.params.id)
    .then(function(campground){
        Comment.create(req.body.comment)
        .then(function(comment){
            // Give the comment info about the author
            comment.author.id= req.user._id;
            comment.author.username= req.user.username;
            comment.save();
            campground.comments.push(comment);
            campground.save();
            res.redirect("/campgrounds/" + campground._id);
        })
        .catch(function(err){
            console.log(err);
        });
    })
    .catch(function(err){
        console.log(err);
    });
});

//============================
// For editing and updating the comments
router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
    
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
         res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
       }
    });
});
 
router.put("/campgrounds/:id/comments/:comment_id",checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id );
       }
    });
});
 
router.delete("/campgrounds/:id/comments/:comment_id",checkCommentOwnership, function(req, res){
     //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else{
                  // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else{
                   res.redirect("back");
                }
            }
            });
        } else {
           res.redirect("back");
    }
}

module.exports= router;