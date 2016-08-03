var express = require("express");
var router = express.Router();
var Note = require("../models/note");

//code goes here
// API LANDING RESPONSE
router.get("/", function(request, response, next){
  Note.find(function(err, notes){
    if(err){
      err.status = 404;
      next(err, response, request);
    }else{
      response.json({api: "Welcome to BaseNote API access!"});
    }
  });
});

// Create
router.post("/notes", function(request, response){
  var params = request.body;
  console.log(params);
  var note = new Note();
  note.title = params.title;
  note.body = params.body;
  //optional params check 
  if (params.user_id){
    note.user_id = params.user_id;
  }
  if(params.basenote_id){
    note.basenote_id = params.basenote_id;
  }
  if(params.company_id){
    note.company_id = params.company_id;
  }
  if(params.contact_id){
    note.contact_id = params.contact_id;
  }

  note.save(function(err, note){
    if(err){
      console.log("oops, something went wrong");
      console.log(err);
    }else{
      console.log("note created!");
      response.json({ message: 'Note created!' });
    }
  });
});

//get all notes
router.get("/notes", function(request, response, next){
  Note.find(function(err, notes){
    if(err){
      err.status = 404;
      next(err, response, request);
    }else{
      response.json({notes: notes});
    }
  });
});

//get a single note
router.get("/notes/:note_id", function(request, response, next){
  Note.findOne({_id: request.params.note_id}, function(err, note){
    if(err){
      err.status = 404;
      next(err, request, response)
    } else {
      response.json({note: note});
    }
  });
});

//Update/edit
router.patch("/notes/:note_id", function(request, response){
  Note.findOne({_id: request.params.note_id}, function(err, note){
    var params = request.body
    if(err) {
      response.render('error', {message: "Note not found",
                           error: {status: 404}});
    } else {
      note.title = params.title;
      note.body  = params.body;
      note.save(function(err, note){
        if(err) {
          response.json({errors: err, note: note });
        } else {
          response.json({success: "Note updated!", note: note});
        }
      });
    }
  });
});
//Delete
router.delete("/notes/:note_id", function(request, response){
  Note.remove({_id:request.params.note_id}, function(err, note){
    if(err){
      response.json({errors: err.errors, note: note});
    } else {
      response.json({success: "Note successfully deleted!"});
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
            response.render("notes/new", {errors: err.errors, reply_note: noteParams});
          }else{
            response.redirect("/notes/" + basenote._id);
          }
        });
     }
  }); 
});

module.exports = router;
