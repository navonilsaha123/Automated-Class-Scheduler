# Automated-Class-Scheduler
**Automated Class Scheduler** is an intelligent timetable management system that automatically generates class schedules by assigning subjects, teachers, and classrooms while avoiding conflicts. It optimizes resource utilization, reduces manual effort, saves time, and ensures efficient academic planning for schools, colleges, and universities.

Here's a professional README you can directly paste into your GitHub repository:

# Automated Class Scheduler

An AI-powered timetable management system that automatically generates optimized class schedules for educational institutions. The system reduces manual effort, prevents scheduling conflicts, and efficiently allocates faculty, subjects, and classrooms.

## Features

* Automated timetable generation
* Faculty and subject management
* Classroom allocation
* Conflict detection and resolution
* Department-wise scheduling
* Timetable preview before generation
* Excel timetable export
* Modern React-based user interface
* FastAPI backend for efficient processing

## Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS

### Backend

* FastAPI
* Python

### Database

* MySQL

### Export & Processing

* OpenPyXL
* Pandas

---

## Project Structure

```text
Automated-Class-Scheduler/
│
├── frontend/
│   ├── src/
│   ├── dist/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── AI service/
│   └── Time table generator/
│       ├── app.py
│       ├── scheduler.py
│       ├── models.py
│       ├── storage.py
│       ├── excel_export.py
│       ├── constants.py
│       └── requirements.txt
│
├── database.sql
├── README.md
└── college-scheduler/
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/navonilsaha123/Automated-Class-Scheduler.git

cd Automated-Class-Scheduler
```

---

## Backend Setup

Navigate to backend directory:

```bash
cd "AI service/Time table generator"
```

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI server:

```bash
uvicorn app:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

API Documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Navigate to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Database Setup

Import the SQL file into MySQL:

```sql
SOURCE database.sql;
```

Or import using MySQL Workbench.

Update database credentials according to your local configuration.

---

## Workflow

1. Add institute information.
2. Configure departments and semesters.
3. Enter faculty details.
4. Assign subjects and workloads.
5. Generate timetable automatically.
6. Preview generated schedule.
7. Export timetable as Excel file.

---

## Key Benefits

* Eliminates manual timetable preparation.
* Prevents teacher and classroom conflicts.
* Saves administrative time.
* Improves resource utilization.
* Generates schedules within seconds.
* Easy modification and regeneration.

---

## Future Enhancements

* Student portal
* Faculty login system
* Attendance integration
* AI-based timetable optimization
* Notification system
* Cloud deployment
* Multi-campus support


## Contributors

* Navonil Saha
* Team Euphoria GenX

---

## License

This project is developed for academic and educational purposes.

---

⭐ If you found this project useful, consider giving it a star on GitHub!
