import 'dotenv/config';
import process from 'process';
import { app } from './src/app.cjs';

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
