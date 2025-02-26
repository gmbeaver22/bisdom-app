// backend/tests/integration/routes/domains.integration.js
const request = require("supertest");
const app = require("../../../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Domains API Integration Test", () => {
  it("should create a new domain via POST /api/domains", async () => {
    const res = await request(app)
      .post("/api/domains")
      .set("Authorization", "mock-jwt-token")
      .send({
        name: "New Domain",
        description: "Domain description",
        leadership: {
          domain_owner: {
            name: "Jane Doe",
            role: "Owner",
            contact: { email: "jane@example.com", department: "Operations" },
          },
          strategic_goals: [{ id: "goal2", description: "Reduce costs" }],
        },
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe("New Domain");
  });

  it("should retrieve all domains via GET /api/domains", async () => {
    const res = await request(app)
      .get("/api/domains")
      .set("Authorization", "mock-jwt-token");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
