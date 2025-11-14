
import { WechatyBuilder } from 'wechaty';
import { log } from 'wechaty-plugin-contrib';

const wechaty = WechatyBuilder.build({
  name: 'wechat-assistant',
  puppet: 'wechaty-puppet-wechat',
});

wechaty
  .use(log())
  .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`))
  .on('login',            user => console.log(`User ${user} logged in`))
  .on('message',       message => console.log(`Message: ${message}`))
  .start()
  .catch(console.error);

export default wechaty;
