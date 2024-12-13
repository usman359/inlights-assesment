"use client";

const InstagramLink = () => {
  const handleLinkInstagram = () => {
    window.location.href = "/api/instagram/auth";
  };

  return (
    <button
      onClick={handleLinkInstagram}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Link Instagram
    </button>
  );
};

export default InstagramLink;
