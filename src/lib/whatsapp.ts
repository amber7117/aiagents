
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, '..', '..', '..', 'auth_info_baileys'));
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === 'open') {
      console.log('opened connection');
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    console.log(JSON.stringify(m, undefined, 2));
    console.log('replying to', m.messages[0].key.remoteJid);
    await sock.sendMessage(m.messages[0].key.remoteJid!, { text: 'Hello there!' });
  });

  sock.ev.on('creds.update', saveCreds);

  return sock;
}

export default connectToWhatsApp;
