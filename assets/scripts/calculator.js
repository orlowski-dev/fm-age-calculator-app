const calcForm = document.getElementById('calc-form');
const formInputs = document.querySelectorAll(['#input--day', '#input--month', '#input--year']);
const formLabels = document.querySelectorAll(['#label--day', '#label--month', '#label--year']);
const formErrors = document.querySelectorAll(['#error--day', '#error--month', '#error--year']);
const resultElements = document.querySelectorAll(['#result--years', '#result--months', '#result--days']);
const resultSection = document.getElementById('result-section');

errorList = [
    'This field is required',
    'Must be a valid day',
    'Must be a valid month',
    'Must be a valid year',
    'Must be in the past',
]

calcForm.addEventListener('submit', (e) => {
    e.preventDefault();

    setAllElementsInvalid(false);

    if (checkFormInputs()) {
        calculateAndDisplayAge();
    }
})

for (let input of formInputs) {
    input.addEventListener('keyup', () => {
        setAllElementsInvalid();
        checkFormInputs();
    })
}

function checkFormInputs() {
    let isDayValid = checkDayInput();
    let isMonthValid = checkMonthInput();
    let isYearValid = checkYearInput();

    if (isDayValid && isMonthValid && isYearValid) {
        return true;
    }

    setAllElementsInvalid();
    setAllResultElementsInvalid();
    return false;
}

function checkDayInput() {
    const inputValue = formInputs[0].value;

    if (!isInputNotEmpty(inputValue)) {
        setAllElementsInvalid();
        setElementInvalid(0, errorMessage=errorList[0]);
        return false;
    }
    if (!isValueInRange(inputValue, 1, 31) || !dayWithinMonth() || inputValue.length !== 2) {
        setAllElementsInvalid();
        setElementInvalid(0, errorMessage=errorList[1]);
        return false;
    }

    setElementInvalid(0, '', invalidClassIsToBeRemoved=true);
    return true;
}

function checkMonthInput() {
    const inputValue = formInputs[1].value;

    if (!isInputNotEmpty(inputValue)) {
        setAllElementsInvalid();
        setElementInvalid(1, errorMessage=errorList[0]);
        return false;
    }
    if (!isValueInRange(inputValue, 1, 12) || inputValue.length !== 2) {
        setAllElementsInvalid();
        setElementInvalid(1, errorMessage=errorList[2]);
        return false;
    }

    setElementInvalid(1, '', invalidClassIsToBeRemoved=true);
    return true;
}

function checkYearInput() {
    const inputValue = formInputs[2].value;

    if (!isInputNotEmpty(inputValue)) {
        setAllElementsInvalid();
        setElementInvalid(2, errorMessage=errorList[0]);
        return false;
    }

    const dateObj = new Date();


    if (isFrmDtBiggerThanCrrDt(inputValue, dateObj)) {
        setAllElementsInvalid();
        setElementInvalid(2, errorMessage=errorList[4]);
        return false;
    }



    if (!isValueInRange(inputValue, 1000, dateObj.getFullYear())) {
        setAllElementsInvalid();
        setElementInvalid(2, errorMessage=errorList[3]);
        return false;
    }

    setElementInvalid(2, '', invalidClassIsToBeRemoved=true)
    return true
}

function isFrmDtBiggerThanCrrDt(inputValue, dateObj) {
    const currentDate = `${dateObj.getFullYear()}${addZero(dateObj.getMonth() + 1)}${addZero(dateObj.getDate())}`;
    const formDate = formInputs[2].value + formInputs[1].value + formInputs[0].value;

    if (isInputNotEmpty(formInputs[0].value) && isInputNotEmpty(formInputs[1].value)) {
        if (formDate >= currentDate) {
            return true;
        }
    } else {
        if (inputValue >= dateObj.getFullYear()) {
            return true;
        }
    }

    return false;
}

function calculateAndDisplayAge() {
    const formDate = [formInputs[2].value, formInputs[1].value, formInputs[0].value];
    const dateObj = new Date();
    const currentDate = [dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()];

    let YMD = [
        currentDate[0] - formDate[0],
        currentDate[1] - formDate[1],
        currentDate[2] - formDate[2]
    ]

    console.log(YMD)

    // months normalization
    if (YMD[1].toString()[0] == '-') {
        YMD[0] -= 1;
        YMD[1] += 12;
    }

    // days nomtalization
    if (YMD[2].toString()[0] == '-') {
        if (YMD[1] <= 0) {
            YMD[0] -= 1;
            YMD[1] += 12;
        }

        YMD[1] -= 1;
        YMD[2] += 31 // 30 days of a month + 1 day
    }

    resultSection.classList.add('change-anim');

    setTimeout(() => {
        resultElements[0].innerText = YMD[0];
        resultElements[1].innerText = YMD[1];
        resultElements[2].innerText = YMD[2];
    }, 600);
}

function addZero(value) {
    return (value < 10) ? value = '0' + value : value;
}

function setAllResultElementsInvalid() {
    for (const elem of resultElements) {
        elem.innerText = '--';
    }
    resultSection.classList.remove('change-anim');
}

function setElementInvalid(elementID, errorMessage='', invalidClassIsToBeRemoved=false) {
    if (invalidClassIsToBeRemoved) {
        formInputs[elementID].classList.remove('invalid');
        formLabels[elementID].classList.remove('invalid');
    } else {
        formInputs[elementID].classList.add('invalid');
        formLabels[elementID].classList.add('invalid');
    }

    formErrors[elementID].innerText = errorMessage;
}

function setAllElementsInvalid(invalidClassIsToBeRemoved=false) {
    if (invalidClassIsToBeRemoved) {
        for (let i = 0; i < formInputs.length; i++) {
            formInputs[i].classList.remove('invalid');
            formLabels[i].classList.remove('invalid');
        }
    } else {
        for (let i = 0; i < formInputs.length; i++) {
            formInputs[i].classList.add('invalid');
            formLabels[i].classList.add('invalid');
        }
    }
}

function isInputNotEmpty(value) {
    return (value.length !== 0) ? true : false;
}

function isValueInRange(value, min, max) {
    return (value >= min && value <= max) ? true : false;
}

function dayWithinMonth() {
    const monthValue = formInputs[1].value;

    // if month input is empty it is unnecessary to check this logic
    if (monthValue.length === 0) {
        return true;
    }

    const dayValue = formInputs[0].value;
    let daysInFebulary = 28;

    // if leap year change numbers of days in a month
    const yearValue = formInputs[2].value;
    if (yearValue.length !== 0) {
        daysInFebulary = (isLeapYear(yearValue)) ? 29 : 28;
    }

    // for fabulary
    if (dayValue > daysInFebulary && monthValue ==  2) {
        return false;
    }
    // for even months, the day cannot be highter than 30
    if (dayValue == 31 && monthValue % 2 == 0) {
        return false;
    }

    return true;
}

function isLeapYear(value) {
    if (value % 4 != 0) {
        return false;
    }
    if (value % 100 != 0) {
        return true;
    }
    if (value % 400 != 0) {
        return false;
    }

    return true;
}