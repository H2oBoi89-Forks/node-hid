'use strict';

var HID = require('../nodehid.js');

console.log(HID.devices());
console.log();

var devices = HID.devices(0x04d8, 0xfcf0);

console.log('devices:');
console.log(devices);
console.log();

var path = devices[1].path;

console.log('path: ' + path);
console.log();

var i = 0;
var hid = new HID(path);

var write = () => {
   console.log('writing...');
   hid.write([0x00, 0x00, i, 0x00, 0x01, 0x01, 0x03]);
}

var t = setTimeout(() => {
   console.log('timeout');
   hid.close();
}, 2000);

var onData = (data) => {
   i++;
   console.log(data);
   console.log();

   if (i < 5) {
      if (i > 2) {
         hid.close();

         hid = new HID(path);

         hid.on('data', onData);

         console.log(hid);
      }

      write();
   } else {
      clearTimeout(t);
      hid.close();
   }
};

hid.on('data', onData);
console.log('HID:');
console.log(hid);
console.log();

hid.on('error', (error) => {
   console.log(error);
});

write();
