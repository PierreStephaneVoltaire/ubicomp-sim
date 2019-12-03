const Timer = require('tiny-timer')
var Enum = require('enum');
const MQTT = require("async-mqtt");
const timer = new Timer()

var motionStates = new Enum({
    'OFF': 0, //NO MOTION
    'ON': 1 //MOTION DETECTED
});

var lightStates = new Enum({
    'OFF': 0,
    'ON': 1
});

const dataTransferRate=500
let elaspedTime = 0

let currentMotionState = motionStates.get(0).key
let currentLightState = lightStates.get(0).key

async function motionCheck(boolLightState){
    const client = await MQTT.connectAsync("tcp://192.168.2.60:1883")

    

    if(boolLightState == true){
        elaspedTime = 0
        elaspedTime += dataTransferRate

        //light is on, check for user motion

        //10 sec consol log every minute
        timer.on('tick', async (dataTransferRate) => {
            currentDate = new Date();

            if(elaspedTime == 10000){
                currentDataPoint = {
                    "State": currentMotionState.get(0).key,
                    "date": currentDate.toUTCString()
                }
            }
            else{
                currentDataPoint = {
                    "State": currentMotionState.get(1).key,
                    "date": currentDate.toUTCString()
                }
                
            }

            console.log(currentDataPoint, elaspedTime)

            try {
                await client.publish("motion", JSON.stringify(currentDataPoint));
                // This line doesn't run until the server responds to the publish
        
            } catch (e) {
                // Do something about it!
                console.log(e.stack);
                process.exit();
            }
            
        })

        timer.start(1000*60*60*24)

    }
    else{
        //do nothing, light is off
    }


}


motionCheck(true)

