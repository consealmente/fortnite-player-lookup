# Fortnite Player Lookup

A small, Vercel-ready Next.js app that opens Fortnite Tracker profiles from an Epic display name, Xbox gamertag, PlayStation ID, or Epic account ID.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy with GitHub and Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected framework as **Next.js** and select **Deploy**.

No environment variables are required.

## How lookup works

The app creates the official Fortnite Tracker profile URL for the selected identity type and opens it in a new browser tab:

- Epic: `/profile/all/{username}`
- Xbox: `/profile/all/xbl({gamertag})`
- PlayStation: `/profile/all/psn({username})`
- Account ID: `/profile/all/{accountId}`

This version does not scrape Tracker Network or use undocumented private APIs.
