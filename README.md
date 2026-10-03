# Lash Dreams Portal — Inventory & Operations System

A full-stack web app for running a multi-location lash salon. Employees use it to request inventory, report lash fixes, sign up for trainings and send suggestions; admins use a dashboard to manage stock, staff, locations and requests, with SMS alerts sent to managers when new requests come in.

Built with **MongoDB, Express, React and Node (MERN)**.

---

## Features

### Employee portal (`/home`)
- **Inventory requests** — pick items to request; the location's manager gets a text alert.
- **Lash fixes** — log a lash fix for a client (original artist, description) and view your own fix history.
- **Trainings** — browse upcoming classes, sign up (capacity-limited), or request a training on a new topic.
- **Suggestions** — submit suggestions and see what others have suggested.
- **Supplies & issues** — request salon supplies or report client issues for your location.
- **Call receptionist** — one-click alert to the front desk.

### Admin dashboard (`/app`)
- **Overview** — counts of total / fulfilled / unfulfilled requests, employees and products.
- **Inventory** — add, edit and delete items; record incoming shipments to bump quantities.
- **Requests** — review and fulfil employee requests (fulfilling automatically decrements stock).
- **Employees** — register new users, edit roles/locations, remove users.
- **Locations** — add and remove salon locations.
- **Statistics** — request history by employee or salon-wide over a date range.
- **Lash fixes** — review fixes and record commission.
- **Trainings** — create classes, manage attendees, review training requests.
- **Supplies, Issues, Suggestions** — review and update status.

### Roles
Users have a `role` of either `employee` or `admin`. After login, employees are sent to `/home` and admins to `/app`.

---

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React 17, Redux + redux-thunk, React Router v5, Axios, Sass, react-datepicker, date-fns, Font Awesome |
| Backend | Node.js, Express 4, Passport (local strategy), cookie-session, bcryptjs |
| Database | MongoDB via Mongoose 5 |
| Notifications | SendGrid (emails sent to carrier email-to-SMS gateways) |
| Hosting | Heroku (`heroku-postbuild` script builds the client) |

---

## Project structure

```
.
├── index.js              # Express server entry point — wires up models, routes, auth
├── config/
│   ├── keys.js           # Picks dev or prod config based on NODE_ENV
│   ├── dev.js            # Local development settings (do not commit secrets)
│   └── prod.js           # Reads settings from environment variables
├── passport/setup.js     # Passport local strategy + session (de)serialization
├── models/               # Mongoose schemas
│   ├── Users.js  Inventory.js  Locations.js  Requests.js
│   ├── Lashfix.js  Training.js  TrainingRequests.js
│   └── Issues.js  Suggestions.js  SuppliesRequest.js
├── routes/               # Express route modules (one per feature)
└── client/               # Create React App frontend
    └── src/
        ├── actions/  reducers/        # Redux (auth state)
        ├── components/
        │   ├── App.js, LoginPage.js, ResetPassword.js
        │   ├── Dashboard/             # Admin pages
        │   ├── Employee/              # Employee pages
        │   └── Helpers/
        ├── styles/                    # SCSS partials
        └── setupProxy.js              # Proxies /api, /register, /dashboard → :4000 in dev
```

---

## Getting started

### Prerequisites
- Node.js (the app pins **14.15.5** in `package.json` `engines`) and npm
- A MongoDB database (e.g. MongoDB Atlas)
- A SendGrid account and API key with a verified sender

### 1. Install dependencies
```bash
npm install
npm install --prefix client
```

### 2. Configure
In development the server reads `config/dev.js`; in production (`NODE_ENV=production`) it reads environment variables via `config/prod.js`.

`config/dev.js` should export:
```js
module.exports = {
  MONGO_URI: "<your MongoDB connection string>",
  cookieKey: "<random string for signing session cookies>",
  emailUsername: "<bot email address>",
  emailPassword: "<bot email app password>",
  sendGrid: "<SendGrid API key>",
  alerts: {
    fromEmail: "<verified SendGrid sender address>",
    defaultNumber: "<10-digit number>@<carrier SMS gateway>",
    easternNumber: "<...>",
    suppliesNumber: "<...>",
    lashfixNumber: "<...>",
  },
};
```

