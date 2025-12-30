import 'dotenv/config';
import process from 'process';
import { app } from './src/app.js';

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
