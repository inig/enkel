// const { parentPort } = require('worker_threads')
// parentPort.on('message', (message) => {
//   setTimeout(() => {
//     parentPort.postMessage('from worker: ' + Math.floor(Math.random() * 1000))
//   }, 3000)
// })

const { parentPort } = require('worker_threads')
parentPort.on('message', (e) => {
  if (e.type === 'check-update') {
    let updateCheckInterval = setInterval(() => {
      parentPort.postMessage('from worker: ' + Math.floor(Math.random() * 1000))
    }, 5 * 1000)
  }
})