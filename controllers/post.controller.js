const Post = require("../models/post.model");
const upload = require("../utils/helper/uploadImage");
const { postValidator } = require("../utils/reqValidator");
const path = require("path");
const winston = require("winston");

exports.getPost = async (req, res) => {
  await Post.findById(req.params["id"]).then((post) => {
    res.status(200).json(post);
  });
};

exports.getAllPost = async (req, res) => {
  const errors = {};
  await Post.find()
    .sort({ createdAt: -1 })
    .populate("author", ["name", "email"])
    .then((post) => {
      if (!post) {
        errors.noPost = "There is no post";
        res.status(404).json(errors);
      }
      res.status(200).json(post);
    });
};

exports.createPost = (req, res) => {
  console.log(req);
  upload(req, res, (err) => {
    if (err) {
      return err;
    } else {
      const imgpath = req.file ? path.join("uploads", req.file.filename) : "";
      const { error } = postValidator(req.body);
      if (error) {
        winston.error(error.message, error);
        return res.status(400).send(error.details[0].message);
      }
      const post = new Post({
        author: req.user._id,
        title: req.body.title,
        description: req.body.description,
        image: req.file ? imgpath : "",
      });
      post.save().then((post) => {
        res.status(200).json(post);
      });
    }
  });
};

exports.updatePost = async (req, res) => {
  //validation post input fields
  const { error } = postValidator(req.body);
  if (error) return res.status(400).send("invalid fields");

  const updatedpost = await Post.findByIdAndUpdate(req.query.id, {
    $set: {
      title: req.body.title,
      description: req.body.description,
    },
  });
  return res.json(updatedpost);
};

exports.delPost = async (req, res) => {
  await Post.findById(req.query.id).then((post) => {
    if (req.user._id != post.author) {
      return res.status(401).json({ authorization: "failed" });
    } else {
      post.remove().then(() => {
        res.status(200).json({ id: post._id });
      });
    }
  });
};
