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
    apiKey: "ac4d98625a8e9ff2ea358066744f8767-us6",
    server: "us6"
  });

  const run = async () => {
    const response = await client.lists.batchListMembers(listId, data).then(responses => {
      console.log(responses);
      if (responses.id !== "" && response.erroe_count === 0) {
        res.sendFile(__dirname + "/success.html");
      }

    }).catch(err => {
      res.sendFile(__dirname + "/failure.html");
      console.log('Error');
    });

  };
  run();

});

// MailChimp API Key: ac4d98625a8e9ff2ea358066744f8767-us6
// list id: 4ed65722c6

// for failure try again button to go back to homepage
app.post("/failure", function(req, res) {
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000");
});
