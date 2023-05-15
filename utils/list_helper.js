/* eslint-disable no-return-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
const _ = require("lodash")

const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((acc, curr, i) => acc + curr.likes, 0)

const favoriteBlog = (blogs) => blogs.sort((a, b) => b.likes - a.likes)[0]

const mostBlogs = (blogs) => _.chain(blogs)
  .groupBy("author")
  .map((group, author) => ({ author, blogs: group.length }))
  .maxBy((object) => object.blogs)
  .value()

const mostLikes = (blogs) => _.chain(blogs)
  .groupBy("author")
  .map((group, author) => ({
    author,
    likes: group.reduce((acc, next) => (acc += next.likes), 0),
  }))
  .maxBy((obj) => obj.likes)
  .value()

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
