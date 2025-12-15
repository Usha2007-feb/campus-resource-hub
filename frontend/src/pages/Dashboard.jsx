import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ SAFE API URL (production + local fallback)
const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    link: "",
  });

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  /* ================= FETCH RESOURCES ================= */
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/resources`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResources(res.data);
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchResources();
  }, [token]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;

    try {
      await axios.delete(`${API_URL}/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Failed to delete resource");
    }
  };

  /* ================= EDIT ================= */
  const startEdit = (r) => {
    setEditingId(r._id);
    setEditForm({
      title: r.title,
      description: r.description,
      category: r.category,
      link: r.link,
    });
  };

  const saveEdit = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/api/resources/${editingId}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResources((prev) =>
        prev.map((r) => (r._id === editingId ? res.data : r))
      );
      setEditingId(null);
    } catch {
      alert("Update failed");
    }
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredResources = resources.filter((r) => {
    const matchCategory =
      selectedCategory === "All" ||
      r.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;
  });

  /* ================= STATS ================= */
  const stats = {
    total: resources.length,
    academics: resources.filter((r) => r.category === "Academics").length,
    placements: resources.filter((r) => r.category === "Placements").length,
    wellbeing: resources.filter((r) => r.category === "Wellbeing").length,
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center bg-white p-4 rounded-xl shadow mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Campus Resource Hub
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/add-resource")}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            + Add Resource
          </button>
          <button
            onClick={handleLogout}
            className="bg-accent2 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Academics" value={stats.academics} />
        <StatCard label="Placements" value={stats.placements} />
        <StatCard label="Wellbeing" value={stats.wellbeing} />
      </div>

      {/* SEARCH + FILTER */}
      <div className="max-w-6xl mx-auto flex justify-end gap-3 mb-6">
        <input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded-lg w-64"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option>All</option>
          <option>Academics</option>
          <option>Placements</option>
          <option>Wellbeing</option>
          <option>Sports</option>
        </select>
      </div>

      {/* RESOURCES */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center">Loading...</p>
        ) : filteredResources.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No resources found
          </p>
        ) : (
          filteredResources.map((r) => (
            <div key={r._id} className="bg-white p-5 rounded-xl shadow">
              {editingId === r._id ? (
                <>
                  <input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full border mb-2 px-2 py-1 rounded"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full border mb-2 px-2 py-1 rounded"
                  />
                  <input
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full border mb-2 px-2 py-1 rounded"
                  />
                  <input
                    value={editForm.link}
                    onChange={(e) =>
                      setEditForm({ ...editForm, link: e.target.value })
                    }
                    className="w-full border mb-3 px-2 py-1 rounded"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="bg-primary text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-300 px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-semibold text-primary">{r.title}</h2>
                  <p className="text-sm text-gray-600">{r.description}</p>
                  <span className="inline-block mt-2 bg-secondary text-white px-2 py-1 text-xs rounded">
                    {r.category}
                  </span>
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noreferrer"
                    className="block mt-2 text-primary text-sm"
                  >
                    Visit →
                  </a>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => startEdit(r)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}

export default Dashboard;
