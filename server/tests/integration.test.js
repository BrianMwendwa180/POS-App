import request from "supertest";
import app from "../server.js";

describe("Integration Tests", () => {
  it("should return server status", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain("POS Backend Running");
  });

  it("should handle 404 for unknown routes", async () => {
    const res = await request(app).get("/unknown-route");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error", "Route not found");
  });

  it("should handle auth routes", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.statusCode).toEqual(400); // Should return validation error
  });

  it("should handle product routes without auth", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toEqual(401); // Should require authentication
  });
});
