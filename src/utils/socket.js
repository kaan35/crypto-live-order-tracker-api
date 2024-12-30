import { io } from '../../app.js';

export const sendSocketEvent = (name, data) => {
  io.emit(name, data);
};
