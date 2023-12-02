const development = false;

const database = {
    getOpeningHours: async () => {
        const dRes = await fetch(
            development
                ? "http://localhost:8080/schedule/default"
                : "https://hair-salon-website-backend.onrender.com/schedule/default"
        );
        const dSchedule = await dRes.json();

        const eRes = await fetch(
            development
                ? "http://localhost:8080/schedule/exception"
                : "https://hair-salon-website-backend.onrender.com/schedule/exception"
        );
        const eSchedule = await eRes.json();

        return { default: dSchedule, exceptions: eSchedule };
    },
    getReservations: async (dayStr) => {
        const request = await fetch(
            development ? "http://localhost:8080/reservations" : "https://hair-salon-website-backend.onrender.com/reservations"
        );
        const data = await request.json();

        const reservations = [];
        data.forEach((reservation) => {
            if (reservation.date === dayStr) {
                reservations.push(reservation.time);
            }
        });
        console.log("reservations:", reservations);
        return reservations;
    },
    saveReservation: async (dayStr, hourStr) => {
        const reqBody = {
            date: dayStr,
            time: hourStr,
        };
        const request = await fetch(
            development ? "http://localhost:8080/reservations" : "https://hair-salon-website-backend.onrender.com/reservations",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reqBody),
            }
        );
        console.log("reqBody: ", reqBody);
    },
};

export default database;
