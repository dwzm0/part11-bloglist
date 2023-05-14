import { useState } from "react";

const Blog = ({ blog, addLike, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  if (visible === true) {
    return (
      <div style={blogStyle} className="blogUnwrapped">
        <p>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>hide</button>
        </p>
        <p>{blog.url}</p>
        <p id="likes">
          {blog.likes} {<button onClick={() => addLike(blog)}>like</button>}
        </p>
        <p>{blog.user.name}</p>
        <p>
          {blog.user.username === user.username && (
            <button onClick={() => deleteBlog(blog)}>delete</button>
          )}
        </p>
      </div>
    );
  }
  return (
    <div style={blogStyle} className="blog">
      <span>
        {blog.title} {blog.author}
      </span>
      {<button onClick={toggleVisibility}>view</button>}
    </div>
  );
};

export default Blog;
