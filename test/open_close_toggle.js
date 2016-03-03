'use strict';

var HID = require('../nodehid.js');

var devices = HID.devices(0x04d8, 0xfcf0);

console.log('devices:');
console.log(devices);
console.log();

var path = devices[1].path;

console.log('path: ' + path);
console.log();

var i = 0;
var timeout = 250;
var limit = 5;

var hid = new HID(path);

console.log(hid);

hid.close();

var onTimeout = () => {
   i++;
   console.log(i + ': ' + new Date().toISOString());
   hid = new HID(path);

   hid.close();

   if (i < limit) {
      setTimeout(onTimeout, timeout);
   }
}

console.log('starting timeout...');
var t = setTimeout(onTimeout, timeout);

console.log('waiting...');

setTimeout(() => {
   console.log('test');
}, limit * timeout + 250);
