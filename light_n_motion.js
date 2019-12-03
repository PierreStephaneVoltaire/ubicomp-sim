const Timer = require('tiny-timer')
var Enum = require('enum');
const MQTT = require("async-mqtt");
const timer = new Timer()

var motionStates = new Enum({
    'NO_MOTION': 0, //NO MOTION
    'MOTION': 1 //MOTION DETECTED
});

var lightStates = new Enum({
    'OFF': 0,
    'ON': 1
});

const dataRate=500
let elaspedTime = 0

let currentMotionState = motionStates.get(1).key
let currentLightState = lightStates.get(0).key

const client = await MQTT.connectAsync("tcp://10.16.51.55:1883")

async function motionCheck(boolLightState){

    if(boolLightState == true){
        elaspedTime = 0

        //light is on, check for user motion

        //10 sec consol log every minute
        timer.on('tick', async (dataTransferRate) => {
            elaspedTime += dataRate
            
            currentDate = new Date();

            if(elaspedTime >= 10000){
                currentMotionState = motionStates.get(0).key
                currentDataPoint = {
                    "State": currentMotionState,
                    "date": currentDate.toUTCString()
                }
            }
            else{
                currentMotionState = motionStates.get(1).key
                currentDataPoint = {
                    "State": currentMotionState,
                    "date": currentDate.toUTCString()
                }
                
            }

            console.log(currentDataPoint, elaspedTime)

            try {
                await client.publish("motion_sensor", JSON.stringify(currentDataPoint));
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

client.on('message', function (topic, message) {
    if (topic === "light_activity") {
        let content = message.toString()

        if(content == "ON"){
            motionCheck(true)
        }


    }
})