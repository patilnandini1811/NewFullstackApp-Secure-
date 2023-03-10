import express from 'express';
import * as url from 'url';
import * as dotenv from 'dotenv';

import usersRoutes from './routes/users.js';
import channelsRoutes from './routes/channels.js';
import messagesRoutes from './routes/messages.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT;
const JWT_KEY = process.env.JWT_KEY;
const staticPath = url.fileURLToPath(new URL('../static', import.meta.url))

const logger = (req, res, next) => {
  console.log(`${req.method}  ${req.url}`, req.body)
  next()
}

app.use(express.static(staticPath))
app.use(express.json())
app.use(logger)
app.use('/api/users', usersRoutes)
app.use('/api/messages', messagesRoutes);
app.use('/api/channels', channelsRoutes);



app.listen(PORT, () => {
  console.log(`Server is lising on port ${PORT}`);
});

export default app