Production environment variables:

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `COOKIE_KEY` | Secret used to sign session cookies |
| `EMAIL` | Bot email address |
| `EMAIL_PASSWORD` | Bot email password |
| `SENDGRID_API_KEY` | SendGrid API key |
| `ALERT_FROM_EMAIL` | Sender address for text alerts (must be verified in SendGrid) |
| `SMS_DEFAULT` | Gets inventory-request and receptionist alerts (all locations except Eastern) |
| `SMS_EASTERN` | Gets inventory-request and receptionist alerts for the Eastern location |
| `SMS_SUPPLIES` | Gets supply-request alerts |
| `SMS_LASHFIX` | Gets new lash-fix alerts |
| `PORT` | Server port (defaults to `4000`) |

> ⚠️ Keep `config/dev.js` out of version control — add it to `.gitignore`.

### 3. Run in development
```bash
npm run dev
```
This starts the API with nodemon on **http://localhost:4000** and the React dev server on **http://localhost:3000** together. API calls from the client are proxied to port 4000.

Other scripts:

| Command | What it does |
|---|---|
| `npm start` | Run the server with Node (production) |
| `npm run server` | Run only the API with nodemon |
| `npm run client` | Run only the React dev server |
| `npm run build --prefix client` | Build the frontend for production |

### 4. Create the first admin
There is no seed script. With the server running, create a location and an admin user directly:
```bash
curl -X POST http://localhost:4000/api/locations/add \
  -H "Content-Type: application/json" -d '{"name":"Main"}'

curl -X POST http://localhost:4000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"changeme","role":"admin","location":"<location _id>"}'
```
After that, more employees can be added from **Dashboard → Employees**.

---

## Deployment (Heroku)

1. Set the production environment variables above in the Heroku app's config vars.
2. Push to Heroku. The `heroku-postbuild` script installs client dependencies and runs `npm run build --prefix client`.
3. With `NODE_ENV=production`, Express serves `client/build` and falls back to `index.html` for client-side routes.

---

## API reference

All routes except login, register, current user, logout, `/api/dashboard`, `/api/callReceptionist`, `/api/employeeDashboard` and `/api/locations/add` require an authenticated session.

| Area | Method & path |
|---|---|
| **Auth** | `POST /api/login` · `POST /register` · `GET /api/current_user` · `GET /api/logout` |
| **Dashboard** | `GET /api/dashboard` · `POST /api/employeeDashboard` · `POST /api/callReceptionist` |
| **Employees** | `GET /api/employees` · `GET/PATCH/DELETE /api/employees/:id` |
| **Inventory** | `GET /api/inventory` · `POST /api/inventory/add` · `PATCH /api/inventory/shipment` · `GET/PATCH/DELETE /api/inventory/:id` |
| **Requests** | `GET /api/request` · `POST /api/request/add` · `PATCH/DELETE /api/request/:id` |
| **Locations** | `GET /api/locations` · `POST /api/locations/add` · `DELETE /api/locations/:id` |
| **Lash fixes** | `GET /api/allfixes` · `POST /api/lashfix` · `GET/POST /api/mylashfixes` · `POST /api/lashfix/add` · `PATCH/DELETE /api/lashfix/:id` |
| **Trainings** | `GET /api/trainings` · `POST /api/trainings/add` · `PATCH/DELETE /api/trainings/:id` |
| **Training requests** | `GET /api/trainings/requests` · `POST /api/training/request` · `PATCH /api/training/request/:id` |
| **Supplies** | `GET /api/supplies` · `POST /api/supplies/add` |
| **Issues** | `GET /api/issues` · `POST /api/issues` · `POST /api/issue/add` |
| **Suggestions** | `GET /api/suggestions` · `POST /api/suggestion/add` · `PATCH /api/suggestion/:id` |
| **Stats** | `POST /api/stats` (per employee) · `POST /api/salonstats` (all) — body: `{ start, end, employee? }` |

---

## Notifications

New requests, lash fixes, supply requests and receptionist calls send a short message through SendGrid to a carrier email-to-SMS address (for example `5551234567@tmomail.net`), so managers get a text. The recipients and sender are set in the `alerts` section of the config: `config/dev.js` locally, or the `SMS_*` and `ALERT_FROM_EMAIL` environment variables in production. Location-based routing (Eastern vs. everywhere else) lives in `routes/requestRoutes.js` and `routes/dashboardRoutes.js`.
