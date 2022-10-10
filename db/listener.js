const app = require("./app");

app.listen(9091, (err) => {
  if (err) console.log(err);
  else console.log("server is listening on port 9091");
});
