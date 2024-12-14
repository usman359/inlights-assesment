import axios from "axios";

export async function POST(req) {
  try {
    // Parse the incoming request
    const { imageUrl, caption } = await req.json();
    console.log(imageUrl);
    // console.log(caption);

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "Image URL is required" }), {
        status: 400,
      });
    }

    // Instagram Access Token (ensure this is a valid token with required permissions)
    const accessToken =
      "IGQWRNNVBLOURkXzNQNW1EQnVXZAUZAST2xNSldrOWotcHhEY2FLZAEt5eUprbHhvSmZA5MnlPWTdnbDVRRmh4VHNma2dpMDVhVjM5cVZAKaThLMHM2ZAUp0bXhsU1QwR1I3U2FMV0gzSnNXUmxWZAm10TE9lUTlUVFFFblEZD";

    // Replace 'PAGE_ID' with your Facebook Page ID linked to the Instagram Business Account
    const pageId = "3006205006197762";

    // Step 1: Get the Instagram Business Account ID
    const accountResponse = await axios.get(
      `https://graph.facebook.com/v17.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
    );

    const instagramAccountId =
      accountResponse.data.instagram_business_account?.id;

    if (!instagramAccountId) {
      throw new Error("Failed to retrieve Instagram Business Account ID");
    }

    // Step 2: Create a media object
    const mediaResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${instagramAccountId}/media`,
      {
        image_url: imageUrl,
        caption,
      },
      {
        params: {
          access_token: accessToken,
        },
      }
    );

    if (!mediaResponse.data.id) {
      throw new Error("Failed to create media object");
    }

    const mediaId = mediaResponse.data.id;

    // Step 3: Publish the media object
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${instagramAccountId}/media_publish`,
      {
        creation_id: mediaId,
      },
      {
        params: {
          access_token: accessToken,
        },
      }
    );

    if (!publishResponse.data.id) {
      throw new Error("Failed to publish media object");
    }

    return new Response(JSON.stringify(publishResponse.data), { status: 200 });
  } catch (error) {
    console.error(
      "Error posting to Instagram:",
      error.response?.data || error.message
    );
    return new Response(
      JSON.stringify({
        error: error.response?.data || error.message,
        message: "Failed to post to Instagram",
      }),
      { status: 500 }
    );
  }
}
