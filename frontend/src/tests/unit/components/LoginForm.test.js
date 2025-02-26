// frontend/src/tests/unit/components/LoginForm.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "../../../components/LoginForm";

describe("LoginForm Component", () => {
  it("should render login form with username and password inputs", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("should update input values on change", () => {
    render(<LoginForm />);
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("password123");
  });
});
