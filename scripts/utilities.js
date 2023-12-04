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
function formatHour(hour) {
    if (hour < 10) {
        return `0${hour}:00`;
    } else {
        return `${hour}:00`;
    }
}
function formatDate(date) {
    const splitDate = date.split("-");
    if (splitDate[1].length < 2) {
        splitDate[1] = "0" + splitDate[1];
    }
    if (splitDate[2].length < 2) {
        splitDate[2] = "0" + splitDate[2];
    }
    return splitDate.join("-");
}
const reservationLimit = 3;

export {weekdays, months, formatDate, formatHour, reservationLimit};