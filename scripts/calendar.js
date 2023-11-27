import database from "./database.js";

const calendar = document.querySelector(".calendar")
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
    11: "December"
}
const weekdays = {
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
    0: "sunday"
}
const date = new Date()
const currentDay = date.getDate()
const currentMonth = date.getMonth()
const currentYear = date.getFullYear()
const currentWeekDay = date.getDay()
const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

console.log('Current Date:', date);
console.log('Current Day:', currentDay);
console.log('Current Month:', currentMonth + 1); // Adding 1 to match human-readable month numbering
console.log('Current Year:', currentYear);
console.log('Current Weekday:', currentWeekDay, weekdays[currentWeekDay]); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
console.log('Days in Current Month:', daysInCurrentMonth);
console.log('First Day of Month:', firstDayOfMonth, weekdays[firstDayOfMonth]);

function changeCurrentMonth() {
    console.log()
}

function handleDayClick(e) {
    console.log("Clicked day: ", e.target.value, "month: ", currentMonth, "year: ", currentYear)
    showHours(e.target.value, currentMonth, currentYear)
}

function handleHourClick(e) {
    console.log("hour clicked", e.target.value)
}

function formatHour(hour) {
    if (hour < 10) {
        return `0${hour}:00`
    } else {
        return `${hour}:00`
    }
}

async function showHours(day, month, year) {
    const hours = calendar.querySelector("ul.hours")

    const openingHours = await database.getOpeningHours(day, month, year);

    let [start, end] = []
    const dayString = `${year}-${month+1}-${day}`

    // Check if there are exception opening hours for the day
    // if not use default hours
    if (dayString in openingHours.exceptions) {
        start = openingHours.exceptions[dayString].start
        end = openingHours.exceptions[dayString].end
    } else {
        const dayNumber = new Date(year, month, day).getDay()
        const weekdayStr = weekdays[dayNumber]
        start = openingHours.default[weekdayStr].start
        end = openingHours.default[weekdayStr].end
    }

    hours.innerHTML = "";
    const reservations = await database.getReservations(dayString)
    const heading = document.createElement("h1")
    heading.innerHTML = "Select time"
    hours.append(heading)
    for (let i = parseInt(start); i<parseInt(end); i++) {

        // Create new element with the hours
        const newHourItem = document.createElement("li")
        const newHourButton = document.createElement("button")
        newHourButton.innerHTML = `${i}:00 - ${i+1}:00`
        newHourButton.value = i

        // Add class names, add "reserved" tag if reserved
        newHourItem.classList.add("hour")
        if (reservations != null) {
            const hour = formatHour(i);
            if (reservations.includes(hour)) {
                newHourButton.classList.add("reserved")
                newHourItem.classList.add("reserved")
            }
        }
        newHourButton.addEventListener("click", handleHourClick)
        newHourItem.append(newHourButton)
        hours.append(newHourItem)
    }
    hours.style.display = "block";
}

function setDays() {
    const days = calendar.querySelector("ul.days")
    let [row, col] = [2, firstDayOfMonth]

    for (let i=0; i<daysInCurrentMonth; i++) {
        const newDayItem = document.createElement("li")
        newDayItem.innerHTML = i+1
        newDayItem.value = i+1
        newDayItem.classList.add("day")

        // Setting the days to match weekdays
        newDayItem.style.gridRow = `${row} / ${row+1}`
        newDayItem.style.gridColumn= `${col} / ${col+1}`
        newDayItem.addEventListener("click", handleDayClick)

        if (col === 7) {
            col = 1
            row += 1
        } else {
            col += 1
        }
        days.append(newDayItem)
    }
}

function setMonth() {
    const month = calendar.querySelector("ul.month")
    const current = month.querySelector("li.current")
    current.innerHTML = months[currentMonth]
}

function formCalendar() {
    setMonth()
    setDays()
}

formCalendar()
showHours(currentYear, currentMonth, currentDay) // FOR DEVELOPMENT
