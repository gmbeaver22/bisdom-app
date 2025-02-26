// frontend/cypress/integration/login.test.js
describe("Login Flow", () => {
  it("should log in successfully and redirect to domains page", () => {
    cy.visit("/login");
    cy.get('input[placeholder="Username"]').type("testuser");
    cy.get('input[placeholder="Password"]').type("password123");
    cy.get("button").contains("Login").click();
    cy.url().should("include", "/domains");
    cy.contains("Business Domains").should("be.visible");
  });

  it("should show error on invalid credentials", () => {
    cy.visit("/login");
    cy.get('input[placeholder="Username"]').type("invaliduser");
    cy.get('input[placeholder="Password"]').type("wrongpassword");
    cy.get("button").contains("Login").click();
    cy.contains("Invalid credentials").should("be.visible");
  });
});
