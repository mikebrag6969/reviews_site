const express = require('express')
const https = require('https')
const path = require('path')
const fs = require('fs')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");



const app = express()
 
 

 
 
mongoose
  .connect(
    "mongodb+srv://michaelbraginsky:" +
      "gggttty1" +
      "@cluster0.yxqe5.mongodb.net/products?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
console.log("abab", express.static(path.join("images")))
app.use("/images", express.static(path.join("images")));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   );
//   next();
// });
// app.get('/test', function(req, res) {
//   res.write('hello');
//   res.end();
// });
console.log("wowowowo")

app.use("/api/reviews", reviewsRoutes);
app.use("/api/user", userRoutes);

 

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'ec_key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
  },
  app
)

sslServer.listen(3443, () => console.log('Secure server 🚀🔑 on port 3443'))