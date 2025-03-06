import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

//#region iziToast options
const iziToastFulfilledOptions = {
    progressBarColor: '#326101',
    backgroundColor: '#59A10D',
    messageColor: '#FFFFFF',
    messageSize: '16px',
    messageLineHeight: '24px',
    theme: 'dark',
    position: 'topRight',
    iconUrl: "./img/ok-alert.svg",
    iconColor: 'white',
}

const iziToastRejectedOptions = {
    progressBarColor: '#B51B1B',
    backgroundColor: '#EF4040',
    messageColor: '#FFFFFF',
    messageSize: '16px',
    messageLineHeight: '24px',
    theme: 'dark',
    position: 'topRight',
    iconUrl: "./img/error-alert.svg",
    iconColor: 'white',
}

const iziToastCautionOptions = {
    progressBarColor: '#BB7B10',
    backgroundColor: '#FFA000',
    message: 'You forgot important data',
    messageColor: '#FFFFFF',
    messageSize: '16px',
    messageLineHeight: '24px',
    theme: 'dark',
    position: 'topRight',
    iconUrl: "./img/caution-alert.svg",
    iconColor: 'white',
}
//#endregion iziToast options

//#region utils
function getStateInput(fieldsetElement) {
    const checked = fieldsetElement.querySelector('input[name="state"]:checked');
    if (!checked) {
        iziToast.show(iziToastCautionOptions);
        return;
    }
    return checked.value;
}

function createPromise({delay, state}) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve(delay);
            }
            if (state === 'rejected') {
                reject(delay);
            }
        }, delay);
    });
}
//#endregion utils

const delayInputField = document.querySelector('input[name="delay"]');
const stateInputField = document.querySelector('fieldset');
const createNotificationButton = document.querySelector('button[type="submit"]');

createNotificationButton.addEventListener('click', (event) => {
    event.preventDefault();
    createPromise({ delay: delayInputField.value, state: getStateInput(stateInputField) })
        .then(value => {
            iziToastFulfilledOptions.message = `Fulfilled promise in ${value}ms`;
            iziToast.show(iziToastFulfilledOptions);
        })
        .catch(error => {
            iziToastRejectedOptions.message = `Rejected promise in ${error}ms`
            iziToast.show(iziToastRejectedOptions);
        });
});