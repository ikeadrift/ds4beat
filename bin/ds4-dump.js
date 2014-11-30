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

hidDevice.on('data', function(buf) {
    //console.log(parseDS4HIDData(buf.slice(offset)).cross);
function resetOldState(){

	oldState["cross"] = false;
	oldState["circle"] = false;
	oldState["square"] = false;
	oldState["triangle"] = false;
}    

	var oldState = {};


function buttonPressed(button){
	//console.log(oldState);
	//console.log(parseDS4HIDData(buf.slice(offset)));
	if(parseDS4HIDData(buf.slice(offset))[button] && !oldState[button]){
		console.log("new "+button+ " press!");
		oldState[button]=parseDS4HIDData(buf.slice(offset))[button];
		return true;
	} else if(parseDS4HIDData(buf.slice(offset))[button] && oldState[button]){
		console.log(button + " is being held")
		oldState[button]=parseDS4HIDData(buf.slice(offset))[button];
		return false;
	} else{
		oldState[button]=parseDS4HIDData(buf.slice(offset))[button];
		return false;
	}

}

//oldState = parseDS4HIDData(buf.slice(offset));

buttonPressed("cross");
buttonPressed("circle");
buttonPressed("square");
buttonPressed("triangle");

    /*if(parseDS4HIDData(buf.slice(offset)).cross && !wasCross){
    	console.log("X!");

    	//wasCross = parseDS4HIDData(buf.slice(offset)).cross;
    }
    wasCross = parseDS4HIDData(buf.slice(offset)).cross;*/

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


});

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
