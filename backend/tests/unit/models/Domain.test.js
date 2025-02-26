// backend/tests/unit/models/Domain.test.js
const mongoose = require("mongoose");
const Domain = require("../../../models/domain");

describe("Domain Model Test", () => {
  it("should create a new domain with valid fields", () => {
    const domainData = {
      name: "Test Domain",
      description: "This is a test domain",
      leadership: {
        domain_owner: {
          name: "John Doe",
          role: "Domain Owner",
          contact: { email: "john@example.com", department: "IT" },
        },
        strategic_goals: [{ id: "goal1", description: "Increase efficiency" }],
      },
    };
    const domain = new Domain(domainData);
    expect(domain.name).toBe("Test Domain");
    expect(domain.leadership.domain_owner.name).toBe("John Doe");
  });

  it("should fail to create a domain without required fields", () => {
    const domain = new Domain({});
    const err = domain.validateSync();
    expect(err.errors["name"]).toBeDefined();
    expect(err.errors["leadership.domain_owner.name"]).toBeDefined();
  });
});
