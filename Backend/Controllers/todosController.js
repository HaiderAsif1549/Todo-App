import {connectDB} from "../Config/db.js";

const getTodos = async (req, res) => {
    try {
      const db = await connectDB();
      const query = 'SELECT * FROM Todos';

      const result = await db.query(query);
      
      if (!result || result.length === 0) {
        return res.status(404).json({ error: "No todos found" });
      }
  
      res.json(result); 
    } catch (err) {
      console.error('Error retrieving todos:', err.message);
      res.status(500).json({ error: err.message, odbcErrors: err.odbcErrors });
    }
  };
  
  
const createTodos = async (req,res) => {
    const db = await connectDB();
    const {Title,Description,Status} = req.body;
    const query = 'INSERT INTO Todos (Title,Description,Status) VALUES (?,?,?)';
    const values = [Title,Description,Status];
    const request = db.query(query,values,(err,result) => {
        if(err){
            res.send(err);
        }
        else{
            res.send("Todo Created");
        }
    });
}
const updateTodoStatus = async (req,res) => {
    const db = await connectDB()
    const { TodoID, Status } = req.body;
    const query= 'UPDATE Todos SET Status = ? WHERE TodoID = ?'; 
    const values = [Status,TodoID];
    const request = db.query(query,values,(err,result) => {
        if(err){
            res.send(err);
        }
        else{
            res.send("Todo Status Updated");
        }
    })
}
const deleteTodo = async (req,res) => {
    const db = await connectDB();
    const {TodoID} = req.body;
    const query = 'DELETE FROM Todos WHERE TodoID = ?';
    const value = [TodoID];
    const request = db.query(query,value,(err,result) => {
        if(err){
            res.send(err);
        }
        else{
            res.send("Todo Deleted");
        }
    });
}
const updateTodoDetails = async (req, res) => {
    const db = await connectDB();
    const { TodoID, Title, Description } = req.body;
    
    // Validate the input data
    if (!TodoID || !Title || !Description) {
      return res.status(400).json({ error: "TodoID, Title, and Description are required" });
    }
  
    const query = 'UPDATE Todos SET Title = ?, Description = ? WHERE TodoID = ?';
    const values = [Title, Description, TodoID];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error updating todo:', err.message);
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json({ message: 'Todo details updated successfully' });
    });
  };
  
export {createTodos,updateTodoStatus,deleteTodo,getTodos,updateTodoDetails};