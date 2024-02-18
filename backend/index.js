const connectToMongo = require("./db");
connectToMongo();

const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Hello Gaurav! THis is your Express server!");
// });

//call model below
app.use("/api/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log(`mynotex-backend app listening on port ${port}`);
});
