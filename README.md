# KEFI

KEFI is a full-stack e-commerce application I built from scratch for a boutique clothing store. The project covers the entire shopping experience — from browsing products and selecting variants to checking out with a real Stripe payment and receiving an order confirmation.

On the frontend, I built a Next.js app with a clean, editorial aesthetic inspired by modern fashion brands. It includes a homepage with a full-screen hero, product listing and detail pages with size/color variant selection, a persistent cart, a Stripe-powered checkout flow, and an order history page. The design uses a custom brand identity with a brown and cream colour palette throughout.

On the backend, I built a REST API with Express and TypeScript, backed by a PostgreSQL database on Neon and managed with Prisma ORM. It handles user authentication with JWT, atomic inventory management during checkout using Prisma transactions, and Stripe PaymentIntent integration with webhook-driven order confirmation.

The frontend is deployed on Vercel and the backend is deployed on Render, with the database hosted on Neon.
