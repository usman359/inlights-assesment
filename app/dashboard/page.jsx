"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";

export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp,media_type&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN}`
        );
        const data = await response.json();

        if (data.error) {
          console.error("Error fetching posts:", data.error.message);
          return;
        }

        const postsData = data.data || [];
        setPosts(postsData);

        // Save posts to Supabase
        for (const post of postsData) {
          const { id, caption, media_url, media_type, timestamp } = post;

          const { error } = await supabase.from("posts").upsert({
            id, // Ensure `id` is the primary key in your `posts` table
            caption,
            media_url,
            media_type,
            timestamp,
          });

          if (error) {
            console.error("Error saving post to database:", error.message);
          } else {
            console.log("Post saved:", post);
          }
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!posts.length) {
    return <div>No posts available.</div>;
  }

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handlePost = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image to upload.");
      return;
    }

    setIsPosting(true);

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        // Upload the file to Cloudinary
        const uploadResponse = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imageUrl = uploadResponse.data.imgUrl;
        toast.success(
          `Image ${file.name} uploaded successfully to Cloudinary!`
        );

        // Post the image to Instagram
        await axios.post("/api/instagram_post", {
          imageUrl,
          caption,
        });

        toast.success(`Image ${file.name} posted to Instagram successfully!`);
      }
    } catch (error) {
      console.error("Error posting images:", error);
      toast.error("Failed to post the images.");
    } finally {
      setIsPosting(false);
      setSelectedFiles([]); // Reset selected files
      setCaption(""); // Reset caption

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the input value to clear displayed file names
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Your Instagram Posts
      </h1>
      <div className="p-4">
        {/* File Upload Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upload a New Image
          </h2>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
          <input
            type="text"
            placeholder="Add a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="block w-full mt-4 p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handlePost}
            disabled={isPosting}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isPosting ? "Posting..." : "Post to Instagram"}
          </button>
        </div>
      </div>
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
