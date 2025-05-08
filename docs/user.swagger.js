// docs/user.swagger.js

module.exports = {
  openapi: "3.0.0",
  info: {
    title: "User API",
    version: "1.0.0",
    description: "API documentation for users",
  },
  servers: [
    {
      url: "http://localhost:5000/api",
    },
  ],
  paths: {
    "/users/register": {
      post: {
        tags: ["User"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["firstName", "lastName", "email", "country", "password"],
                properties: {
                  firstName: { type: "string", example: "John" },
                  lastName: { type: "string", example: "Doe" },
                  email: { type: "string", example: "john@example.com" },
                  country: { type: "string", example: "India" },
                  password: { type: "string", example: "Password123" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered. Verification email sent." },
          400: { description: "Validation error" },
          409: { description: "User already exists" },
          500: { description: "Server error" },
        },
      },
    },
    "/users/login": {
      post: {
        tags: ["User"],
        summary: "Login a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "john@example.com" },
                  password: { type: "string", example: "Password123" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          400: { description: "Validation error" },
          401: { description: "Invalid credentials or email not verified" },
          404: { description: "User not found" },
          500: { description: "Server error" },
        },
      },
    },
  },
};
