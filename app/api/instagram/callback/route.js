import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { code } = await req.json();
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/instagram/callback`;

  try {
    const response = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      })
    );
    return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 500 }
    );
  }
}
