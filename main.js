const Timer = require('tiny-timer')
var Enum = require('enum');
const timer = new Timer()

var States = new Enum({
    'AWAKE': 0,
    'REM': 1,
    'N1': 2,
    'N2': 3,
    'N3': 4,
    'N4': 5
});

const Hour = 60 / 10
const minute = Hour / 60;
const seconds = minute / 60;
const ms = seconds/2
const dataTransferRate=500*ms

let hoursElapsed = 0

let currentState = States.get(0).key


setInterval(() => {
    hoursElapsed = +1
}, Hour * 1000)


timer.on('tick', (dataTransferRate) => {
    let nextI = States.get(currentState).value + 1
    if (nextI > States.size) {
        nextI = 0
    }

    currentState = States.get(nextI).key
    currentDate = new Date();

    currentDate.setHours(currentDate.getHours() + hoursElapsed);
    currentDataPoint = {
        "State": currentState,
        "date": currentDate.toUTCString()
    }
    console.log(currentDataPoint, ms)
})
timer.on('done', () => console.log('done!'))
timer.start((60*60*60)*1000)
