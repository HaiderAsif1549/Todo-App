import { createTodos,deleteTodo,getTodos,updateTodoDetails,updateTodoStatus } from "../Controllers/todosController.js";
import { Router } from "express";
const todosrouter = Router();
todosrouter.post('/create',createTodos);
todosrouter.post('/update',updateTodoStatus);
todosrouter.post('/delete',deleteTodo);
todosrouter.get('/get',getTodos);
todosrouter.put('/updatedetails',updateTodoDetails)
export default todosrouter;