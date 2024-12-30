import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import ordersRouter from './src/modules/orders/orders.routes.js';
import pairsRouter from './src/modules/pairs/pairs.routes.js';
import { config } from './src/utils/config.js';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

export const server = createServer(app);

export const io = new Server(server, {
  cors: {
    methods: ['GET', 'POST'],
    origin: config.apiUrl,
  },
});

server.listen(3333, () => {
  console.log('Socket server is running');
});

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    console.log('Received from client:', data);

    socket.emit('message', 'Hello from the server!');
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected!');
  });
});

app.use('/orders', ordersRouter);
app.use('/pairs', pairsRouter);

app.use((req, res) => {
  res.status(404).send({ message: '404 route not found.', status: 'failed' });
});

export default app;
