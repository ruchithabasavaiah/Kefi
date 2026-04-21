import { OpenAPIV3 } from "openapi-types";

export const swaggerSpec: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "KEFI API",
    version: "1.0.0",
    description:
      "REST API for the KEFI e-commerce platform. Handles authentication, products, variants, checkout, and orders.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token obtained from /auth/login or /auth/register",
      },
    },
    schemas: {
      // ── Auth ──────────────────────────────────────────────────────────
      RegisterRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          password: {
            type: "string",
            minLength: 8,
            example: "password123",
            description: "Minimum 8 characters",
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "admin@kefi.com" },
          password: { type: "string", example: "Admin@12345" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string", description: "JWT — expires in 1h" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["USER", "ADMIN"] },
        },
      },
      UserMe: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["USER", "ADMIN"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },

      // ── Products ──────────────────────────────────────────────────────
      CreateProductRequest: {
        type: "object",
        required: ["name", "price", "description"],
        properties: {
          name: { type: "string", minLength: 1, example: "Classic Linen Shirt" },
          price: { type: "number", minimum: 0.01, example: 89.99 },
          description: {
            type: "string",
            minLength: 1,
            example: "A timeless piece crafted from premium linen.",
          },
          images: {
            type: "array",
            items: { type: "string" },
            description: "Array of image URLs",
            example: ["https://images.unsplash.com/photo-xxx?w=800"],
          },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Classic Linen Shirt" },
          price: { type: "number", example: 89.99 },
          description: { type: "string" },
          slug: { type: "string", example: "classic-linen-shirt" },
          images: {
            type: "array",
            items: { type: "string" },
            description: "Array of image URLs",
          },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // ── Variants ──────────────────────────────────────────────────────
      CreateVariantRequest: {
        type: "object",
        required: ["size", "color", "stock"],
        properties: {
          size: { type: "string", minLength: 1, example: "M" },
          color: {
            type: "string",
            minLength: 1,
            example: "White",
            description: "CSS color name used as swatch in the frontend",
          },
          stock: { type: "integer", minimum: 0, example: 25 },
          price: {
            type: "number",
            minimum: 0.01,
            example: 79.99,
            description: "Optional override price; falls back to product price if omitted",
            nullable: true,
          },
        },
      },
      ProductVariant: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          productId: { type: "string", format: "uuid" },
          size: { type: "string", example: "M" },
          color: { type: "string", example: "White" },
          stock: { type: "integer", example: 25 },
          price: { type: "number", nullable: true, example: 79.99 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      // ── Variants standalone ───────────────────────────────────────────
      PurchaseVariantRequest: {
        type: "object",
        required: ["quantity"],
        properties: {
          quantity: { type: "integer", minimum: 1, example: 2 },
        },
      },

      // ── Checkout ──────────────────────────────────────────────────────
      CheckoutRequest: {
        type: "object",
        required: ["items"],
        properties: {
          items: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["variantId", "quantity"],
              properties: {
                variantId: { type: "string", format: "uuid" },
                quantity: { type: "integer", minimum: 1, example: 1 },
              },
            },
          },
        },
      },
      CheckoutResponse: {
        type: "object",
        properties: {
          order: { $ref: "#/components/schemas/Order" },
          clientSecret: {
            type: "string",
            description: "Stripe PaymentIntent client_secret — pass to stripe.confirmCardPayment()",
            example: "pi_3xxx_secret_yyy",
          },
        },
      },

      // ── Orders ────────────────────────────────────────────────────────
      Order: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          status: { type: "string", enum: ["PENDING", "PAID", "CANCELLED"] },
          total: { type: "number", example: 179.98 },
          currency: { type: "string", example: "usd" },
          paymentIntentId: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" },
          },
        },
      },
      OrderItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          orderId: { type: "string", format: "uuid" },
          variantId: { type: "string", format: "uuid" },
          quantity: { type: "integer", example: 1 },
          unitPrice: { type: "number", example: 89.99 },
          variant: { $ref: "#/components/schemas/ProductVariant" },
        },
      },
      UpdateOrderStatusRequest: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: ["PENDING", "PAID", "CANCELLED"],
            example: "PAID",
          },
        },
      },

      // ── Errors ────────────────────────────────────────────────────────
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Validation failed" },
        },
      },
      ValidationErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Validation failed" },
          details: {
            type: "array",
            items: {
              type: "object",
              properties: {
                path: { type: "array", items: { type: "string" } },
                message: { type: "string" },
              },
            },
          },
        },
      },
    },

    responses: {
      Unauthorized: {
        description: "Missing or invalid Authorization header / expired token",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { error: "Missing or invalid Authorization header" },
          },
        },
      },
      Forbidden: {
        description: "Admin access required",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { error: "Admin access required" },
          },
        },
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { error: "Order not found" },
          },
        },
      },
      ValidationError: {
        description: "Request body failed schema validation",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
          },
        },
      },
    },
  },

  tags: [
    { name: "Auth", description: "Registration, login, and current user" },
    { name: "Products", description: "Product listing and creation (admin)" },
    { name: "Variants", description: "Standalone variant lookup and direct purchase" },
    { name: "Checkout", description: "Cart → order → Stripe PaymentIntent flow" },
    { name: "Orders", description: "Order history and admin order management" },
  ],

  paths: {
    // ════════════════════════════════════════════════════════════════════
    // AUTH
    // ════════════════════════════════════════════════════════════════════
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        description: "Creates a USER-role account. Returns a JWT token and user object so the client is immediately authenticated.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "User created and authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "409": {
            description: "Email already registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { error: "User already exists" },
              },
            },
          },
        },
      },
    },

    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login with email and password",
        description: "Returns a signed JWT (expires in 1 hour) and the authenticated user object.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "401": {
            description: "Invalid email or password",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { error: "Invalid credentials" },
              },
            },
          },
        },
      },
    },

    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current authenticated user",
        description: "Returns the full profile of the user whose JWT is in the Authorization header.",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Authenticated user profile",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserMe" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    // PRODUCTS
    // ════════════════════════════════════════════════════════════════════
    "/products": {
      get: {
        tags: ["Products"],
        summary: "List all products",
        description: "Returns all active products. Public endpoint — no authentication required.",
        responses: {
          "200": {
            description: "Array of products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create a product",
        description: "Admin only. Auto-generates a URL slug from the product name. Returns 409 if the slug already exists.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProductRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Product created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "409": {
            description: "A product with the same slug already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { error: "Slug already exists" },
              },
            },
          },
        },
      },
    },

    "/products/{id}/variants": {
      get: {
        tags: ["Products"],
        summary: "List variants for a product",
        description: "Returns all variants belonging to the given product ID. Public endpoint.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Product UUID",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Array of product variants",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/ProductVariant" },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Add a variant to a product",
        description:
          "Admin only. The combination of (productId, size, color) must be unique. " +
          "`price` is optional — if omitted the product base price is used at checkout.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Product UUID",
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateVariantRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Variant created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductVariant" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "409": {
            description: "Variant with this size/color already exists for this product",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    // VARIANTS (standalone)
    // ════════════════════════════════════════════════════════════════════
    "/variants/{id}": {
      get: {
        tags: ["Variants"],
        summary: "Get a single variant by ID",
        description: "Fetches a variant directly by its UUID. Public endpoint.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Variant UUID",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Variant object",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductVariant" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },

    "/variants/{id}/purchase": {
      post: {
        tags: ["Variants"],
        summary: "Directly purchase stock from a variant",
        description:
          "Decrements the variant stock by the given quantity. " +
          "Returns 400 if there is not enough stock. No auth required.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Variant UUID",
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PurchaseVariantRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Purchase successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Purchase successful" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Not enough stock or validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { error: "Not enough stock" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    // CHECKOUT
    // ════════════════════════════════════════════════════════════════════
    "/checkout": {
      post: {
        tags: ["Checkout"],
        summary: "Create an order and get a Stripe PaymentIntent",
        description:
          "Atomically validates stock, decrements inventory, creates an Order record, " +
          "then creates a Stripe PaymentIntent. Returns the order and the `clientSecret` " +
          "to pass to `stripe.confirmCardPayment()` on the frontend.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CheckoutRequest" },
              example: {
                items: [
                  { variantId: "uuid-of-variant", quantity: 1 },
                ],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Order created — use clientSecret to complete payment",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CheckoutResponse" },
              },
            },
          },
          "400": {
            description: "Validation error, insufficient stock, or checkout failure",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  validation: { value: { error: "Validation failed", details: [] } },
                  stock: { value: { error: "Not enough stock for variant <id>" } },
                  general: { value: { error: "Checkout failed" } },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },

    // ════════════════════════════════════════════════════════════════════
    // ORDERS
    // ════════════════════════════════════════════════════════════════════
    "/me/orders": {
      get: {
        tags: ["Orders"],
        summary: "Get my orders",
        description: "Returns all orders belonging to the authenticated user, newest first. Each order includes its items with variant and product details.",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Array of orders",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },

    "/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get a single order",
        description: "Returns the order with all items. Only the order owner or an ADMIN can access it.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Order UUID",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Order object with items",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Order" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },

    "/admin/orders": {
      get: {
        tags: ["Orders"],
        summary: "List all orders (admin)",
        description: "Returns every order in the system, newest first. Requires ADMIN role.",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Array of all orders",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },

    "/admin/orders/{id}/status": {
      patch: {
        tags: ["Orders"],
        summary: "Update order status (admin)",
        description: "Updates the status of any order. Allowed values: PENDING, PAID, CANCELLED. Requires ADMIN role.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Order UUID",
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateOrderStatusRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated order",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Order" },
              },
            },
          },
          "400": {
            description: "Invalid status value",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { error: "Invalid order status" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
  },
};
