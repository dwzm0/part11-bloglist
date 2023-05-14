import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

const testBlog = {
  title: "testTitle",
  author: "testAuthor",
  url: "testUrl",
};

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const titleInput = screen.getByPlaceholderText("entry title");
  const authorInput = screen.getByPlaceholderText("entry author");
  const urlInput = screen.getByPlaceholderText("entry url");

  const sendButton = screen.getByText("create");

  await user.type(titleInput, testBlog.title);
  await user.type(authorInput, testBlog.author);
  await user.type(urlInput, testBlog.url);

  await user.click(sendButton);
  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe(testBlog.title);
  expect(createBlog.mock.calls[0][0].author).toBe(testBlog.author);
  expect(createBlog.mock.calls[0][0].url).toBe(testBlog.url);
});
