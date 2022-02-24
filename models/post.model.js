const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
//schema for posts

const postSchema = new mongoose.Schema(
  {
    author: {
      type: ObjectId,
      ref: 'Police',
    },
    title: {
      type: String,
      required: true,
      maxlength: 16,
      minlength: 4,
    },
    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },
    // likes: [
    //   {
    //     user: {
    //       type: ObjectId,
    //       ref: 'User',
    //     },
    //   },
    // ],
  },
  { timestamps: true }
)

//export model

module.exports = new mongoose.model('post', postSchema)
