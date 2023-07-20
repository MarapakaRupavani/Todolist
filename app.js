const express = require("express");
const app = express();
const path = require("path");
let dbPath = path.join(__dirname, "todoApplication.db");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;
const initializeDBandServer = async () => {
  try {
    const db = open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("started");
    });
  } catch (e) {
    console.log("error");
  }
};
const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};
app.get("/todos/", async (request, response) => {
  const { search_q = "", priority, status } = request.query;

  switch (true) {
    case hasPriorityAndStatusProperties(request.query): //if this is true then below query is taken in the code
      getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND status = '${status}'
    AND priority = '${priority}';`;
      break;
    case hasPriorityProperty(request.query):
      getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND priority = '${priority}';`;
      break;
    case hasStatusProperty(request.query):
      getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND status = '${status}';`;
      break;
    default:
      getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%';`;
  }

  data = await db.all(getTodosQuery);
  response.send(data);
});
app.get("/todos/:todoid/", async (request, response) => {
  const { search_q = "", priority="", status=""} = request.query;
  const { todoid } = request.params;
//if this is true then below query is taken in the code
 const getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todoid='${todoid};`;
    const data=await db.all(getTodosQuery);
    response.data(data);
}
app.post("/todos/",async (request,response)=>{
    const getData=request.body;
    const {todo,priority,status}=getData;
    const postQuery=`insert into todo (todo,priority,status) values ('${todo}','${priority}','${status}');`;
    const data=db.run(postQuery);
    response.send(data);
})
app.put("/todos/todoid/",async (request,response)=>{
    const getData=request.body;
    const {todoid}=request.params;
    const {todo,priority,status}=getData;
    const postQuery=`update todos
                    set  todo='${todo}',
                        priority='${priority}',
                        status='${status}') where todoid=${todoid}`;
    const data=await db.run(postQuery);
    response.send("Todo Added Successfull");
})
app.delete("/todos/todoid/",async (request,response)=>{
    const {todoid}=request.params;
    const deleteQuery=`delete todo where todois is ${todoid};`;
    const data=db.run(deleteQuery);
    response.send("Todo Deleting");
}
})
initializeDBandServer();
