/// Heater.js


const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:8080')

/** Default state is 'turn off', there are other possible states
 such as: turn on, turning off and turning on **/

var state = 'turn off'

client.on('connect', () =>{
  client.subscribe('heater/turnon')
  client.subscribe('heater/turnoff')
    // to make sure that heater is connected
  client.publish('heater/connected','true')
  sendStateUpdate()
})

client.on('message',(topic,message) =>{
  console.log('received message %s %s', topic, message)
  switch (topic){
    case 'heater/turnon':
      return handleTurnOnRequest(message)
    case 'heater/turnoff'
      return handleTurnOffRequest(message)
  }
})

function sendStateUpdate(){
  console.log('sending state %s',state)
  client.publish('heater/state'state)
}

function handleTurnOnRequest (message){
  if(state != 'turnon' && state !== 'turning on'){
    console.log('Turning on the Heater')
    state = 'Turning on'
    sendStateUpdate()
    setTimeout(() =>{
      state ='Turn on'
      sendStateUpdate()
    }, 10000)
  }
}


function handleTurnOffRequest(message){
  if(state != 'turnoff' && state !=='turning off'){
    console.log('Turning off the Heater')
    state = 'Turning off'
    sendStateUpdate()
    setTimeout(() =>{
      state = ' Turn off'
      sendStateUpdate()
    },10000)
  }
}



//the way of notify controller of the heaterState
function handleRemoteExit (options,err){
  if(err){
    console.log(err.stack)
  }
  if(options.cleanup){
    client.publish('heater/connected','false')
  }
  if(options.exit){
    process.exit()
  }
}
