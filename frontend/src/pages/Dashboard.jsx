import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [resources, setResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // edit state
  const [editingResource, setEditingResource] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    link: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ---------------- FETCH RESOURCES ---------------- */
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchResources = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/resources",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setResources(res.data);
      } catch (err) {
        console.error("Error fetching resources", err);
      }
    };

    fetchResources();
  }, [token, navigate]);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /* ---------------- DELETE RESOURCE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?"))
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/resources/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResources(resources.filter((r) => r._id !== id));
    } catch (err) {
      alert("Failed to delete resource");
    }
  };

  /* ---------------- EDIT RESOURCE ---------------- */
  const startEdit = (resource) => {
    setEditingResource(resource._id);
    setEditForm({
      title: resource.title,
      description: resource.description,
      category: resource.category,
      link: resource.link,
    });
  };

  const saveEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/resources/${editingResource}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResources(
        resources.map((r) =>
          r._id === editingResource ? res.data : r
        )
      );

      setEditingResource(null);
    } catch (err) {
      alert("Failed to update resource");
    }
  };

  /* ---------------- FILTER + SEARCH ---------------- */
  const filteredResources = resources.filter((r) => {
    const matchesCategory =
      selectedCategory === "All" ||
      r.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  /* ---------------- DASHBOARD STATS ---------------- */
  const total = resources.length;
  const academics = resources.filter((r) => r.category === "Academics").length;
  const placements = resources.filter((r) => r.category === "Placements").length;
  const wellbeing = resources.filter((r) => r.category === "Wellbeing").length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-primary">
          Campus Resource Hub
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/add-resource")}
            className="bg-primary px-4 py-2 rounded-lg text-white hover:bg-secondary"
          >
            + Add Resource
          </button>
          <button
            onClick={handleLogout}
            className="bg-accent2 px-4 py-2 rounded-lg text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={total} />
        <StatCard label="Academics" value={academics} />
        <StatCard label="Placements" value={placements} />
        <StatCard label="Wellbeing" value={wellbeing} />
      </div>

      {/* SEARCH + FILTER */}
      <div className="max-w-6xl mx-auto mb-6 flex justify-end gap-3">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-lg border w-64"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border"
        >
          <option value="All">All</option>
          <option value="Academics">Academics</option>
          <option value="Placements">Placements</option>
          <option value="Wellbeing">Wellbeing</option>
          <option value="Sports">Sports</option>
        </select>
      </div>

      {/* RESOURCES */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No resources found
          </p>
        ) : (
          filteredResources.map((r) => (
            <div key={r._id} className="bg-white p-5 rounded-xl shadow">
              {editingResource === r._id ? (
                <>
                  <input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full mb-2 border px-2 py-1 rounded"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full mb-2 border px-2 py-1 rounded"
                  />
                  <input
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full mb-2 border px-2 py-1 rounded"
                  />
                  <input
                    value={editForm.link}
                    onChange={(e) =>
                      setEditForm({ ...editForm, link: e.target.value })
                    }
                    className="w-full mb-3 border px-2 py-1 rounded"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="bg-primary text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingResource(null)}
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
                  <span className="text-xs bg-secondary text-white px-2 py-1 rounded inline-block mt-2">
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

/* --------- STAT CARD COMPONENT --------- */
function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}

export default Dashboard;
