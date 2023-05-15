/* eslint-disable no-underscore-dangle */
/* eslint-disable import/order */
/* eslint-disable no-return-assign */
const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./blog_api_test_helper")
const app = require("../app")

const api = supertest(app)
const bcrypt = require("bcrypt")
const Blog = require("../models/blog")
const User = require("../models/user")

beforeEach(async () => {
  await Blog.deleteMany({})
  await Promise.all(helper.initialBlogs.map((blog) => new Blog(blog).save()))
})

describe("when there is initially some notes saved", () => {
  test("bloges are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("there is one blog", async () => {
    const response = await api.get("/api/blogs")

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
})

test("there is an id", async () => {
  const response = await api.get("/api/blogs")
  console.log(response)
  expect(response.body[0].id).toBeDefined()
})

describe("addition of a new blog", () => {
  let user
  beforeEach(async () => (user = await helper.initUsers()))
  test("you can add blog", async () => {
    await api
      .post("/api/blogs")
      .set(helper.authorizationHeader(user))
      .send(helper.testBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const authors = blogsAtEnd.map((n) => n.author)
    expect(authors).toContain(helper.testBlog.author)
  })

  test("entries without likes fields turns 0", async () => {
    const response = await api
      .post("/api/blogs")
      .set(helper.authorizationHeader(user))
      .send(helper.testBlog)
      .expect(201)

    expect(response.body.likes).toEqual(0)
  })

  test("blog without content is not added(1)", async () => {
    const newBlog = {
      author: "swszx",
      url: "https://poe",
      likes: 121213,
    }

    await api.post("/api/blogs").send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test("blog without content is not added(2)", async () => {
    const newBlog = {
      title: "poe",
      author: "swszx",
      likes: 121213,
    }

    await api.post("/api/blogs").send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("sekret", 10)
    const user = new User({ username: "root", passwordHash })

    await user.save()
  })

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })
  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("expected `username` to be unique")

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

describe("cant add user with bad credentials", () => {
  test("cant get with short password", async () => {
    const user = {
      username: "dima",
      name: "LOL",
      password: "23",
    }
    await api.post("/api/users/").send(user).expect(400)
  })
  test("cant get without nickname", async () => {
    const user = {
      name: "LOL",
      password: "22133",
    }
    await api.post("/api/users/").send(user).expect(400)
  })
  test("cant get with short nickname", async () => {
    const user = {
      username: "di",
      name: "LOL",
      password: "22133",
    }
    await api.post("/api/users/").send(user).expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
