import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function fetchInstagramPosts(accessToken) {
  const response = await fetch(
    `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp&access_token=${accessToken}`
  );

  const data = await response.json();
  console.log(data);
  return data.data;
}

export async function saveInstagramPosts(userId, posts) {
  const { data, error } = await supabase.from("instagram_posts").upsert(
    posts.map((post) => ({
      user_id: userId,
      instagram_id: post.id,
      media_url: post.media_url,
      caption: post.caption,
      media_type: post.media_type,
      timestamp: post.timestamp,
    }))
  );

  if (error) throw error;
  return data;
}

export async function uploadToInstagram(accessToken, imageUrl, caption) {
  console.log("Hello");
  // First, create container
  const containerResponse = await fetch(
    `https://graph.facebook.com/v18.0/me/media?image_url=${imageUrl}&caption=${caption}&access_token=${accessToken}`,
    { method: "POST" }
  );

  const { id } = await containerResponse.json();

  // Then publish
  const publishResponse = await fetch(
    `https://graph.facebook.com/v18.0/me/media_publish?creation_id=${id}&access_token=${accessToken}`,
    { method: "POST" }
  );

  return await publishResponse.json();
}
