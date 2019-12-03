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
        client.subscribe("sleep_activity", function (err) {})

    })

    client.on('message', async function (topic, message) {
        // message is Buffer
        let content = JSON.parse(message.toString())

        if(topic === "sleep_activity"){
            let content = JSON.parse(message.toString())

            if(content.states == "AWAKE"){
                try {
                    await client.publish("coffee_maker", "ON");
                    // This line doesn't run until the server responds to the publish
            
                } catch (e) {
                    // Do something about it!
                    console.log(e.stack);
                    process.exit();
                }
            }
            if(content.states == "REM"){
                try {
                    await client.publish("coffee_maker", "OFF");
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