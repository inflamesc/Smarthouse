///Controller of the Heater

const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:8080')

var heaterState = ''
var connected = false

client.on('connect',() => {
  client.subscribe('heater/connected')
  client.subscribe('heater/state')
})

client.on('message',(topic,message)=>{
  switch(topic) {
    case 'heater/connected':
      return handleHeaterConnected(message)
    case 'heater/state':
      return handleHeaterState(message)
  }
  console.log(' There is no handler for subject %s', topic)
})

function handleHeaterConnected (message){
  console.log('Heater connected status %s', message)
  connected = (message.toString() === 'true')
}

function handleHeaterState (message){
  heaterState = message
  console.log('Heater state update: %s', message)
}

// this function runs only if we're connected to mqtt and heater isn't already turnt on
function turnonHeater (){
  if (connect && heaterState !== 'turnon'){
    client.publish('heater/turnon','true')
  }
}

// this function runs only if we're connected to mqtt and heater isn't already turnt off
function turnoffHeater () {
  if (connected && heaterState !== 'turnoff'){
    client.publish('heater/turnoff','true')
  }
}

///Simulation of functions

setTimeout() =>{
  console.log('Turn on Heater')
  turnonHeater()
}, 10000)

setTimeout () =>{
  console.log(' Turn off Heater')
  turnoffHeater()
}, 10000)
