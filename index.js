const express = require("express");
const connectDB = require("./config/db");
const app = express();
const cors = require("cors")
connectDB();

const corsOptionsDelegate = (req, callback) => {
  callback(null, { origin: true })
}

app.use(cors(corsOptionsDelegate));

app.use(express.json({ extend: false }));
app.get("/", function(req, res, next) {
  res.json({ message: "alive" });
});

/*Crypto Price API */
app.use("/api/crypto", require("./routes/cryptoAPI"));

/*Crypto data */
app.use("/data/crypto", require("./routes/cryptoDatabase"));


// app.set('port', process.env.PORT || 3001);
// console.log("Express server listening on port " + app.get('port'));
// app.listen(app.get('port'));


module.exports = app;
