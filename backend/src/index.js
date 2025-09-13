import express from 'express';
import '@dotenvx/dotenvx/config';
import route from './routes/tareasRoute.js';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(route);



app.get('/', (req, res) => {
  res.status(201).send({msg: 'Hello, World!'});
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
