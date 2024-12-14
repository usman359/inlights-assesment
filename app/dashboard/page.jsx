"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession(); // Access session data and status
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  sessionStorage.setItem("session", JSON.stringify(session));

  // Redirect unauthenticated users to login (optional)
  useEffect(() => {
    if (status === "unauthenticated") {
      alert("You are not authenticated. Redirecting to login...");
      window.location.href = "/login";
    }
  }, [status]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!session?.accessToken) {
        console.log("Access token not available yet.");
        return;
      }

      alert(`Session: ${JSON.stringify(session)}`);
      alert(`Access Token: ${session.accessToken}`);

      setLoading(true);
      try {
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp,media_type&access_token=${session.accessToken}`
        );
        const data = await response.json();

        if (data.error) {
          console.error("Error fetching posts:", data.error.message);
          return;
        }

        setPosts(data.data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchPosts();
    }
  }, [session, status]);

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  if (!posts.length) {
    return <div>No posts available.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Your Instagram Posts</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {posts.map((post) => (
          <div key={post.id} className="border rounded p-2">
            {post.media_type === "IMAGE" ||
            post.media_type === "CAROUSEL_ALBUM" ? (
              <img
                src={post.media_url}
                alt={post.caption || "Instagram Post"}
                className="w-full h-auto"
              />
            ) : (
              <video controls src={post.media_url} className="w-full h-auto" />
            )}
            <p className="mt-2 text-sm text-gray-700">{post.caption}</p>
            <p className="text-xs text-gray-500">
              Posted on: {new Date(post.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}