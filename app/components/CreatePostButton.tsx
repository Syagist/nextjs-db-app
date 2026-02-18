"use client";
import { useState } from "react";

export default function CreatePostButton({}: {}) {
  const [loading, setLoading] = useState(false);

  const createPost = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "My Post",
          content: "Hello World",
        }),
      });
      if (!res.ok) throw new Error("Failed to create post");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={createPost}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      {loading ? "Creating..." : "Create Mock Post"}
    </button>
  );
}
