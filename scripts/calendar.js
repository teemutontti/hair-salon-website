import database from "./database.js";
import { weekdays, months, formatDate, formatHour, reservationLimit } from "./utilities.js";

async function getDatabaseData() {
    localStorage.setItem("reservationCount", "0");

    setCalendarStatusText("Loading...");
    await database.getData();

    //Logs
    console.log("Default schedule fetched: ", JSON.parse(localStorage.getItem("schedule_default")));
    console.log("Exception schedule fetched: ", JSON.parse(localStorage.getItem("schedule_exceptions")));
    console.log("Reservations fetched: ", JSON.parse(localStorage.getItem("reservations")));

    setCalendarStatusText("");

    return;
}

const calendar = document.querySelector(".calendar");
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

    currentDay = currentDate.getDate();
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
    daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    if (firstDayOfMonth === 0) {
        firstDayOfMonth = 7;
    }

    const month = calendar.querySelector(".month");
    const current = month.querySelector("p.current");
    current.innerHTML = `${months[currentMonth]} ${currentYear}`;

    const prev = calendar.querySelector("button.prev");
    prev.addEventListener("click", handlePrevMonthClick);

    const next = calendar.querySelector("button.next");
    next.addEventListener("click", handleNextMonthClick);

    setDays();
}

function setDays() {
    const days = calendar.querySelector(".days");
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
async function showHours(day, month, year) {
    const hours = calendar.querySelector(".hours");

    const defaultSchedule = JSON.parse(localStorage.getItem("schedule_default"));
    const exceptionSchedule = JSON.parse(localStorage.getItem("schedule_exceptions"));

    let [start, end] = [];
    const dayString = `${year}-${month + 1}-${day}`;

    // Check if there are exception opening hours for the day
    // if not use default hours
    const formattedDayString = formatDate(dayString);
    const currentDaysExceptionSchedule = exceptionSchedule
    .filter(schedule => schedule.day === formattedDayString)
    .map(schedule => {
        start = schedule.start_time,
            end = schedule.end_time
        });
        let dayNumber = new Date(year, month, day).getDay();
        const weekdayStr = weekdays[dayNumber];
        if (currentDaysExceptionSchedule.length === 0) {
            defaultSchedule.forEach((hour) => {
                if (hour.day.toLowerCase() === weekdayStr) {
                    start = hour.start_time;
                end = hour.end_time;
            }
        });
    }
    start === end
    ? setCalendarStatusText("Closed")
    : setCalendarStatusText("");

    hours.innerHTML = "";
    const reservations = JSON.parse(localStorage.getItem("reservations"));
    const currentDaysReservationTimes = reservations
    .filter(reservation => reservation.date === dayString)
    .map(reservation => reservation.time);
    for (let i = parseInt(start); i < parseInt(end); i++) {
        // Create new element with the hours
        const newHourButton = document.createElement("button");
        newHourButton.innerHTML = `${i}:00 - ${i + 1}:00`;
        newHourButton.value = i;

        // Add class names, add "reserved" tag if reserved
        newHourButton.classList.add("hour");
        if (currentDaysReservationTimes != null) {
            const hour = formatHour(i);
            if (currentDaysReservationTimes.includes(hour)) {
                newHourButton.classList.add("reserved");
            }
        }
        newHourButton.addEventListener("click", handleHourClick);
        hours.append(newHourButton);
    }
    hours.style.display = "flex";
}

function showSubmitButton() {
    const submitButton = document.querySelector("#book button.submit");
    submitButton.style.display = "block";
    submitButton.addEventListener("click", handleSubmitClick);
}

function handleDayClick(e) {
    const submitButton = document.querySelector("#book button.submit");
    submitButton.style.display = "none";

    const days = document.querySelector(".days");
    days.querySelectorAll(".day").forEach((day) => {
        day.classList.remove("selected");
    });
    e.target.classList.add("selected");
    selectedDay = `${currentYear}-${currentMonth + 1}-${e.target.value}`;

    showHours(e.target.value, currentMonth, currentYear);
}
function handleHourClick(e) {
    const hours = calendar.querySelector(".hours");
    hours.querySelectorAll(".hour").forEach((hour) => {
        hour.classList.remove("selected");
    });
    e.target.classList.add("selected");
    selectedHour = formatHour(e.target.value);

    showSubmitButton();
}
function handleSubmitClick(e) {
    if (selectedDay != "" && selectedHour != "") {
        let reservationCount = parseInt(localStorage.getItem("reservationCount"));
        reservationCount += 1;
        localStorage.setItem("reservationCount", `${reservationCount}`);

        console.log(parseInt(localStorage.getItem("reservationCount")))
        if (parseInt(localStorage.getItem("reservationCount")) < reservationLimit) {
            // Saving to localStorage
            const reservations = JSON.parse(localStorage.getItem("reservations"));
            reservations.push({date: selectedDay, time: selectedHour})
            localStorage.setItem("reservations", JSON.stringify(reservations))

            // Saving to database
            const saveSuccessful = database.saveReservation(selectedDay, selectedHour);
            if (saveSuccessful) {
                calendar.querySelector(".hours").style.display = "none";
                const submitButton = document.querySelector("#book button.submit");
                submitButton.style.display = "none";
                setCalendarStatusText(`Appointment booked.`)
            }
        } else {
            setCalendarStatusText("Reservation count exceeded.")
        }
    } else {
        setCalendarStatusText("Select a date and a time");
    }
}
function handlePrevMonthClick(e) {
    calendar.querySelector(".hours").style.display = "none";
    setCurrentMonth(-1);
}
function handleNextMonthClick(e) {
    calendar.querySelector(".hours").style.display = "none";
    setCurrentMonth(1);
}

function setCalendarStatusText(text) {
    calendar.querySelector(".status").innerHTML = text
    calendar.querySelector(".status").style.display = text === "" ? "none" : "block";
    calendar.querySelector(".hours").style.visibility = text === "" ? "flex" : "none";
}

getDatabaseData();
setCurrentMonth(0);
