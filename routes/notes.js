var express = require("express");
var router = express.Router();
var Note = require("../models/note");

//code goes here
// Index
router.get("/", function(request, response, next){
  Note.find(function(err, notes){
    if(err){
      err.status = 404;
      next(err, response, request);
    }else{
      response.render("notes/index", {notes: notes, user: request.user});
    }
  });
});

// New
router.get("/new", function(request, response){
  response.render("notes/new", {errors: {}, note:{}, user: request.user} );
});

// Create
router.post("/", function(request, response){
  debugger
  var params = request.body;
  var note = new Note({title: params.title, body: params.body, user_id: request.user.id});
  note.save(function(err, note){
    if(err){
      console.log(err);
      response.render("notes/new", {errors: err.errors, note: params, user: request.user});
    }else{
      response.redirect("/notes/" + note._id);
    }
  });
});

//Show
router.get("/:id", function(request, response, next){
  Note.findOne({_id: request.params.id}, function(err, note){
    if(err){
      err.status = 404;
      next(err, request, response)
    } else {
      response.render("notes/show", {note: note, user: request.user});
    }
  });
});

//Edit Page
router.get("/:id/edit", function(request, response){
  Note.findOne({_id: request.params.id}, function(err, note){
    if(err) {
      response.render('error', {message: "Note not found",
                           error: {status: 404}});
    } else {
      response.render("notes/edit", {note: note, user: request.user,  errors: {}});
    }
  });
});
//Update
router.patch("/:id", function(request, response){
  Note.findOne({_id: request.params.id}, function(err, note){
    var params = request.body
    if(err) {
      response.render('error', {message: "Note not found",
                           error: {status: 404}});
    } else {
      note.title = params.title;
      note.body  = params.body;
      note.save(function(err, note){
        if(err) {
          response.render("notes/edit", {errors: err.errors, user: request.user, note: note});
        } else {
          response.redirect("/notes/" + note._id);
        }
      });
    }
  });
});
//Delete
router.delete("/:id", function(request, response){
  Note.remove({_id:request.params.id}, function(err, note){
    if(err){
      response.render("notes/" + note.id, {errors: err.errors, user: request.user, note: note});
    } else {
      response.redirect("/notes");
    }
  });
});

//Add Comment
router.post("/:id/add_reply", function(request, response){
  var noteParams = request.body
  Note.findOne({_id: request.params.id}, function(err, basenote){
    if(err) {
      response.render('error', {message: "Note not found",
                           error: {status: 404}});
    } else {
        var note = new Note({title: "Reply to " + basenote.title, body: noteParams.body, basenote_id: basenote._id});
        note.save(function(err, note){
          if(err){
            console.log(err);
            response.render("notes/new", {errors: err.errors, user: request.user, reply_note: noteParams});
          }else{
            response.redirect("/notes/" + basenote._id);
          }
        });
     }
  }); 
});

module.exports = router;
