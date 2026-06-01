from __future__ import annotations

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

TIME_SLOTS = [
    {"index": 0, "code": "P1", "time": "9:30-10:20", "half": "morning"},
    {"index": 1, "code": "P2", "time": "10:20-11:10", "half": "morning"},
    {"index": 2, "code": "P3", "time": "11:10-12:00", "half": "morning"},
    {"index": 3, "code": "P4", "time": "12:00-12:50", "half": "morning"},
    {"index": 4, "code": "P5", "time": "1:40-2:30", "half": "afternoon"},
    {"index": 5, "code": "P6", "time": "2:30-3:20", "half": "afternoon"},
    {"index": 6, "code": "P7", "time": "3:20-4:10", "half": "afternoon"},
    {"index": 7, "code": "P8", "time": "4:10-5:00", "half": "afternoon"},
]

LUNCH_BREAK = {
    "label": "Lunch Break",
    "time": "12:50-1:40 PM",
}

FREE_LABEL = "Free / Self Study"

