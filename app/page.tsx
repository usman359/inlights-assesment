"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useInstagram } from "./contexts/InstagramContext";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { setPosts } = useInstagram();
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get("/api/instagram_media");
        console.log(response.data.data);
        setPosts(response.data.data || []);
      } catch (error) {
        console.error("Error fetching Instagram media:", error);
      }
    }

    fetchPosts();
  }, [setPosts]); // Add dependency array

  return (
    <div>
      <button onClick={() => router.push("/posts")}>Go to posts</button>
    </div>
  );
}
