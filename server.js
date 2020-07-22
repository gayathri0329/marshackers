let express = require("express");
let app = express();

app.use(express.static("public/"));
// Open http://localhost:3000/
let server = app.listen(3000, function () {
  app.get(function (req, res) {
    res.sendFile();
  });
});

let port = server.address().port;
console.log(`Express app listening at ${port}`);
