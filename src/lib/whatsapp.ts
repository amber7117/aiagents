
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';

// Define a simple in-memory store for sockets to avoid creating multiple instances
const Sockets: { [key: string]: any } = {};

async function connectToWhatsApp(sessionId = 'default', onQR: (qr: string) => void) {
  if (Sockets[sessionId]) {
    return Sockets[sessionId];
  }

  const { state, saveCreds } = await useMultiFileAuthState(path.join(process.cwd(), 'auth_info_baileys', sessionId));
  
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // We'll handle QR code generation ourselves
  });

  Sockets[sessionId] = sock;

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('QR received for session:', sessionId);
      onQR(qr);
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('connection closed for session', sessionId, 'due to', lastDisconnect?.error, ', reconnecting', shouldReconnect);
      delete Sockets[sessionId];
      if (shouldReconnect) {
        connectToWhatsApp(sessionId, onQR);
      }
    } else if (connection === 'open') {
      console.log('opened connection for session:', sessionId);
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    console.log(JSON.stringify(m, undefined, 2));
    // Here you can add logic to handle incoming messages
    // e.g., auto-reply or forward to your application logic
  });

  sock.ev.on('creds.update', saveCreds);

  return sock;
}

export default connectToWhatsApp;
