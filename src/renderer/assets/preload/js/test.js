alert('111')
if (require('electron').remote) {

  setTimeout(() => {
    alert('Test Preload JS')
  }, 2000)
  window.hello = function () {
    console.log('Hello')
  }
}