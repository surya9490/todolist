const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./todos.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.err(err.message);
  console.log("connection successful");
});

const sql = `INSERT INTO todos(user_name,task,is_checked)
VALUES(?, ?, ?);
`;

db.run(sql, ["kiran", "Learn JavaScript", "true"], (err) => {
  if (err) return console.err(err.message);
  console.log("A new row has been created");
});
db.close((err) => {
  if (err) return console.error(err.message);
});
