"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      if (!session?.accessToken) return;

      try {
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp,media_type&access_token=${session.accessToken}`
        );
        const data = await response.json();
        setPosts(data.data || []);
      } catch (error) {
        console.error("Error fetching Instagram posts:", error);
      }
    }

    fetchPosts();
  }, [session]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>You must be logged in to access this page.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to your dashboard!</h1>
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id}>
            <img src={post.media_url} alt={post.caption} />
            <p>{post.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
