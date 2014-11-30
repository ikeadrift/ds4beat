var spawn = require('child_process').spawn;
var ds4_dump = spawn('ds4-dump');

ds4_dump.stdout.on('readable', function() {
  var buf = ds4_dump.stdout.read();
  if (buf) {
    // doesn't escape things
    // console.dir(buf.toString());
    setTimeout(function() {
      console.log(buf.toString());
      console.log("HEY");
    }, 1000);
  }
});

ds4_dump.stderr.on('readable', function() {
  var buf = ds4_dump.stderr.read();
  if (buf) {
    // doesn't escape things
    // console.dir(buf.toString());
    console.log(buf.toString());
    console.log("YA");
  }
});
