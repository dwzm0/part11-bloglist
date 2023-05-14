import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

const user = {
  username: "test username",
  name: "test name",
};

const blog = {
  title: "filth",
  author: "dima alekseev",
  url: "https://random.com",
  likes: 213,
  user,
};

/* beforeEach(() => {
  render(<Blog blog={blog} user={user} />);
}); */

describe("testing for two core fields", () => {
  test("renders content of two fields", () => {
    const { container } = render(<Blog blog={blog} />);
    const div = container.querySelector(".blog");

    expect(div).toHaveTextContent("filth");
    expect(div).toHaveTextContent("dima alekseev");
  });

  test("renders content of two fields", () => {
    const { container } = render(<Blog blog={blog} />);
    const div = container.querySelector(".blog");

    expect(div).not.toHaveTextContent("https://random.com");
    expect(div).not.toHaveTextContent(213);
  });
});

describe("when button clicked", () => {
  test("clicking the button renders four fields", async () => {
    render(<Blog blog={blog} user={user} />);
    const userEv = userEvent.setup();
    const button = screen.getByText("view");
    await userEv.click(button);

    expect(screen.getByText("https://random.com")).toBeVisible();
    expect(screen.getByText(213)).toBeVisible();
  });

  test("clicking like button", async () => {
    const likeHandler = jest.fn();

    render(<Blog blog={blog} user={user} addLike={likeHandler} />);

    const userEv = userEvent.setup();
    const button = screen.getByText("view");
    await userEv.click(button);

    const likeButton = screen.getByText("like");
    for (let i = 0; i < 2; i++) {
      await userEv.click(likeButton);
    }
    expect(likeHandler.mock.calls).toHaveLength(2);
  });
});
