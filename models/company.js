var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

const EMAILREGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ 

var Contacts = new Schema({
  name: String,
  workPhone: String,
  cellPhone: String,
  email: {
    type: String, 
    validate: {
    validator: function(v) {
      return EMAILREGEX.test(v);
      },
      message: '{VALUE} is not a valid email address!'
    }
  },
})

var CompanySchema   = new Schema({
  name: String,
  address: String,
  phone: String,
  fax: String,
  url: String,
  contacts: [Contacts]
});

module.exports = mongoose.model('Company', CompanySchema);
