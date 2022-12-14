const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");

const databasePath = path.join(__dirname, "todos.db");

const app = express();

app.use(express.json());
app.use(cors());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(process.env.PORT || 3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/todos", async (request, response) => {
  const getTodosList = `
    SELECT 
        *
    FROM 
         todos;`;

  const todoData = await database.all(getTodosList);
  const data = response.send(todoData);
});

///delete api

app.delete("/todos/:id/", async (request, response) => {
  const { id } = request.params;
  const deleteTodosList = `
    DELETE FROM
        todos
    WHERE 
        id = ${id};`;

  const todoData = await database.run(deleteTodosList);
  const data = response.send("delete successfully");
});

/// api post

app.post("/todos/create", async (request, response) => {
  const { userName, task, isChecked } = request.body;
  const postTodosList = `
    INSERT INTO
        todos(user_name,task,is_checked)
    VALUES
        ('${userName}','${task}','${isChecked}');`;

  const todoData = await database.run(postTodosList);
  const data = response.send("todos updated");
});

/// api put

app.put("/todos/:id", async (request, response) => {
  const { userName, task, isChecked } = request.body;
  const { id } = request.params;
  console.log(id);
  const putTodosList = `
    UPDATE 
        todos
    SET
        user_name='${userName}',
        task='${task}',
        is_checked='${isChecked}'
    WHERE   
        id = ${id};`;
  const todoData = await database.run(putTodosList);
  response.send("Updated successfully");
});

module.exports = app;
