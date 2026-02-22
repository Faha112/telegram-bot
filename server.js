const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const DB_FILE = "courses.json";

function loadCourses() {
    if (!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveCourses(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get("/api/courses", (req, res) => {
    res.json(loadCourses());
});

app.post("/api/add-course", (req, res) => {
    const courses = loadCourses();
    courses.push(req.body);
    saveCourses(courses);
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT);
});