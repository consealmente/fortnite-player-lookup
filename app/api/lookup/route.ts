import { NextRequest, NextResponse } from "next/server";

const allowedPlatforms = new Set(["epic", "xbl", "psn", "account"]);

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const platform = request.nextUrl.searchParams.get("platform") ?? "epic";

  if (!query || query.length > 64 || !allowedPlatforms.has(platform)) {
    return NextResponse.json({ error: "Enter a valid player name or account ID." }, { status: 400 });
  }

  const apiKey = process.env.FORTNITE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Player data is not configured yet. Add FORTNITE_API_KEY in Vercel." },
      { status: 503 },
    );
  }

  const endpoint = platform === "account"
    ? `https://fortnite-api.com/v2/stats/br/v2/${encodeURIComponent(query)}?timeWindow=lifetime&image=none`
    : `https://fortnite-api.com/v2/stats/br/v2?name=${encodeURIComponent(query)}&accountType=${platform}&timeWindow=lifetime&image=none`;

  try {
    const response = await fetch(endpoint, {
      headers: { Authorization: apiKey },
      cache: "no-store",
    });
    const payload = await response.json();

    if (!response.ok) {
      const message = response.status === 404
        ? "No public Fortnite profile was found for that player."
        : payload?.error ?? "The player service could not complete this search.";
      return NextResponse.json({ error: message }, { status: response.status });
    }

    return NextResponse.json({ data: payload.data, source: "Fortnite-API" });
  } catch {
    return NextResponse.json({ error: "The player service is temporarily unavailable." }, { status: 502 });
  }
}
