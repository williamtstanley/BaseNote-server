var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

const EMAILREGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ 

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  role: String,
  email: {
    type: String, 
    validate: {
    validator: function(v) {
      return EMAILREGEX.test(v);
      },
      message: '{VALUE} is not a valid email address!'
    },
    required: [true, 'Email address is required!']
  },
  password: String
});

UserSchema.methods.fullName = function() {
  return this.firstName + " " + this.lastName;
}

var options = {
  usernameField: 'email'
}

UserSchema.plugin(passportLocalMongoose, options);

var User = mongoose.model("User", UserSchema);

module.exports = User;
