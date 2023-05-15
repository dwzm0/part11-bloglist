/* eslint-disable no-underscore-dangle */
const Blog = require("../models/blog")
const User = require("../models/user")

const initialBlogs = [
  {
    title: "RANDOM",
    author: "RANDOM-kumar",
    url: "https://RANDOM",
    likes: 2132,
  },
  {
    title: "csgo",
    author: "kumar-kumar",
    url: "https://kumar-kumar",
    likes: 1213213,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: "dota2plYAE" })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
