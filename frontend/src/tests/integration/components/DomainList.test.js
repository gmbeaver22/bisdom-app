// frontend/src/tests/integration/components/DomainList.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DomainList from "../../../components/DomainList";
import apiService from "../../../services/api";

// Mock the apiService
jest.mock("../../../services/api");

describe("DomainList Component Integration Test", () => {
  it("should fetch and display domains from API", async () => {
    const mockDomains = [
      { _id: "1", name: "Domain 1" },
      { _id: "2", name: "Domain 2" },
    ];
    apiService.getDomains.mockResolvedValue({ data: mockDomains });

    render(
      <MemoryRouter>
        <DomainList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Domain 1")).toBeInTheDocument();
      expect(screen.getByText("Domain 2")).toBeInTheDocument();
    });
  });
});
