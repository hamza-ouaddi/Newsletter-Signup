const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
require("dotenv").config();
console.log(process.env.PORT);

const app = express();
const port = process.env.PORT;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//get css file
app.get("/styles.css", function(req,res){
  res.sendFile(__dirname + "/public/css/styles.css")
})

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = process.env.API_URL;
  const options = {
    method: "POST",
    auth: process.env.API_AUTH,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

//to try again after the failure
app.post("/failure.html", function (req, res) {
  res.redirect("/");
});

app.listen(port, function () {
  console.log("The server is running on the port", port);
});
