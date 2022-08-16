import playList from './playList.js';

const time = document.querySelector('.time');
const dateContent = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');
const body = document.querySelector('body');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const cityInput = document.querySelector('.city');
const playBtn = document.querySelector('.play');
const playNextBtn =document.querySelector('.play-next');
const playPrevBtn =document.querySelector('.play-prev');
const platListContainer = document.querySelector('.play-list');
const audio = new Audio();
let playNum = 0;
let isPlay = false;



function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString()
    time.textContent = currentTime
    showDate()
    swowGreeting()
    setTimeout(showTime, 1000)
}

function showDate() {
    const date = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    const currentDate = date.toLocaleDateString('en-EN', options);
    dateContent.textContent = currentDate;
}

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
    const timeOfDay = ['night', 'morning', 'afternoon', 'evening'];
    let index = Math.floor(date.getHours() / 6);
    return timeOfDay[index]
}

function swowGreeting() {
    const currentTimeOfDay = getTimeOfDay()
    greeting.textContent = `Good ${currentTimeOfDay},`
}

showTime()

function setLocalStorage() {
    localStorage.setItem('name', name.value);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
    if(localStorage.getItem('name')) {
      name.value = localStorage.getItem('name');
    }
}
window.addEventListener('load', getLocalStorage)

function getRandomNum(max) {
    return Math.floor(Math.random() * max) + 1;
}

let randomNum = getRandomNum(20);

function setBg() {
    let timeOfDay = getTimeOfDay();
    let bgNum = ('' + randomNum).padStart(2, '0');
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/nickosha/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.webp`;
    img.onload = () => {
        body.style.backgroundImage = "url(" + img.src + ")"
    }
}

function getSlideNext() {
    randomNum += 1;
    if (randomNum == 21) {
        randomNum = 1
    }
    setBg()
}

function getSlidePrev() {
    randomNum -= 1;
    if (randomNum == 0) {
        randomNum = 20
    }
    setBg()
}

setBg()

slideNext.addEventListener('click', getSlideNext)
slidePrev.addEventListener('click', getSlidePrev)

async function getWeather() {  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&lang=ru&appid=63d401d600daff752fd1964ecefabc6a&units=metric`;
    const res = await fetch(url);
    const data = await res.json(); 

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `Wind speed: ${data.wind.speed.toFixed(0)} m/s`
    humidity.textContent = `Humidity: ${data.main.humidity}%`
}

if (!cityInput.value) { cityInput.value = 'Минск'}
getWeather()

cityInput.addEventListener('change', getWeather)

const quoteText = document.querySelector('.quote');
const quoteAutor = document.querySelector('.author');

async function getQuotes() {
    const result = await fetch('https://type.fit/api/quotes');
    const data = await result.json();

    const randomIndex = getRandomNum(data.length);
    quoteText.textContent = `"${data[randomIndex].text}"`;
    quoteAutor.textContent = data[randomIndex].author;
}

const changeQuoteButton = document.querySelector('.change-quote');

getQuotes()

changeQuoteButton.addEventListener('click', getQuotes);

// Player

function playAudio() {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    audio.play();
    for (let i = 0; i < playListItems.length; i++) {
        playListItems[i].classList.remove('item-active');
    }
    playListItems[playNum].classList.add('item-active')
}

function pauseAudio() {
    audio.pause();
    playListItems[playNum].classList.remove('item-active')
}

function toggleBtn() {
    playBtn.classList.toggle('pause');
}

function playNext() {
    playNum += 1;
    if (playNum === playList.length) {
        playNum = 0;
    }
    playAudio();
    if (!playBtn.classList.contains('pause')) {
        toggleBtn();
    }
}

function playPrev() {
    playNum -= 1;
    if (playNum < 0) {
        playNum = playList.length - 1;
    }
    playAudio();
    if (!playBtn.classList.contains('pause')) {
        toggleBtn();
    }
}

playBtn.addEventListener('click', () => {
    if (!playBtn.classList.contains('pause')) {
        playAudio();
        toggleBtn();
    } else {
        pauseAudio();
        toggleBtn()
    }
});

playList.forEach(elem => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = elem.title;
    platListContainer.append(li)
})

const playListItems = document.querySelectorAll('.play-item');


playNextBtn.addEventListener('click', playNext)
playPrevBtn.addEventListener('click', playPrev)