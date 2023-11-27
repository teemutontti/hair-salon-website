const database = {
    getOpeningHours: async (day, month, year) => {
        const request = await fetch("../data/opening-hours.json");
        const data = await request.json();
        return data;
    },
    getReservations: async (dayStr) => {
        const request = await fetch("../data/reservations.json");
        const data = await request.json();
        if (data[dayStr]) {
            return data[dayStr];
        }
        return null;
    }
};

export default database;