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
var timeout = 100;

var hid = new HID(path);

console.log(hid);

hid.close();

var onTimeout = () => {
   console.log(Date.now());
   hid = new HID(path);

   hid.close();

   setTimeout(onTimeout, timeout);
}

console.log('starting timeout...');
var t = setTimeout(onTimeout, timeout);

console.log('waiting...');

setTimeout(() => {
   console.log('test');
}, 1000);
