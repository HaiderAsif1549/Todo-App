import express from 'express';
import todosrouter from './routers/todosRoute.js';
import { json } from 'express';
const app = express();
const port = 4000;
import cors from 'cors';
app.use(cors())

//routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/todos',todosrouter);
app.get('/', (req, res) => {
  res.send('Hello World');
});



//listening
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});