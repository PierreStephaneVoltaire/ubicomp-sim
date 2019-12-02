var Enum = require('enum');
var mqtt = require('mqtt')
var fs = require('fs');
const moment = require('moment')
var client = mqtt.connect('mqtt://192.168.2.60:1883')
var buffer = new Map()
avgSleep = 0;

run()


async function run() {
    client.on('connect', function () {
        client.subscribe("sleep_monitor_activity", function (err) {})
        client.subscribe("motion_sensor", function (err) {})

    })

    client.on('message', function (topic, message) {
        // message is Buffer
        let content = JSON.parse(message.toString())

        if (topic === "sleep_monitor_activity") {
            console.log(content)
            buffer.set(content.date, content.State)
            if (content.State == "Awake") {
                currentState = States.get(0).key
            }
            if (buffer.size < 100) {
                fs.writeFile(`./files/sleep/${moment().format("MMM-Do-YY")}.json`, JSON.stringify(Object.fromEntries(buffer)), function (err) {
                    console.log('Saved!');
                });
            } else {
                try {
                    fs.unlinkSync(`./files/sleep/${moment().format("MMM-Do-YY")}.json`)
                    buffer.clear()
                } catch (err) {
                    console.error(err)
                }
            }
        }
    })



}