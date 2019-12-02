const Timer = require('tiny-timer')
var Enum = require('enum');
const timer = new Timer()

var States = new Enum({
    'OFF': 0, //NO MOTION
    'ON': 1 //MOTION DETECTED
});

const Hour = 60 / 10
const minute = Hour / 60;
const seconds = minute / 60;
const ms = seconds/2
const dataTransferRate=500*ms

let minutesElapsed = 0

setInterval(() => {
    minutesElapsed ++
}, 1000)

let currentState = States.get(0).key

function motionCheck(boolLightState){
    if(boolLightState == true){
        //light is on, check for user motion

        //10 sec consol log every minute
        timer.on('tick', (dataTransferRate) => {
            currentDate = new Date();

            currentDate.setMinutes(currentDate.getMinutes() + minutesElapsed);
            currentDataPoint = {
                "State": States.get(1).key,
                "date": currentDate.toUTCString()
            }
            console.log(currentDataPoint, ms)

        })

        timer.on('done', () => {
            //final console log
            currentDataPoint = {
                "State": States.get(0).key,
                "date": currentDate.toUTCString()
            }

            console.log(currentDataPoint, ms)
        })

        timer.start(1000*10, 1000)

    }
    else{
        //do nothing, light is off
    }
}


motionCheck(true)

