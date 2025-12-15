const express = require("express");
const Resource = require("../models/Resource");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* GET ALL RESOURCES */
router.get("/", auth, async (req, res) => {
  const resources = await Resource.find();
  res.json(resources);
});

/* ADD RESOURCE (ADMIN ONLY - YOU) */
router.post("/", auth, async (req, res) => {
  const { title, description, category, link } = req.body;

  const resource = new Resource({
    title,
    description,
    category,
    link
  });

  await resource.save();
  res.json({ message: "Resource added successfully" });
});

/* DELETE RESOURCE */
router.delete("/:id", auth, async (req, res) => {
  await Resource.findByIdAndDelete(req.params.id);
  res.json({ message: "Resource deleted" });
});

module.exports = router;
