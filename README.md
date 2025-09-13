# User-tracking-system

Download and extract the project
Backend setup:

bash   cd backend
   npm install
   # Create .env file with database credentials

Database setup in phpMyAdmin:

Create a new database called web_analytics
Import the SQL schema (copy/paste the CREATE TABLE statements I provided)


Dashboard setup:

bash   cd dashboard
   npm install

Run both services:

Terminal 1: cd backend && npm run dev (runs on port 3001)
Terminal 2: cd dashboard && npm start (runs on port 3000)

Napraviti . env ako nije dostupan.
.env file for backend:
envPORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=web_analytics
The only requirements are:

Node.js 18+
MySQL running (WAMP/XAMPP/MAMP)
Chrome installed (for screenshot feature)

Once both servers are running:

Backend API: http://localhost:3001
Dashboard: http://localhost:3000

Trenutno je fiksno dodana test.html web stranica radi lakšeg pregleda i testiranje projekta. Otvoriti je ili pomoću http://127.0.0.1:5500/test.html ili preko liveServer exstenzije. 
