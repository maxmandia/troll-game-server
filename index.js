require("dotenv").config();
const express = require("express");
const admin = require("firebase-admin");
const app = express();

var serviceAccount = JSON.parse(process.env.FIREBASE);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/add-point", async (req, res) => {
  const { name } = req.query;

  try {
    let resp = await admin
      .firestore()
      .collection("users")
      .doc(name)
      .update({
        points: admin.firestore.FieldValue.increment(1),
      });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

app.get("/fetch-points", async (req, res) => {
  try {
    let resp = await admin.firestore().collection("users").get();
    let users = {};
    resp.forEach((doc) => {
      users[doc.data().name] = doc.data().points;
    });
    res.send(users);
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});
