const express = require("express");

// server creation

const app = express();
const port = "8080";

app.listen(port, function () {
  console.log(`app is listening to port no ${port}`);
});
let obj = {
  name: "prince",
};

app.get("/user", (req, res) => [res.send(obj)]);
app.get("/home", (req, res) => [
  res.sendFile("./views/index.html", { root: __dirname }),
]);
let user = {};

app.get("/", (request, response) => {
  // console.log(request.hostname);
  // console.log(request.path);
  // console.log(request.method);

  response.send("<h1>Hello</h1>");
  response.end();
});

app.get("/user", (req, res) => {
  res.json(user);
});

//post
app.post("/user", (req, res) => {
  user = req.body;
  // console.log(user);
  res.send("data has been uploaded succesfullly");
});

app.patch("/user", (req, res) => {
  let obj = req.body;
  for (let key in obj) {
    user[key] = obj[key];
  }
  res.json(user);
});

// param route
app.get('/user/:id', (req, res) => {
  // console.log(req.params);
  // res.send(req.params)
  res.send(req.params.id)
})