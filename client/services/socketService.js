import * as signalR from '@microsoft/signalr';          // impordime SignalR kliendi
import { SOCKET_URL } from './api';                     // baas-URL päringuteks ja WebSocket’iks

// Loome SignalR-ühenduse ChatHub’i aadressile
const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${SOCKET_URL}/chatHub`, { withCredentials: true }) // lubame küpsiseid (nt auth token)
  .withAutomaticReconnect()                                   // taaskatsetame automaatselt ühendust
  .build();

// Käivitame ühenduse
const start = async () => {
  try {
    await connection.start();
    console.log('⚡️ SignalR connected');  // ühendus õnnestus
  } catch (err) {
    console.error('SignalR connection error:', err); // logime vea
    throw err;                                       // edastame vea edasi
  }
};

// Kuulame serveri poolseid sündmusi
const on = (methodName, callback) => {
  connection.on(methodName, callback); // näiteks: on('ReceiveMessage', msg => …)
};

// Lõpetame sündmuse jälgimise
const off = (methodName, callback) => {
  connection.off(methodName, callback);
};

export default {
  start,  // funktsioon ühenduse avamiseks
  on,     // funktsioon sündmuste registreerimiseks
  off,    // funktsioon sündmuste tühistamiseks
};
