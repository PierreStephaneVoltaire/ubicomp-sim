const Timer = require('tiny-timer')
var Enum = require('enum');
const timer = new Timer()

var States = new Enum({'AWAKE':0,'REM':1, 'N1':2, 'N2':3,'N3':4,'N4':5});

const ms=1000/5
const Hour=60/60
const minute=Hour/60;
let currentState=States.get(0).key


timer.on('tick', (ms) => {
    let nextI=States.get(currentState).value+1
    console.log(nextI)

    if(nextI>States.size){
nextI=0
    }

    currentState=States.get(nextI).key
currentDataPoint={"State":currentState,"date":new Date().toUTCString}
    console.log(currentDataPoint, ms)})
timer.on('done', () => console.log('done!'))
timer.start(15000)
console.log("d")