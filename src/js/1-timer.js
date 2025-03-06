// import calendar library
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

// import alerts library
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector("button");
const dateInput = document.querySelector("input");
const timerFields = {
  days: document.querySelector("span[data-days]"),
  hours: document.querySelector("span[data-hours]"),
  minutes: document.querySelector("span[data-minutes]"),
  seconds: document.querySelector("span[data-seconds]")
};

let timerId = null; //save global timer id to be able to clean it when it expires

//start button is inactive on load until we select a date
startButton.disabled = true;

let userSelectedDate = new Date();

//#region flatpickr setup
const flatpickrOptions = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
    onClose(selectedDates) {
        if (selectedDates[0] < Date.now()) {
          iziToast.show({
            message: 'Please choose a date in the future',
            messageSize: '16px',
            messageLineHeight: '24px',
            messageColor: 'white',
            position: 'topRight',
            backgroundColor: '#EF4040',
            theme: 'dark',
            iconUrl: "./img/error-alert.svg",
            iconColor: 'white',
            progressBarColor: '#B51B1B',
          });
          startButton.disabled = true;
          return;
        }
        userSelectedDate = selectedDates[0];
      startButton.disabled = false; //enable button back after valid date is selected
  },
};

const flatpickrInstance = new flatpickr("#datetime-picker", flatpickrOptions);
//#endregion flatpickr setup

//#region utils
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

//#endregion utils

startButton.addEventListener('click', () => timerId = setInterval(() => {
  //maybe move excessive calculations to global variables/functions
  //but then wont be able to respond to inner delays of browser/cpu 
  const timeLeft = userSelectedDate - Date.now();
  if (timeLeft > 0) {
    const convertedTimeLeft = convertMs(timeLeft);
    Object.keys(convertedTimeLeft).forEach(key => 
      timerFields[key].textContent = convertedTimeLeft[key] < 10 ? addLeadingZero(convertedTimeLeft[key]) : convertedTimeLeft[key]
    );
  }
  else {
    clearInterval(timerId);
    //enable controlls when timer runs out
    dateInput.disabled = false;
  }
}, 1000));

//disable controlls after click
startButton.addEventListener('click', () => {
  dateInput.disabled = true;
  startButton.disabled = true;
})