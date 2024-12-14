"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [url, setUrl] = useState("");

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

        setPosts(data.data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!posts.length) {
    return <div>No posts available.</div>;
  }

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Post image to Instagram
  const handlePost = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    setIsPosting(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Upload the file to Cloudinary
      const uploadResponse = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(uploadResponse.data.imgUrl);
      console.log(uploadResponse.data.imgUrl);
      const imageUrl = uploadResponse.data.imgUrl; // Public URL of the uploaded image
      console.log(imageUrl);

      // Post the image to Instagram
      const response = await axios.post("/api/instagram_post", {
        imageUrl,
        caption,
      });

      alert("Image posted successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error posting image:", error);
      alert("Failed to post the image.");
    } finally {
      setIsPosting(false);
      setSelectedFile(null);
      setCaption("");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Your Instagram Posts</h1>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          {url}
        </h1>

        {/* File Upload Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upload a New Image
          </h2>
          <input
            type="file"
            accept="image/*"
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
