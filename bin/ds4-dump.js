#!/usr/bin/env node

'use strict';

var _ = require('lodash');
var hid = require('node-hid');
var ds4 = require('..');

var parseDS4HIDData = ds4.parseDS4HIDData;

var devices = hid.devices();
var controller = _(devices)
    .filter(isDS4HID)
    .first();

if (!controller) {
    throw new Error('Could not find desired controller.');
}

var hidDevice = new hid.HID(controller.path);
var offset = 0;

if (isBluetoothHID(controller)) {
    offset = 2;
    hidDevice.getFeatureReport(0x04, 66);
}

var wasCross = false;
//var wasL1 = false;
//var wasR1 = false;
var soundSet = 1;

/*BOOLEAN BUTTONS
  dPadUp: false,
  dPadRight: false,
  dPadDown: false,
  dPadLeft: false,
  cross: false,
  circle: false,
  square: false,
  triangle: false,
  l1: false,
  l2: false,
  r1: false,
  r2: false,
  l3: false,
  r3: false,
  share: false,
  options: false,
  trackPadButton: false,
  psButton: false,
  trackPadTouch0Active: false,
  trackPadTouch1Active: false,
*/

var cache = {};

/*
 * 0 = (not down)
 * 1 = press
 * 2 = release
 * 3 = (down)
 */
function buttonPressed(button, state) {
	var out = (state[button] << 1) | cache[button];
	cache[button] = state[button];
	return out;
}

hidDevice.on('data', function(buf) {
	var state = parseDS4HIDData(buf.slice(offset));
	
	buttonPressed("cross", state);
	buttonPressed("circle", state);
	buttonPressed("square", state);
	//example:
	if (buttonPressed("triangle", state) == 1) { //press
		//do something
	}
});

/*if (soundSet==1) {
    if(parseDS4HIDData(buf.slice(offset)).r1){
    soundSet=2;
    console.log(soundSet);

    //wasCross = parseDS4HIDData(buf.slice(offset)).cross;
   	 }
    if(parseDS4HIDData(buf.slice(offset)).l1){
    soundSet=3;
    console.log(soundSet);

    //wasCross = parseDS4HIDData(buf.slice(offset)).cross;
    }
};

if (soundSet==2) {
    if(parseDS4HIDData(buf.slice(offset)).r1){
    soundSet=3;
    console.log(soundSet);

   	 }
    if(parseDS4HIDData(buf.slice(offset)).l1){
    soundSet=1;
    console.log(soundSet);

    }
};

if (soundSet==3) {
    if(parseDS4HIDData(buf.slice(offset)).r1){
    soundSet=1;
    console.log(soundSet);

   	 }
    if(parseDS4HIDData(buf.slice(offset)).l1){
    soundSet=2;
    console.log(soundSet);

    //wasCross = parseDS4HIDData(buf.slice(offset)).cross;
    }
};*/

// HIDDesciptor -> Boolean
function isDS4HID(descriptor) {
  return descriptor.vendorId == 1356 && descriptor.productId == 1476;
}

// HIDDesciptor -> Boolean
function isBluetoothHID(descriptor) {
  return descriptor.path.match(/^Bluetooth/);
}

// HIDDesciptor -> Boolean
function isUSBHID(descriptor) {
  return descriptor.path.match(/^USB/);
}
