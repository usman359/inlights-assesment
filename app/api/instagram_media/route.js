import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp&access_token=IGQWRNNVBLOURkXzNQNW1EQnVXZAUZAST2xNSldrOWotcHhEY2FLZAEt5eUprbHhvSmZA5MnlPWTdnbDVRRmh4VHNma2dpMDVhVjM5cVZAKaThLMHM2ZAUp0bXhsU1QwR1I3U2FMV0gzSnNXUmxWZAm10TE9lUTlUVFFFblEZD`
    );

    console.log(response.data.data);
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
