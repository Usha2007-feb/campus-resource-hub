import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ Safe API URL (production + local)
const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

function AddResource() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/api/resources`,
        { title, description, category, link },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Resource added successfully 🎉");

      // clear form
      setTitle("");
      setDescription("");
      setCategory("");
      setLink("");

      // redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to add resource");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent2">
      <div className="w-[380px] bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-primary text-center mb-4">
          Add New Resource
        </h1>

        {message && (
          <p className="text-center text-sm mb-3 text-primary">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full mb-3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full mb-3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
          />

          <input
            type="text"
            placeholder="Category (Academics, Placements, etc.)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full mb-3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
          />

          <input
            type="url"
            placeholder="Resource Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
            className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
          />

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition"
          >
            Add Resource
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddResource;
