// "use client";

// import React, { useState } from "react";
// import { useInstagram } from "../contexts/InstagramContext";
// import axios from "axios";
// import toast from "react-hot-toast";

// export default function Page() {
//   const { posts } = useInstagram();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [caption, setCaption] = useState("");
//   const [isPosting, setIsPosting] = useState(false);
//   const [url, setUrl] = useState("");

//   // Handle file selection
//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   // Post image to Instagram
//   const handlePost = async () => {
//     if (!selectedFile) {
//       alert("Please select an image to upload.");
//       return;
//     }

//     setIsPosting(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", selectedFile);

//       // Upload the file to Cloudinary
//       const uploadResponse = await axios.post("/api/upload", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success(uploadResponse.data.imgUrl);
//       console.log(uploadResponse.data.imgUrl);
//       const imageUrl = uploadResponse.data.imgUrl; // Public URL of the uploaded image
//       console.log(imageUrl);

//       // Post the image to Instagram
//       const response = await axios.post("/api/instagram_post", {
//         imageUrl,
//         caption,
//       });

//       alert("Image posted successfully!");
//       console.log(response.data);
//     } catch (error) {
//       console.error("Error posting image:", error);
//       alert("Failed to post the image.");
//     } finally {
//       setIsPosting(false);
//       setSelectedFile(null);
//       setCaption("");
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
//         {url}
//       </h1>

//       {/* File Upload Section */}
//       <div className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-md mx-auto">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">
//           Upload a New Image
//         </h2>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
//         />
//         <input
//           type="text"
//           placeholder="Add a caption..."
//           value={caption}
//           onChange={(e) => setCaption(e.target.value)}
//           className="block w-full mt-4 p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={handlePost}
//           disabled={isPosting}
//           className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
//         >
//           {isPosting ? "Posting..." : "Post to Instagram"}
//         </button>
//       </div>

//       {/* Instagram Posts Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {posts.map((post) => (
//           <div
//             key={post.id}
//             className="relative group overflow-hidden rounded-lg shadow-lg bg-gray-100"
//           >
//             <img
//               src={post.media_url}
//               alt={post.caption || "Instagram post"}
//               className="w-full h-64 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
//             />
//             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//               <p className="text-white text-sm font-medium truncate">
//                 {post.caption || "No caption"}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React from "react";

export default function Page() {
  return <>page</>;
}
