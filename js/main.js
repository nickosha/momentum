const time = document.querySelector('.time');
const date = new Date();
const currentTime = date.toLocaleTimeString()

time.textContent = currentTime
console.log(date)

