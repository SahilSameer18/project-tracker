📊 Project Tracker

A simple and intuitive project tracking web application to help you organize, manage, and monitor your tasks and projects efficiently.

🔗 Live Demo: https://project-tracker-rho-murex.vercel.app/

🔗 GitHub Repository: https://github.com/SahilSameer18/project-tracker

🚀 Features
🗂️ Create and manage projects
✅ Add, edit, and delete tasks
📈 Track project progress
🧾 Clean, responsive UI
⚡ Fast performance with Vite
🌐 Deployed on Vercel
🛠️ Tech Stack
Frontend: React + TypeScript
Build Tool: Vite
Styling: CSS
Deployment: Vercel
📦 Installation & Setup
1. Clone the repository
git clone https://github.com/SahilSameer18/project-tracker.git
2. Navigate into the project
cd project-tracker
3. Install dependencies
npm install
▶️ Running the App (Development)
npm run dev
The app will start on:
http://localhost:5173

⚠️ Vite typically runs on port 5173 by default. If that port is occupied, it may switch to another available port, which will be shown in the terminal.

🏗️ Production Build
npm run build

This generates an optimized production build in the dist/ folder.

Preview production build locally:
npm run preview
Preview server usually runs on:
http://localhost:4173
📜 Available Scripts
Script	Description
npm run dev	Start development server
npm run build	Build production-ready app
npm run preview	Preview production build locally
npm run lint	Run lint checks (if configured)
🌐 Environment Variables

If your project uses environment variables, create a .env file in the root:

VITE_API_URL=your_api_url_here

⚠️ Vite requires environment variables to be prefixed with VITE_.

🧾 Logging & Debugging
Logs appear directly in the browser console (DevTools → Console).
Use:
console.log() for general debugging
console.error() for error tracking
For network/API debugging, use the Network tab in browser DevTools.
Example:
console.log("Project data:", projectData);
console.error("Failed to fetch tasks");
⚙️ Port Configuration
Default dev port: 5173
Preview port: 4173

To manually specify a port:

npm run dev -- --port 3000

Development Notes
Ensure Node.js (v16 or higher recommended) is installed.
Use a modern browser (Chrome, Edge, Firefox) for best performance.
Hot Module Replacement (HMR) is enabled in development for fast updates.
ESLint/TypeScript errors (if enabled) will appear in the terminal and editor.
🚀 Deployment

This project is deployed on Vercel.

Push changes to the repository
Vercel automatically rebuilds and deploys the latest version
