# Fortnite Player Lookup

A Vercel-ready Next.js app that displays public Fortnite player statistics from an Epic display name, Xbox gamertag, PlayStation ID, or Epic account ID.

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

Add this environment variable in Vercel before deploying:

```text
FORTNITE_API_KEY=your_key_from_dash.fortnite-api.com
```

## Data provider

The backend calls Fortnite-API's documented BR Stats endpoint. API credentials stay on the server and are never sent to the browser. The provider supports `epic`, `xbl`, and `psn` account types plus direct Epic account IDs.
