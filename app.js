//jshint esversion: 6

const bodyparser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https")

const app = express();

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){
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
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url ="https://us5.api.mailchimp.com/3.0/lists/cfd33dc508";

    const options = {
        method: "POST",
        auth: "vinita1:edbe5c31a4367348bdc1ce231b78e7e9-us5"
    }


    const request = https.request(url, options, function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname+ "/success.html")
        }else {
            res.sendFile(__dirname+ "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);

    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(3000, function(){
    console.log("Server is running on Port 3000.");
});

// '{"name":"","contact":{"company":"","address1":"","address2":"","city":"","state":"","zip":"","country":"","phone":""},"permission_reminder":"","use_archive_bar":false,"campaign_defaults":{"from_name":"","from_email":"","subject":"","language":""},"notify_on_subscribe":"","notify_on_unsubscribe":"","email_type_option":false,"double_optin":false,"marketing_permissions":false}'
// API Key
// edbe5c31a4367348bdc1ce231b78e7e9-us5

// list ID
// cfd33dc508