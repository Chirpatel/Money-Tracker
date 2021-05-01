const express = require("express");
const connectDB = require("./config/db");
const app = express();

connectDB();
app.use(express.json({ extend: false }));

app.get("/", function(req, res, next) {
  res.json({ message: "alive" });
});

/*Crypto Price API */
app.use("/api/crypto", require("./routes/cryptoAPI"));

/*Crypto data */
app.use("/data/crypto", require("./routes/cryptoDatabase"));


app.set('port', process.env.PORT || 3000);
console.log("Express server listening on port " + app.get('port'));
app.listen(app.get('port'));


module.exports = app;
