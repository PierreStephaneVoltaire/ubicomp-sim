var Enum = require('enum');
var mqtt = require('mqtt')
var fs = require('fs');
const moment = require('moment')
var client = mqtt.connect('mqtt://10.16.51.55:1883')
var buffer = new Map()
avgSleep = 0;

run()


async function run() {
    client.on('connect', function () {
        client.subscribe("motion_sensor", function (err) {})

    })

    client.on('message', function (topic, message) {
        // message is Buffer
        let content = JSON.parse(message.toString())

        if (topic === "motion_sensor") {
            console.log(content)
            buffer.set(content.date, content.State)

            if (buffer.size < 100) {
                fs.writeFile(`./files/motion/${moment().format("MMM-Do-YY")}.json`, JSON.stringify(Object.fromEntries(buffer)), function (err) {
                    console.log('Saved!');
                });
            } else {
                try {
                    fs.unlinkSync(`./files/motion/${moment().format("MMM-Do-YY")}.json`)
                    buffer.clear()
                } catch (err) {
                    console.error(err)
                }
            }
        }
        else if(topic === "sleep_activity"){
            let content = JSON.parse(message.toString())

            if(content.states == "Awake"){
                try {
                    await client.publish("light_activity", "ON");
                    // This line doesn't run until the server responds to the publish
            
                } catch (e) {
                    // Do something about it!
                    console.log(e.stack);
                    process.exit();
                }
            }
        }

    })



}