"use strict";
const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");

const app = express();

// View engine setup
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//Static folder

app.use("/public", express.static(path.join(__dirname, "public")));

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/portfolio", (req, res) => {
    res.render("portfolio");
});

app.post("/send", (req, res) => {
    const output = `
    <p>YOU HAVE A NEW CONTACT REQUEST</p>
    <h3>CONTACT DETAILS</h3>
    <ul>
    <li>Name: ${req.body.name}
    <li>Company: ${req.body.company}
    <li>Email: ${req.body.email}
    <li>Phone: ${req.body.phone}
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "vivianne76@ethereal.email", // generated ethereal user
            pass: "nsHQgmJUQD8bBxHGAC" // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let message = {
        from: '"Nodemailer Contact" <vivianne76@ethereal.email>', // sender address
        to: "hkennedyvi@gmail.com", // list of receivers
        subject: "Node Contact Request", // Subject line
        text: "Hello world?", // plain text body
        html: output // html body
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log("Error occured. " + err.message);
            res.sendStatus(500);
            return process.exit(1);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    })

    res.render("contact", { msg: `Thank you ${req.body.name}, your message has been sent` });
});

app.listen(3000, () => console.log("server started..."));

