const express = require("express");
const bodyParser = require("body-parser");
const server = express();
const port = process.env.PORT || 8080;
const request = require("request");
const cheerio = require("cheerio");
const firebase = require("firebase");
const app = firebase.initializeApp({
  apiKey: "AIzaSyD7WLkLLZWE-1bMQc5VsDgD4yPsLhdjRo4",
  authDomain: "umstimetable.firebaseapp.com",
  databaseURL: "https://umstimetable.firebaseio.com",
  projectId: "umstimetable",
  storageBucket: "umstimetable.appspot.com",
  messagingSenderId: "7182710153",
  appId: "1:7182710153:web:b3de07ca4c555a6edd1d58",
  measurementId: "G-MPGRS908M4",
});
const firebase_database = firebase.database();
const scheduleLink = [
  "http://bpa.ums.edu.my/kuliah/mindex.html",
  "http://bpa.ums.edu.my/prev_kuliah/mindex.html",
];

//UPDATE DATA.
scheduleLink.forEach((item, index) => {
  request(item, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      $("select > option").each((i, element) => {
        const title = $(element).text();
        const link = $(element).val().replace("html", "xml");
        if (index == 0) {
          firebase_database
            .ref("semester")
            .child("0_subject" + i)
            .set({
              subject: title,
              path: link,
              currentSchedule: new Date().getFullYear(),
              subjectLink: "http://bpa.ums.edu.my/kuliah/",
            });
        }
        if (index == 1) {
          firebase_database
            .ref("semester")
            .child("1_subject" + i)
            .set({
              subject: title,
              path: link,
              currentSchedule: "always updated",
              subjectLink: "http://bpa.ums.edu.my/prev_kuliah/",
            });
        }
      });
    }
  });
});

//SET MIDDLEWARE.
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static("public"));
server.use("/css", express.static(__dirname + "public/css"));
server.use("/js", express.static(__dirname + "public/js"));

//ON REQUEST.
server.use("/", (request, response) => {
  response.render("index.html");
});

//LISTEN TO PORT.
server.listen(port, () => {
  console.log("Server is running.");
});
