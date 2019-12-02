const Timer = require('tiny-timer')
var Enum = require('enum');
const timer = new Timer()
const MQTT = require("async-mqtt");
const States = new Enum({
    'AWAKE': 0,
    'REM': 1,
    'N1': 2,
    'N2': 3,
    'N3': 4,
    'N4': 5
});

run()

async function run() {
    const client = await MQTT.connectAsync("tcp://192.168.2.60:1883")
    //a minute is an hour here
    const seconds = 100;
    const ms = seconds / 2
    const dataTransferRate = 500 * ms

    let hoursElapsed = 0
    let minutesElapsed = 0
    let secondsElapsed = 0
    let currentState = States.get(0).key


    setInterval(() => {
        if (secondsElapsed < 60) {
            secondsElapsed += 1
        } else if (minutesElapsed < 60) {
            secondsElapsed = 0
            minutesElapsed += 1
        } else {
            secondsElapsed = 0
            minutesElapsed = 0
            hoursElapsed += 1
        }
    }, seconds)

    timer.on('tick', async (dataTransferRate) => {
        let nextI = States.get(currentState).value + 1
        if (nextI > States.size) {
            nextI = 1
        }

        currentState = States.get(nextI).key
        currentDate = new Date();

        currentDate.setHours(currentDate.getHours() + hoursElapsed, currentDate.getMinutes() + minutesElapsed, currentDate.getSeconds() + secondsElapsed);
        currentDataPoint = {
            "State": currentState,
            "date": currentDate.toUTCString()
        }
        try {
            await client.publish("sleep_monitor_activity", JSON.stringify(currentDataPoint));
            // This line doesn't run until the server responds to the publish

        } catch (e) {
            // Do something about it!
            console.log(e.stack);
            process.exit();
        }
    })
    timer.on('done', async () => {
        let currentDate = new Date();

        currentDate.setHours(currentDate.getHours() + hoursElapsed, currentDate.getMinutes() + minutesElapsed, currentDate.getSeconds() + secondsElapsed);
        let currentDataPoint = {
            "State": States.get(0).key,
            "date": currentDate.toUTCString()
        }
        try {
            await client.publish("test_topic", JSON.stringify(currentDataPoint));
            // This line doesn't run until the server responds to the publish

        } catch (e) {
            // Do something about it!
            console.log(e.stack);
            process.exit();
        }
    })
    timer.start(seconds*60*60*8)
}