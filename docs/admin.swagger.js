// docs/admin.swagger.js

module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Admin API",
    version: "1.0.0",
    description: "API documentation for admins",
  },
  servers: [
    {
      url: "http://localhost:5000/api",
    },
  ],
  paths: {
    "/admins/add": {
      post: {
        tags: ["Admin"],
        summary: "Add a new admin (Admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["firstName", "lastName", "email", "country", "password"],
                properties: {
                  firstName: { type: "string", example: "Jane" },
                  lastName: { type: "string", example: "Doe" },
                  email: { type: "string", example: "jane.doe@example.com" },
                  country: { type: "string", example: "India" },
                  password: { type: "string", example: "Admin123!" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Admin created successfully" },
          400: { description: "Validation failed" },
          403: { description: "Access denied (not an admin)" },
          409: { description: "Email already exists" },
          500: { description: "Server error" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};
