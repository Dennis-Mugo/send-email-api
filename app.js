const express = require("express");
let nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port" + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

// New app using express module

// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

app.get("/", function (req, res) {
  res.json({ message: "Welcome to this API" });
});

app.post("/sendmail", function (req, res) {
  //   console.log(req.body);
  let subject = req.body.subject;
  let to = req.body.to;
  let text = req.body.text;
  let from = req.body.from;
  let gpass = req.body.gpass;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: from,
      pass: gpass,
    },
  });

  var mailOptions = {
    from,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json({ error });
    } else {
      console.log("Email sent: " + info.response);
      res.json({ success: true });
    }
  });
});

app.post("/sendmail/random_number/:codeLength", function (req, res) {
  let codeLength = Number(req.params.codeLength);
  //   console.log(codeLength);
  if (codeLength < 3) {
    res.json({ error: "codeLength must be greater than 2" });
  }
  let randomCode = "";
  for (let i = 0; i < codeLength; i++) {
    let num = Math.floor(Math.random() * 10);
    randomCode += num.toString();
  }
  let subject = req.body.subject;
  let to = req.body.to;
  let text = req.body.text;
  let from = req.body.from;
  let gpass = req.body.gpass;

  text += "\n\n This is your verification code " + randomCode;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: from,
      pass: gpass,
    },
  });

  var mailOptions = {
    from,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json({ error });
    } else {
      console.log("Email sent: " + info.response);
      res.json({ success: true, randomCode });
    }
  });
});
