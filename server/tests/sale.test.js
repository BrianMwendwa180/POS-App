import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server.js";
import Product from "../models/Product.js";

let mongoServer;
let managerToken;
let cashierToken;
let userToken;
let productId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Register and login a manager user
  await request(app).post("/api/auth/register").send({
    name: "Manager",
    email: "manager@example.com",
    password: "password123",
    role: "manager"
  });

  const managerRes = await request(app).post("/api/auth/login").send({
    email: "manager@example.com",
    password: "password123"
  });

  managerToken = managerRes.body.token;

  // Register and login a cashier user
  await request(app).post("/api/auth/register").send({
    name: "Cashier",
    email: "cashier@example.com",
    password: "password123",
    role: "cashier"
  });

  const cashierRes = await request(app).post("/api/auth/login").send({
    email: "cashier@example.com",
    password: "password123"
  });

  cashierToken = cashierRes.body.token;

  // Register and login a user
  await request(app).post("/api/auth/register").send({
    name: "User",
    email: "user@example.com",
    password: "password123"
  });

  const userRes = await request(app).post("/api/auth/login").send({
    email: "user@example.com",
    password: "password123"
  });

  userToken = userRes.body.token;

  // Create a test product
  const productRes = await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${managerToken}`)
    .send({
      name: "Test Product",
      category: "Test Category",
      price: 10,
      cost: 5,
      stock: 100
    });

  productId = productRes.body.product._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Sale API", () => {
  it("should create a new sale", async () => {
    const res = await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        products: [
          {
            product: productId,
            quantity: 2,
            price: 10
          }
        ],
        paymentMethod: "cash",
        totalAmount: 20
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.sale).toHaveProperty("_id");
    expect(res.body.sale.totalAmount).toBe(20);
  });

  it("should get sales list", async () => {
    const res = await request(app)
      .get("/api/sales")
      .set("Authorization", `Bearer ${managerToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.sales.length).toBeGreaterThan(0);
  });

  it("should get a single sale", async () => {
    const salesRes = await request(app)
      .get("/api/sales")
      .set("Authorization", `Bearer ${managerToken}`);

    const saleId = salesRes.body.sales[0]._id;

    const res = await request(app)
      .get(`/api/sales/${saleId}`)
      .set("Authorization", `Bearer ${managerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.sale).toHaveProperty("_id", saleId);
  });

  it("should not create sale with insufficient stock", async () => {
    const res = await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${managerToken}`)
      .send({
        products: [
          {
            product: productId,
            quantity: 200, // More than available stock
            price: 10
          }
        ],
        paymentMethod: "cash",
        totalAmount: 2000
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should allow cashier to create sale", async () => {
    const res = await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${cashierToken}`)
      .send({
        products: [
          {
            product: productId,
            quantity: 1,
            price: 10
          }
        ],
        paymentMethod: "cash",
        totalAmount: 10
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.sale).toHaveProperty("_id");
  });

  it("should not allow user to create sale", async () => {
    const res = await request(app)
      .post("/api/sales")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        products: [
          {
            product: productId,
            quantity: 1,
            price: 10
          }
        ],
        paymentMethod: "cash",
        totalAmount: 10
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("error", "Insufficient permissions. Required: create");
  });
});
