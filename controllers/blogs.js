const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");

const middleware = require("../utils/middleware");
const { default: mongoose } = require("mongoose");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });

  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;

  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user,
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (!blog) return response.status(204).end();

    const user = request.user;

    if (blog.user._id.toString() === user._id.toString()) {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(200).end();
    } else {
      return response.status(401).end();
    }
  }
);

blogsRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  console.log(request.params);

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });

  console.log(updatedBlog);
  response.status(200).json(updatedBlog);
});

blogsRouter.put("/:id/comments", async (request, response) => {
  const { comment } = request.body;
  const id = request.params.id;

  if (!comment) {
    return response.status(400).json({ error: "Comment missing" });
  }

  const result = await Blog.findOneAndUpdate(
    { _id: id },
    { $push: { comments: comment } },
    { new: true }
  );

  if (!result) {
    return response
      .status(400)
      .json({ error: `Blog by ID ${id} does not exist` });
  }
  return response.status(200).json(result);
});

module.exports = blogsRouter;
