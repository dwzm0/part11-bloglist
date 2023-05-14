const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, curr, i) => acc + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.sort((a, b) => b.likes - a.likes)[0];
};

const mostBlogs = (blogs) => {
  return _.chain(blogs)
    .groupBy("author")
    .map((group, author) => {
      return { author: author, blogs: group.length };
    })
    .maxBy((object) => object.blogs)
    .value();
};

const mostLikes = (blogs) => {
  return _.chain(blogs)
    .groupBy("author")
    .map((group, author) => {
      return {
        author: author,
        likes: group.reduce((acc, next) => {
          return (acc += next.likes);
        }, 0),
      };
    })
    .maxBy((obj) => obj.likes)
    .value();
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
