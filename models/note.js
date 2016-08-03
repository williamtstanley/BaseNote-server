var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var NoteSchema = new Schema({
  title: {type: String, required: true},
  body: {type: String, required: true},
  rawHtml: String,
  company_id: String,
  contact_id: String,
  basenote_id: String,
  user_id: String,
  completed: {type: Boolean, default: false},
  held_by_id: String,
  created_at: Date,
  updated_at: Date
});
// { type: Date, default: Date.now }
// on every save, add the date
NoteSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// Format the date for display
NoteSchema.methods.formatedDate = function () {
  return this.created_at.toString().replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/,'$2-$1-$3');
}

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;

