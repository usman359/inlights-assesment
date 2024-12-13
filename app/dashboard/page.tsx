"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  media_url: string;
  caption: string;
}

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/instagram/posts", {
      headers: {
        authorization: "your-access-token", // Replace with actual token
      },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data.data || []));
  }, []);

  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {posts.map((post) => (
        <div key={post.id} className="border p-2 rounded">
          <Image
            src={post.media_url}
            alt={post.caption}
            className="w-full h-auto"
          />
          <p>{post.caption}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
