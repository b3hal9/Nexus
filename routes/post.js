const router = require("express").Router();
const {
  getPost,
  getAllPost,
  createPost,
  updatePost,
  delPost,
} = require("../controllers/post.controller");

const { auth } = require("../utils/middlewares/auth");

//api to get a post
router.get("/post/:id", getPost);

//api to get all posts
router.get("/posts", getAllPost);

//api to post a post
router.post("/createpost", auth, createPost);

//api to update a post
router.put("/updatepost", auth, updatePost);

//api to delete a post
router.delete("/post", auth, delPost);

module.exports = router;
