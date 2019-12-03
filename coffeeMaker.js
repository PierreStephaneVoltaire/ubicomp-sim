const Timer = require('tiny-timer')
var Enum = require('enum');
const MQTT = require("async-mqtt");
const timer = new Timer()

const dataRate=500
let elaspedTime = 0

var States = new Enum({
    'OFF': 0,
    'HEATING': 1,
    'ON': 2,
});

var client = MQTT.connect('mqtt://10.16.51.55:1883')

async function coffeeMakerStartUp(boolTurnOn){
    if(boolTurnOn){
        //timer to turn coffee maker to heating, then on right after

        //10 sec consol log every minute
        timer.on('tick', (dataTransferRate) => {
            
            currentDate = new Date();

            currentMotionState = States.get(1).key
            currentDataPoint = {
                "State": currentMotionState,
                "date": currentDate.toUTCString()
            }

            console.log(currentDataPoint)

        })

        timer.on('done', () =>{
            //WERE DONE, TURN THIS BB ON TO COOK
            urrentDate = new Date();

            currentMotionState = States.get(2).key
            currentDataPoint = {
                "State": currentMotionState,
                "date": currentDate.toUTCString()
            }

            console.log(currentDataPoint)
            
        })

        //2 minutes to heat
        timer.start(1000*60*2)
    }
}

async function coffeeMakerShutOff(){
    currentDate = new Date();

    currentMotionState = States.get(0).key
    currentDataPoint = {
        "State": currentMotionState,
        "date": currentDate.toUTCString()
    }

    console.log(currentDataPoint)
}

client.on('message', function (topic, message) {
    if (topic === "coffee_maker") {
        let content = message.toString()
        console.log(message)

        if(content == "ON"){
            coffeeMakerStartUp(true)
        }
        if(content == "OFF"){
            coffeeMakerShutOff()
        }

    }
})