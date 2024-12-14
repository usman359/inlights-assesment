import axios from "axios";

export async function POST(req) {
  try {
    // Parse the incoming request
    const { imageUrl, caption } = await req.json();
    console.log(imageUrl);
    console.log(caption);

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "Image URL is required" }), {
        status: 400,
      });
    }

    // Instagram Access Token (ensure this is a valid token with required permissions)
    const accessToken =
      "IGACDVB1ou9SZABZAE5QVldlSW5aZAzN1QXdPdEdfRkh4VFJydmZAtV1pwR1VES3RzbmVsN2ZA1dWtaSklOUDhQYnR0NmJlZAHZARSVF0amt5dHZAZAMzF2UzY0ZAHNRcjVOQmZAURFAzdGJlOTh6a0htSHlvMUJUdUNJdlpnMy14SnMzTU11TQZDZD";

    // Replace 'PAGE_ID' with your Facebook Page ID linked to the Instagram Business Account
    const pageId = "100004248753756";

    // Step 1: Get the Instagram Business Account ID
    const accountResponse = await axios.get(
      `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
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
