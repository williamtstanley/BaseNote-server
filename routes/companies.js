var express = require("express");
var router = express.Router();
var Company = require("../models/company");

//code goes here
// Index
router.get("/", function(request, response, next){
  Company.find(function(err, companies){
    if(err){
      err.status = 404;
      next(err, response, request);
    }else{
      response.render("companies/index", {companies: companies, user: request.user});
    }
  });
});

// New
router.get("/new", function(request, response){
  response.render("companies/new", {errors: {}, company:{}, user: request.user} );
});

// Create
router.post("/", function(request, response){
  var params = request.body;
  var company = new Company({name: params.name, address: params.address, phone: params.phone, fax: params.fax, url: params.url});
  company.save(function(err, company){
    if(err){
      console.log(err);
      response.render("companies/new", {errors: err.errors, company: params, user: request.user});
    }else{
      response.redirect("/companies/" + company._id);
    }
  });
});

//Show
router.get("/:id", function(request, response, next){
  Company.findOne({_id: request.params.id}, function(err, company){
    if(err){
      err.status = 404;
      next(err, request, response)
    } else {
      response.render("companies/show", {company: company, user: request.user});
    }
  });
});

//Edit Page
router.get("/:id/edit", function(request, response){
  Company.findOne({_id: request.params.id}, function(err, company){
    if(err) {
      response.render('error', {message: "Company not found",
                           error: {status: 404}});
    } else {
      response.render("companies/edit", {company: company, user: request.user,  errors: {}});
    }
  });
});

//Update
router.patch("/:id", function(request, response){
  Company.findOne({_id: request.params.id}, function(err, company){
    var params = request.body
    if(err) {
      response.render('error', {message: "Company not found",
                           error: {status: 404}});
    } else {
      company.name = params.name;
      company.address  = params.address;
      company.phone  = params.phone;
      company.fax  = params.fax;
      company.url  = params.url;
      company.save(function(err, company){
        if(err) {
          response.render("companies/edit", {errors: err.errors, user: request.user, company: company});
        } else {
          response.redirect("/companies/" + company._id);
        }
      });
    }
  });
});

//Delete
router.delete("/:id", function(request, response){
  Company.remove({_id:request.params.id}, function(err, company){
    if(err){
      response.render("companies/" + company.id, {errors: err.errors, user: request.user, company: company});
    } else {
      response.redirect("/companies");
    }
  });
});

//Add Contact
router.post("/:id/add_contact", function(request, response, next){
  var contactParams = request.body
  Company.findOne({_id: request.params.id}, function(err, company){
    if(err) {
      response.render('error', {message: "Company not found",
                           error: {status: 404}});
    } else {
      company.contacts.push({name: contactParams.name, position: contactParams.position, workPhone: contactParams.workPhone, cellPhone: contactParams.cellPhone, email: contactParams.email })
      company.save(function(err){
        if (err){
            err.status = 404;
            next(err, request, response);
        } else {
          console.log("Contact Success!")
          response.redirect("/companies/" + company._id);
        }
      });
    }
  }); 
});


module.exports = router;
