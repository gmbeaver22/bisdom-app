// backend/tests/mocks/domain.mock.js
module.exports = {
  validDomain: {
    name: "Mock Domain",
    description: "This is a mock domain for testing",
    leadership: {
      domain_owner: {
        name: "Mock Owner",
        role: "Domain Owner",
        contact: { email: "mock@example.com", department: "Mock Dept" },
      },
      strategic_goals: [
        { id: "mockGoal1", description: "Mock goal description" },
      ],
    },
  },
  invalidDomain: {
    description: "Missing name",
  },
};
