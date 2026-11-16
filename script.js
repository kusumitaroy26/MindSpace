// MindSpace - Mental Wellness Tracker & Journal

// Load saved data from browser storage
let moodRecords = JSON.parse(localStorage.getItem("moodRecords")) || [];
let journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];

// Function to select and save mood
function selectMood(mood) {
    const today = new Date().toLocaleDateString();

    const moodRecord = {
        mood: mood,
        date: today
    };

    moodRecords.push(moodRecord);

    localStorage.setItem("moodRecords", JSON.stringify(moodRecords));

    document.getElementById("selectedMood").textContent =
        "Your selected mood today is: " + mood;

    displayMoodHistory();
}

// Function to display mood history
function displayMoodHistory() {
    const history = document.getElementById("moodHistory");

    history.innerHTML = "";

    moodRecords.forEach(function(record) {
        const item = document.createElement("p");

        item.textContent = record.date + " - " + record.mood;

        history.appendChild(item);
    });
}

// Function to save journal entry
function saveEntry() {
    const entryBox = document.getElementById("journalEntry");

    const entryText = entryBox.value.trim();

    if (entryText === "") {
        alert("Please write something before saving!");
        return;
    }

    const entry = {
        text: entryText,
        date: new Date().toLocaleDateString()
    };

    journalEntries.push(entry);

    localStorage.setItem("journalEntries", JSON.stringify(journalEntries));

    entryBox.value = "";

    displayJournalEntries();

    alert("Your journal entry has been saved!");
}

// Function to display journal entries
function displayJournalEntries() {
    const container = document.getElementById("journalEntries");

    container.innerHTML = "";

    journalEntries.forEach(function(entry) {
        const item = document.createElement("div");

        const date = document.createElement("p");
        date.textContent = entry.date;

        const content = document.createElement("p");
        content.textContent = entry.text;

        item.appendChild(date);
        item.appendChild(content);

        container.appendChild(item);
    });
}

// Display saved information when website opens
displayMoodHistory();
displayJournalEntries();

// Function to clear saved MindSpace data
function clearAllData() {

    const confirmation = confirm(
        "Are you sure you want to delete all your saved mood records and journal entries?"
    );

    if (confirmation) {

        moodRecords = [];
        journalEntries = [];

        localStorage.removeItem("moodRecords");
        localStorage.removeItem("journalEntries");

        document.getElementById("selectedMood").textContent =
            "Your mood will appear here.";

        displayMoodHistory();
        displayJournalEntries();

        alert("Your MindSpace data has been cleared successfully!");
    }
}

// Daily Reflection Questions

const reflectionQuestions = [
    "What made you smile today?",
    "What is one thing you are grateful for?",
    "What did you learn about yourself today?",
    "What helped you feel calm today?",
    "What is one positive thing you did today?",
    "What would you like to improve tomorrow?",
    "What is something you are looking forward to?"
];

// Function to show a new reflection question
function newReflectionQuestion() {

    const randomIndex = Math.floor(
        Math.random() * reflectionQuestions.length
    );

    document.getElementById("reflectionQuestion").textContent =
        reflectionQuestions[randomIndex];
}


// Weekly Mood Summary

function updateWeeklySummary() {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const moodCounts = {
        Happy: 0,
        Calm: 0,
        Okay: 0,
        Stressed: 0,
        Sad: 0
    };

    let total = 0;

    moodRecords.forEach(function(record) {

        let recordDate;

        if (record.timestamp) {
            recordDate = new Date(record.timestamp);
        } else {
            recordDate = new Date(record.date);

            // Handle older dates written as DD/MM/YYYY
            if (isNaN(recordDate.getTime())) {
                const parts = record.date.split(/[\/.-]/).map(Number);

                if (parts.length === 3) {
                    let day = parts[0];
                    let month = parts[1];

                    if (parts[0] <= 12 && parts[1] > 12) {
                        month = parts[0];
                        day = parts[1];
                    }

                    recordDate = new Date(parts[2], month - 1, day);
                }
            }
        }

        if (!isNaN(recordDate.getTime())) {

            recordDate.setHours(0, 0, 0, 0);

            if (recordDate >= sevenDaysAgo && recordDate <= today) {

                if (moodCounts[record.mood] !== undefined) {
                    moodCounts[record.mood]++;
                    total++;
                }
            }
        }
    });

    document.getElementById("weeklyTotal").textContent = total;

    const chart = document.getElementById("weeklyMoodChart");

    chart.innerHTML = "";

    Object.keys(moodCounts).forEach(function(mood) {

        const count = moodCounts[mood];

        const percentage = total > 0
            ? (count / total) * 100
            : 0;

        const item = document.createElement("div");

        item.style.margin = "15px 0";
        const moodName = document.createElement("p");
        moodName.txtContent = mood + ": " + count;
        const barBackground = document.createElement("div");
        item.innerHTML =
            "<p>" + mood + ": " + count + "</p>" +
            "<div style='background:#E8E0F2; height:12px; border-radius:10px; overflow:hidden;'>" +
            "<div style='background:#A68ACB; width:" + percentage +
            "%; height:12px; border-radius:10px;'></div></div>";
        const bar = document.createElement("div");
        bar.style.backgroundColor = "#A68ACB";
        bar.style.width = percentage + "%";
        bar.style.borderRadius = "10px";
        barBackground.appendChild(bar);
        item.appendChild(moodName);
        item.appendChild(barBackground);
        chart.appendChild(item);
    });
}

displayMoodHistory();
displayJournalEntries();
displayWeeklysummary();

function toggleMenu() {
    const menu = document.getElementById("menuOptions");
    menu.classList.toggle("show");
}