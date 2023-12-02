import database from "./database.js";

const calendar = document.querySelector(".calendar");
const months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
};
const weekdays = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
};
const today = new Date();

let [currentDay, currentMonth, currentYear] = [null, null, null];
let [daysInCurrentMonth, firstDayOfMonth] = [null, null];

let [selectedDay, selectedHour] = [null, null];

function setCurrentMonth(monthChange) {
    let currentDate = null;
    if (monthChange === 0) {
        currentDate = new Date();
    } else {
        currentDate = new Date(currentYear, currentMonth + monthChange, 1);
    }

    if (currentDate.getMonth() === today.getMonth()) {
        currentDate = today;
    }
    console.log(currentDate);

    currentDay = currentDate.getDate();
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
    daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    if (firstDayOfMonth === 0) {
        firstDayOfMonth = 7;
    }

    const month = calendar.querySelector("section.month");
    const current = month.querySelector("p.current");
    current.innerHTML = `${months[currentMonth]} ${currentYear}`;

    const prev = calendar.querySelector("button.prev");
    prev.addEventListener("click", handlePrevMonthClick);

    const next = calendar.querySelector("button.next");
    next.addEventListener("click", handleNextMonthClick);

    setDays();
}

function handleDayClick(e) {
    const days = document.querySelector("section.days");
    days.querySelectorAll(".day").forEach((day) => {
        day.classList.remove("selected");
    });
    e.target.classList.add("selected");
    selectedDay = `${currentYear}-${currentMonth + 1}-${e.target.value}`;

    showHours(e.target.value, currentMonth, currentYear);
}

function handleHourClick(e) {
    const hours = calendar.querySelector("section.hours");
    hours.querySelectorAll(".hour").forEach((hour) => {
        hour.classList.remove("selected");
    });
    e.target.classList.add("selected");
    selectedHour = formatHour(e.target.value);
}

function handleSubmitClick(e) {
    if (selectedDay != "" && selectedHour != "") {
        console.log(selectedDay, selectedHour);
        database.saveReservation(selectedDay, selectedHour);
    } else {
        console.log("Not selected");
    }
}

function handlePrevMonthClick(e) {
    console.log("prev");
    setCurrentMonth(-1);
}

function handleNextMonthClick(e) {
    console.log("next");
    setCurrentMonth(1);
}

function formatHour(hour) {
    if (hour < 10) {
        return `0${hour}:00`;
    } else {
        return `${hour}:00`;
    }
}

function showSubmitButton() {
    const submitButton = calendar.querySelector("button.submit");
    submitButton.style.display = "block";
    submitButton.addEventListener("click", handleSubmitClick);
}

function setLoading(loading) {
    calendar.querySelector(".loading").style.display = loading ? "block" : "none";
    calendar.querySelector(".hours").style.visibility = loading ? "none" : "flex";
}

async function showHours(day, month, year) {
    const hours = calendar.querySelector("section.hours");

    setLoading(true);
    const openingHours = await database.getOpeningHours();
    console.log("opening hours: ", openingHours);
    setLoading(false);

    let [start, end] = [];
    const dayString = `${year}-${month + 1}-${day}`;
    console.log(dayString);

    // Check if there are exception opening hours for the day
    // if not use default hours
    if (dayString in openingHours.exceptions) {
        start = openingHours.exceptions[dayString].start;
        end = openingHours.exceptions[dayString].end;
    } else {
        let dayNumber = new Date(year, month, day).getDay();
        const weekdayStr = weekdays[dayNumber];
        openingHours.default.forEach((hour) => {
            if (hour.day.toLowerCase() === weekdayStr) {
                start = hour.start_time;
                end = hour.end_time;
            }
        });
    }

    hours.innerHTML = "";
    const reservations = await database.getReservations(dayString);
    for (let i = parseInt(start); i < parseInt(end); i++) {
        // Create new element with the hours
        const newHourButton = document.createElement("button");
        newHourButton.innerHTML = `${i}:00 - ${i + 1}:00`;
        newHourButton.value = i;

        // Add class names, add "reserved" tag if reserved
        newHourButton.classList.add("hour");
        if (reservations != null) {
            const hour = formatHour(i);
            if (reservations.includes(hour)) {
                newHourButton.classList.add("reserved");
            }
        }
        newHourButton.addEventListener("click", handleHourClick);
        hours.append(newHourButton);
    }
    hours.style.display = "flex";
    showSubmitButton();
}

function setDays() {
    const days = calendar.querySelector("section.days");
    let [row, col] = [1, firstDayOfMonth];

    days.innerHTML = "";
    for (let i = 1; i <= daysInCurrentMonth; i++) {
        const tempDate = new Date(currentYear, currentMonth, i + 1);

        const newDayItem = document.createElement("button");
        newDayItem.innerHTML = i;
        newDayItem.value = i;

        // Check if passed today
        if (tempDate < today) {
            newDayItem.classList.add("past");
        }
        newDayItem.classList.add("day");

        // Setting the days to match weekdays
        newDayItem.style.gridRow = `${row} / ${row + 1}`;
        newDayItem.style.gridColumn = `${col} / ${col + 1}`;
        newDayItem.addEventListener("click", handleDayClick);

        if (col === 7) {
            col = 1;
            row += 1;
        } else {
            col += 1;
        }
        days.append(newDayItem);
    }
}

setCurrentMonth(0);
