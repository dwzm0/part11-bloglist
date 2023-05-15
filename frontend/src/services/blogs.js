/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const deleteBlog = (id) => {
  const config = {
    headers: { Authorization: token },
  };
  axios.delete(`${baseUrl}/${id}`, config);
};

const like = async ({ id, title, author, url, likes, user }) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.put(
    `${baseUrl}/${id}`,
    {
      title,
      author,
      url,
      likes: likes + 1,
      user: user.id,
    },
    config
  );
  return request.then((response) => response.data);
};

export default { getAll, create, like, setToken, deleteBlog };
