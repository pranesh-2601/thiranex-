# 🚀 Personal Portfolio — Full Stack

A production-grade personal portfolio built with **Node.js/Express**, **MongoDB**, and vanilla **HTML/CSS/JS**. Features a stunning dark editorial design, project CMS via REST API, and a contact form with email notifications.

---

## 📁 Project Structure

```
portfolio/
├── frontend/               # Static frontend
│   ├── index.html          # Main HTML
│   ├── css/
│   │   └── style.css       # Full CSS (dark editorial design)
│   └── js/
│       └── main.js         # JS: API calls, animations, interactions
│
├── backend/                # Node.js/Express API
│   ├── server.js           # Express app entry point
│   ├── config/
│   │   └── database.js     # MongoDB connection
│   ├── models/
│   │   ├── Project.js      # Project schema (Mongoose)
│   │   └── Message.js      # Contact message schema
│   └── routes/
│       ├── projects.js     # CRUD endpoints for projects
│       └── contact.js      # Contact form endpoint
│
├── scripts/
│   └── seed.js             # Database seeder with 6 sample projects
│
├── .env.example            # Environment variables template
├── package.json
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local) OR [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud, free tier)

### 2. Install dependencies

```bash
cd portfolio
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your values:
# - MONGODB_URI: your MongoDB connection string
# - EMAIL_USER / EMAIL_PASS: for contact form emails (optional)
```

### 4. Seed the database

```bash
npm run setup-db
```

### 5. Start the server

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

### 6. Open your browser

```
http://localhost:3000
```

---

## 🌐 API Endpoints

| Method | Endpoint              | Description                   |
|--------|-----------------------|-------------------------------|
| GET    | `/api/projects`       | Get all projects               |
| GET    | `/api/projects?category=web` | Filter by category    |
| GET    | `/api/projects?featured=true` | Featured only        |
| GET    | `/api/projects/:id`   | Get single project             |
| POST   | `/api/projects`       | Create project                 |
| PUT    | `/api/projects/:id`   | Update project                 |
| DELETE | `/api/projects/:id`   | Delete project                 |
| POST   | `/api/contact`        | Submit contact form            |
| GET    | `/api/contact`        | View all messages (admin)      |
| GET    | `/api/health`         | Server health check            |

### Example: Add a project via API

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Project",
    "description": "A short description",
    "techStack": ["React", "Node.js"],
    "category": "web",
    "liveUrl": "https://myproject.com",
    "githubUrl": "https://github.com/you/project",
    "featured": true
  }'
```

---

## 🚀 Deployment

### Vercel (Recommended — Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set environment variables in Vercel dashboard
4. Deploy! Vercel handles everything automatically.

```json
// vercel.json (add to root)
{
  "version": 2,
  "builds": [{ "src": "backend/server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "backend/server.js" }]
}
```

### Render (Free tier available)

1. Push to GitHub
2. [render.com](https://render.com) → New Web Service → Connect repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables

### Railway

```bash
npm install -g @railway/cli
railway init
railway up
```

### MongoDB Atlas (Free Cloud Database)

1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Get connection string → add to `.env` as `MONGODB_URI`

---

## 🎨 Customization

### Update your info

Edit `frontend/index.html`:
- Change `Alex Morgan` to your name
- Update the hero description
- Edit skills, timeline, and social links
- Update contact email

### Add/Edit projects

Either use the API (see above) or edit `scripts/seed.js` and re-run `npm run setup-db`.

### Styling

All CSS variables are in `frontend/css/style.css` under `:root`. Key ones:
```css
--accent: #e8c547;     /* Yellow accent color */
--bg: #0a0a0a;         /* Background */
--text: #f0ece4;       /* Main text */
```

---

## 🔒 Production Checklist

- [ ] Set `NODE_ENV=production` in environment
- [ ] Use MongoDB Atlas instead of local MongoDB
- [ ] Add authentication to admin API routes
- [ ] Set up HTTPS (handled by Vercel/Render automatically)
- [ ] Configure proper CORS origins
- [ ] Add `express-rate-limit` for API protection
- [ ] Set up error monitoring (Sentry)

---

## 🛠 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JS       |
| Backend    | Node.js, Express.js           |
| Database   | MongoDB + Mongoose ODM        |
| Email      | Nodemailer (Gmail / SMTP)     |
| Hosting    | Vercel / Render / Railway     |
| DB Hosting | MongoDB Atlas                 |

---

Built with ♥ — Customize it and make it yours!
