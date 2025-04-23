import * as signalR from '@microsoft/signalr';
import { SOCKET_URL } from './api';

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${SOCKET_URL}/chatHub`, { withCredentials: true })
  .withAutomaticReconnect()
  .build();

const start = async () => {
  try {
    await connection.start();
    console.log('⚡️ SignalR connected');
  } catch (err) {
    console.error('SignalR connection error:', err);
    // you might want to retry here or propagate the error
    throw err;
  }
};

const on = (methodName, callback) => {
  connection.on(methodName, callback);
};

const off = (methodName, callback) => {
  connection.off(methodName, callback);
};

export default {
  start,
  on,
  off,
};
