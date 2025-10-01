import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server.js"; // Assuming server.js exports the app

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Product API", () => {
  let token;

  beforeAll(async () => {
    // Register and login a manager user to get token
    await request(app).post("/api/auth/register").send({
      name: "Manager",
      email: "manager@example.com",
      password: "password123",
      role: "manager"
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "manager@example.com",
      password: "password123"
    });

    token = res.body.token;
  });

  it("should create a new product", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Product",
        category: "Test Category",
        price: 10,
        cost: 5,
        stock: 100
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.product).toHaveProperty("_id");
    expect(res.body.product.name).toBe("Test Product");
  });

  it("should get products list", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it("should update a product", async () => {
    const products = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${token}`);

    const productId = products.body.products[0]._id;

    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Test Product",
        category: "Test Category",
        price: 15,
        cost: 5,
        stock: 100
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.product.price).toBe(15);
  });

  it("should delete (deactivate) a product", async () => {
    const products = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${token}`);

    const productId = products.body.products[0]._id;

    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Product deactivated successfully");
  });
});
