import 'dotenv/config';
import express from 'express';
import process from 'process';

const app = express();
app.use(express.json());
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
