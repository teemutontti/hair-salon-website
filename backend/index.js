const express = require("express");
const cors = require("cors");
const dbConnection = require("./database/connection");

const port = 8080;
const app = express();

app.use(cors());
app.use(express.static("./frontend/dist"));
app.use(express.json());

app.get("/reservations", async (req, res) => {
    try {
        const reservations = await dbConnection.getAllReservations();
        res.status(200).json(reservations);
    } catch (err) {
        console.error(err);
        res.status(500).json("Error: ", err);
    }
});

app.get("/schedule/default", async (req, res) => {
    try {
        const scehdule = await dbConnection.getDefaultSchedule();
        res.status(200).json(scehdule);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

app.get("/schedule/exception", async (req, res) => {
    try {
        const schedule = await dbConnection.getExceptionSchedule();
        res.status(200).json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

app.post("/reservations", async (req, res) => {
    console.log("req in index: ", req.body);
    try {
        const reservation = await dbConnection.saveReservation(req.body);
        res.status(201).json(reservation);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

app.listen(port, () => {
    console.log(`SERVER: Listening on port ${port}`);
}).on("error", (err) => {
    console.error("SERVER: Error starting server:", err);
    process.exit(1);
});
