const development = false;

const database = {
    getData: async () => {
        // Opening hours (default)
        const dRes = await fetch("https://hair-salon-website-backend.onrender.com/schedule/default");
        const dSchedule = await dRes.json();
        localStorage.setItem("schedule_default", JSON.stringify(dSchedule));

        // Opening hours (exceptions)
        const eRes = await fetch("https://hair-salon-website-backend.onrender.com/schedule/exception");
        const eSchedule = await eRes.json();
        localStorage.setItem("schedule_exceptions", JSON.stringify(eSchedule));

        // Reservations
        const request = await fetch("https://hair-salon-website-backend.onrender.com/reservations");
        const reservations = await request.json();
        const formatted = reservations.map(reservation => {
            const hourSplit = reservation.start.split(":")
            return {   ...reservation,
                date: reservation.date.split("T")[0],
                start: hourSplit[0] + ":" + hourSplit[1]
            }
        })
        localStorage.setItem("reservations", JSON.stringify(formatted));
    },
    saveReservation: async (dayStr, hourStr) => {
        const request = await fetch("https://hair-salon-website-backend.onrender.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date: dayStr,
                time: hourStr,
            }),
        });
        return request;
    },
};

export default database;
