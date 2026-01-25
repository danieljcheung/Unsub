# Unsub

A client-side Gmail mass unsubscribe tool. Scan your inbox for newsletters and marketing emails, then unsubscribe from them in bulk.

## Features

- **100% Client-Side** - Your data never leaves your browser. No backend, no tracking.
- **Gmail API Integration** - Securely connects via Google OAuth (read-only access)
- **Smart Detection** - Finds emails with `List-Unsubscribe` headers
- **Bulk Actions** - Select multiple senders and unsubscribe in one click
- **Sender Logos** - Automatically fetches company logos for easy identification
- **Satisfying Animations** - Smooth Framer Motion animations as you clean up your inbox

## Tech Stack

- React (Vite)
- Tailwind CSS v4
- Framer Motion
- Google Identity Services + Gmail API

## Getting Started

### 1. Set up Google Cloud OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Enable the **Gmail API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set application type to **Web application**
6. Add `http://localhost:5173` to **Authorized JavaScript origins**
7. Copy the Client ID

### 2. Run the app

```bash
npm install
npm run dev
```

### 3. Configure

Either:
- Enter your Client ID in the UI when prompted, or
- Create a `.env` file with `VITE_GOOGLE_CLIENT_ID=your-client-id`

## How It Works

1. Sign in with your Google account (only `gmail.readonly` scope is requested)
2. The app scans your inbox for emails containing "unsubscribe"
3. It parses the `List-Unsubscribe` header from each email
4. Emails are grouped by sender and displayed in a grid
5. Select the senders you want to unsubscribe from
6. Click the big red button - each unsubscribe link opens in a new tab

## License

MIT
