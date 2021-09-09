// jshint esversion:8

const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const client = require('@mailchimp/mailchimp_marketing');
const https = require("https");

const app = express();


// to send css and images
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const listId = "4ed65722c6";

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }],
  };

  // updated mailchimp site
  client.setConfig({
    apiKey: "",   // removed API key for protection
    server: ""    // removed so as to aviod misuse
  });

  const run = async () => {
    try{
      const response = await client.lists.batchListMembers(listId, data);
      // console.log(response);
      if(response.error_count===0){
        res.sendFile(__dirname + "/success.html");
      }
      else{
        res.sendFile(__dirname + "/failure.html");
      }
      // console.log("success");
    }
    catch(err){
      res.sendFile(__dirname + "/failure.html");
      // console.log("error");
    }

  };
  run();

});

// for failure try again button to go back to homepage
app.post("/failure", function(req, res) {
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000");
});
