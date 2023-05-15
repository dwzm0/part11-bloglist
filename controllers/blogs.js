/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const blogsRouter = require("express").Router()
const { default: mongoose } = require("mongoose")
const Blog = require("../models/blog")

const middleware = require("../utils/middleware")

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  })

  response.json(blogs)
})

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const { body } = request

  const { user } = request

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (!blog) return response.status(204).end()

    const { user } = request

    if (blog.user._id.toString() === user._id.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(200).end()
    } else {
      return response.status(401).end()
    }
  },
)

blogsRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const { body } = request
  console.log(request.params)

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })

  console.log(updatedBlog)
  response.status(200).json(updatedBlog)
})

blogsRouter.put("/:id/comments", async (request, response) => {
  const { comment } = request.body
  const { id } = request.params

  if (!comment) {
    return response.status(400).json({ error: "Comment missing" })
  }

  const result = await Blog.findOneAndUpdate(
    { _id: id },
    { $push: { comments: comment } },
    { new: true },
  )

  if (!result) {
    return response
      .status(400)
      .json({ error: `Blog by ID ${id} does not exist` })
  }
  return response.status(200).json(result)
})

module.exports = blogsRouter
