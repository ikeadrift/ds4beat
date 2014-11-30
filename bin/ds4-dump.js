#!/usr/bin/env node

'use strict';

var _ = require('lodash');
var hid = require('node-hid');
var ds4 = require('..');
var play = require('play');
var T = require('timbre');
//var tone = require('tone');

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
var soundSet = 1;

/*BOOLEAN BUTTONS
  dPadUp
  dPadRight
  dPadDown
  dPadLeft
  cross
  circle
  square
  triangle
  l1
  l2
  r1
  r2
  l3
  r3
  share
  options
  trackPadButton
  psButton
  trackPadTouch0Active
  trackPadTouch1Active
*/

var cache = {};

/*
 * 0 = (not down)
 * 2 = press
 * 1 = release
 * 3 = (down)
 */

function buttonPressed(button, state) {
	var out = (state[button] << 1) | cache[button];
	cache[button] = state[button];
	return out;
}

function playSound(soundNumber, set){
  play.sound('./sounds/'+set+'/'+soundNumber+".wav");
}

hidDevice.on('data', function(buf) {
	var state = parseDS4HIDData(buf.slice(offset));
	
	var cross = buttonPressed("cross", state);
	var circle = buttonPressed("circle", state);
	var square = buttonPressed("square", state);
  var triangle = buttonPressed("triangle", state);
  var dPadUp = buttonPressed("dPadUp", state);
  var dPadRight = buttonPressed("dPadRight", state);
  var dPadDown = buttonPressed("dPadDown", state);
  var dPadLeft = buttonPressed("dPadLeft", state);
  var l1 = buttonPressed("l1", state);
  var l2 = buttonPressed("l2", state);
  var r1 = buttonPressed("r1", state);
  var r2 = buttonPressed("r2", state);
  var l3 = buttonPressed("l3", state);
  var r3 = buttonPressed("r3", state);
  var share = buttonPressed("share", state);
  var options = buttonPressed("options", state);
  var trackPadButton = buttonPressed("trackPadButton", state);
  var psButton = buttonPressed("psButton", state);
  var trackPadTouch0Active = buttonPressed("trackPadTouch0Active", state);
  var trackPadTouch1Active = buttonPressed("trackPadTouch1Active", state);

  if(r1==2){
    soundSet=2;
  }

  if(l1==2){
    soundSet=1;
  }

  if(cross==2){
    console.log("cross pressed.");
    playSound(1,soundSet);
  }
  if(cross==1){
    console.log("cross released.");
  }

  if(circle==2){
    console.log("circle pressed.");
    playSound(2,soundSet);
  }
  if(circle==1){
    console.log("cross released.");
  }

  if(triangle==2){
    console.log("square pressed.");
    playSound(3,soundSet);
  }
  if(triangle==1){
    console.log("square released.");
  }

  if(square==2){
    console.log("triangle pressed.");
    playSound(4,soundSet);
  }
  if(square==1){
    console.log("triangle released.");
  }

  var trackPadTouch0X = parseDS4HIDData(buf.slice(offset)).trackPadTouch0X;
  if(trackPadTouch0Active){
    T("sin", {freq:400, mul:trackPadTouch0X}).play(); 
    console.log(trackPadTouch0X);
  }

if(!trackPadTouch0Active){
    //console.log("touchpad up");   
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
