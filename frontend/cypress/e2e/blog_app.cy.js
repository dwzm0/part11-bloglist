/* eslint-disable no-undef */
describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "Dima Alieksieve",
      username: "dwzm",
      password: "280283",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
    cy.visit("");
  });

  it("login form by default", function () {
    cy.contains("Log in to application");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("dwzm");
      cy.get("#password").type("280283");
      cy.get("#login-button").click();

      cy.contains("Dima Alieksieve has loged in");
    });
    it("fails with wrong credentials", function () {
      cy.get("#username").type("RANDOM");
      cy.get("#password").type("RANDOMPASS");
      cy.get("#login-button").click();

      cy.get(".error").should("contain", "wrong credentials");
      cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "dwzm", password: "280283" });
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("test name");
      cy.get("#author").type("test author");
      cy.get("#url").type("test url");
      cy.get("#create-button").click();
      cy.contains("a new blog test name has been added");
    });

    describe("view functionality", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "first blog",
          author: "me",
          url: "random url",
        });
        cy.createBlog({
          title: "second blog",
          author: "you",
          url: "modnar url",
        });
        cy.createBlog({
          title: "third blog",
          author: "someone",
          url: "someone's url",
        });
      });
      it("your can add like", function () {
        cy.contains("second blog").parent().find("button").as("theButton");
        cy.get("@theButton").click();
        cy.contains("like").click();
        cy.get("#likes").should("contain", 1);
      });
      it("creator can see and delete", function () {
        cy.contains("second blog").parent().find("button").as("theButton");
        cy.get("@theButton").click();
        cy.contains("delete").click();
        cy.contains("second blog").should("not.exist");
      });

      it("other user cant", function () {
        cy.contains("logout").click();
        cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);

        const secondUser = {
          name: "Dima Alieksieve",
          username: "ab20",
          password: "lvbnhbq",
        };
        cy.request("POST", `${Cypress.env("BACKEND")}/users`, secondUser);

        cy.login({ username: "ab20", password: "lvbnhbq" });
        cy.contains("first blog").should("not.exist");
      });
      it("likes are getting sorted", function () {
        cy.contains("third blog").parent().find("button").as("theButton");
        cy.get("@theButton").click();
        cy.contains("like").click();
        cy.get(".blogs").eq(0).should("contain", "third blog");
      });
    });
  });
});
