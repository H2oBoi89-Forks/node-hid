'use strict';

var EventEmitter = require("events").EventEmitter;

// Load C++ binding
var binary = require('node-pre-gyp');
var path = require('path');
var binding_path = binary.find(path.resolve(path.join(__dirname, './package.json')));
var binding = require(binding_path);

/**
 * Represents a USB HID device
 * @emits HID#data
 * @emits HID#error
 */
class HID extends binding.HID {
   /**
    * Creates an intance of the HID class.
    * @param {string} path Device path of the device we want to connect to.
    */
   constructor(path) {
      super(path);

      this._stop = false;

      if (process.platform === 'win32') {
         this.setNonBlocking(1);
      }

      this._read();
   }

   /**
    * Writes data to the device
    * @param {number[]} data Data to send to device
    */
   write(data) {
      super.write(data);
   }

   /**
    * Closes this device.
    */
   close() {
      try {
         this._stop = true;
         this.removeAllListeners();
         super.close();
      }
      catch (error) {
         console.log('error during hid.cc close: ' + error);
      }
   }

   /**
    * Read loop
    * @private
    */
   _read() {
      console.log('reading...');
      this.read((error, data) => {
         console.log('e: ' + error);
         if (data !== undefined) {
            console.log('d: ' + data.toString('hex'));
         }
         if (error) {
            if (!this._stop) {
               this._stop;
               /**
                * Fired when an error occurs
                * @event HID#error
                * @type {Error}
                */
               this.emit("error", error);
            }
         }
         else {
            if (data.length > 0) {
               /**
                * Fired when data is recieved
                * @event HID#data
                * @type {number[]}
                */
               this.emit("data", data);
            }
         }

         if (!this._stop) {
            this._read();
         }
         else {
            console.log('stopping read');
         }
      });
   }

   /**
    * Gets a list of available devices.
    * Default arguments will return all USB HID devices.
    * @param {number} [vid] Vendor ID to filter by.
    * @param {number} [pid] Product ID to filter by.
    */
   static devices(vid, pid) {
      vid = vid | 0x00;
      pid = pid | 0x00;

      return binding.devices(vid, pid);
   }
}

function mixin(target, source) {
   target = target.prototype;
   source = source.prototype;

   Object.getOwnPropertyNames(source).forEach(function(name) {
      if (name !== "constructor") Object.defineProperty(target, name,
         Object.getOwnPropertyDescriptor(source, name));
   });
}

// We also want to extend EventEmitter
mixin(HID, EventEmitter);

module.exports = HID;
