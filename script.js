// Get saved data
let students = JSON.parse(localStorage.getItem("students")) || [];
let records = JSON.parse(localStorage.getItem("records")) || [];

let attendance = {};

// Add student
function addStudent() {
    let name = document.getElementById("studentName").value.trim();

    if (name == "") {
        alert("Please enter student name");
        return;
    }

    let student = {
        id: Date.now(),
        name: name
    };

    students.push(student);
    attendance[student.id] = "Present";

    document.getElementById("studentName").value = "";

    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
}

// Mark student present or absent
function markPresent(id) {
    attendance[id] = "Present";
    displayStudents();
}

function markAbsent(id) {
    attendance[id] = "Absent";
    displayStudents();
}

// Calculate attendance percentage
function calculateAttendance(id) {
    let totalDays = 0;
    let presentDays = 0;

    for (let i = 0; i < records.length; i++) {
        if (records[i].attendance[id] != undefined) {
            totalDays++;

            if (records[i].attendance[id] == "Present") {
                presentDays++;
            }
        }
    }

    if (totalDays == 0) {
        return 0;
    }

    return ((presentDays / totalDays) * 100).toFixed(2);
}

// Save attendance
function saveAttendance() {
    let date = new Date().toLocaleDateString();

    if (students.length == 0) {
        alert("Please add students first");
        return;
    }

    for (let i = 0; i < records.length; i++) {
        if (records[i].date == date) {
            alert("Attendance already saved today");
            return;
        }
    }

    let newRecord = {
        date: date,
        attendance: {...attendance}
    };

    records.push(newRecord);

    localStorage.setItem("records", JSON.stringify(records));
    displayStudents();

    alert("Attendance saved successfully");
}

// Display students
function displayStudents() {
    let list = document.getElementById("studentList");
    list.innerHTML = "";

    let presentCount = 0;
    let absentCount = 0;

    for (let i = 0; i < students.length; i++) {
        let id = students[i].id;
        let name = students[i].name;
        let status = attendance[id] || "Absent";

        if (status == "Present") {
            presentCount++;
        } else {
            absentCount++;
        }

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${name}</td>
            <td>${status}</td>
            <td>${calculateAttendance(id)}%</td>
            <td>
                <button onclick="markPresent(${id})">Present</button>
                <button onclick="markAbsent(${id})">Absent</button>
            </td>
        `;

        list.appendChild(row);
    }

    document.getElementById("total").innerHTML = students.length;
    document.getElementById("present").innerHTML = presentCount;
    document.getElementById("absent").innerHTML = absentCount;

    showHistory();
}

// Show previous records
function showHistory() {
    let history = document.getElementById("history");
    history.innerHTML = "";

    for (let i = 0; i < records.length; i++) {
        let p = document.createElement("p");
        let presentCount = 0;

        for (let id in records[i].attendance) {
            if (records[i].attendance[id] == "Present") {
                presentCount++;
            }
        }

        p.innerHTML = records[i].date + " - Present: " + presentCount;
        history.appendChild(p);
    }
}

// Load saved attendance
let today = new Date().toLocaleDateString();
let found = false;

for (let i = 0; i < records.length; i++) {
    if (records[i].date == today) {
        attendance = records[i].attendance;
        found = true;
    }
}

if (!found) {
    for (let i = 0; i < students.length; i++) {
        attendance[students[i].id] = "Present";
    }
}

displayStudents();
