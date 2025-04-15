import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "scheduleData.json");

function readSchedule() {
    const data = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(data);
}

function writeSchedule(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

// GET órarend
app.get("/api/schedule", (req, res) => {
    const schedule = readSchedule();
    res.json(schedule);
});

// POST új óra hozzáadása
app.post("/api/schedule", (req, res) => {
    const newLesson = req.body;
    const schedule = readSchedule();

    schedule.push(newLesson);
    writeSchedule(schedule);

    res.status(201).json({ message: "Óra hozzáadva!" });
});

// DELETE óra törlése
app.delete("/api/schedule", (req, res) => {
    const { day, hour } = req.body;
    let schedule = readSchedule();

    schedule = schedule.filter(item => !(item.day === day && item.hour === hour));
    writeSchedule(schedule);

    res.json({ message: "Óra törölve!" });
});

app.listen(PORT, () => {
    console.log(`Szerver fut a http://localhost:${PORT} címen`);
});

// PUT - óra szerkesztése
app.put("/api/schedule", (req, res) => {
    const { day, hour, subject } = req.body;
    const schedule = readSchedule();

    const index = schedule.findIndex(item => item.day === day && item.hour === hour);

    if (index !== -1) {
        schedule[index].subject = subject;
        writeSchedule(schedule);
        res.json({ message: "Óra frissítve!" });
    } else {
        res.status(404).json({ message: "Óra nem található!" });
    }
});