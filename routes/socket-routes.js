var robot = require("robotjs");

var serialport = require('serialport');
var SerialPort = require("serialport").SerialPort;

try {
  var port = new SerialPort("/dev/tty.HC-05-DevB", {
    parser: serialport.parsers.readline('\n')
  });
} catch(error) {
  console.log("Port not ready/doesn't exist!");
}

// Max length of the running average array is 10
var averageArrayA = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var averageArrayB = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var averageArrayC = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var threshold = 300;

var shiftAverage = function (firstLetter, val) {
  var arr = averageArrayA;
  if (firstLetter == "A") {
    arr = averageArrayA;
  } else if (firstLetter == "B") {
    arr = averageArrayB;
  } else if (firstLetter == "C"){
    arr = averageArrayC;
  } 

  arr.shift();
  arr.push(val);

  return getAverage(arr);
}

var getAverage = function (arr) {
  var avg = 0;
  for (var i = 0; i < arr.length; i++) {
    avg += arr[i];
  }
  return avg / arr.length;
}







module.exports = function (io) {
  io.on('connection', function (socket) {
    socket.on('doActionA', function () {
        console.log("AAAAAAAAAAAAA");
    });

    socket.on('doActionB', function () {
      console.log("BBBBBBBBBBBBBBBB");
      typeLorem();
    });

    socket.on('doActionC', function () {
      console.log("CCCCCCCCCCCCCCCCC");
      moveMouse();
    });
  });




  port.on('open', function(err) {
    if (err) {
      console.log('Error opening port: ', err.message);
      return;
    }
    console.log('Serial Port Opened');


    port.on('data', function(data){
      // data is in form 'X: ###' 
      var firstLetter = data.charAt(0);
      var num = parseInt(data.substr(3, data.length - 1));

      var averageVal = shiftAverage(firstLetter, num);

      if (firstLetter == "A") {
        io.emit('sensorA', {
          sensorVal : data,
          num : averageVal
        });
      } else if (firstLetter == "B") {
        io.emit('sensorB', {
          sensorVal : data,
          num : averageVal
        });
      } else if (firstLetter == "C") {
        io.emit('sensorC', {
          sensorVal : data,
          num : num
        });
      }
    });
  });




}
// End socketio



// Gesture Actions

var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquet hendrerit ipsum, eu maximus sem porta a.";

var typeLorem = function () {
    //Type "Hello World".
    robot.typeString(lorem);

    //Press enter. 
    robot.keyTap("enter");
}


var moveMouse = function () {
    //Speed up the mouse.
    robot.setMouseDelay(2);

    var twoPI = Math.PI * 2.0;
    var screenSize = robot.getScreenSize();
    var height = (screenSize.height / 2) - 10;
    var width = screenSize.width;

    for (var x = 0; x < width; x++)
    {
        y = height * Math.sin((twoPI * x) / width) + height;
        robot.moveMouse(x, y);
    }
}


