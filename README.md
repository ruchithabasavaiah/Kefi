#KEFI
Full-stack e-commerce platform for a boutique clothing store.
Live → kefi-six.vercel.app

#What's interesting

Atomic Prisma checkout transaction — stock validation, inventory decrement, and order creation in a single query. No oversell.
Two-phase Stripe payment — order created as PENDING, only marked PAID after webhook confirmation. Payment state is never client-reported.
Stateless JWT auth with role-based middleware. Admin and user routes fully separated.


#Stack
Next.js · Express · PostgreSQL · Prisma · Stripe · TypeScript · Tailwind

Run locally
bash# Backend
cd backend && npm install
add .env (see .env.example)
npx prisma migrate deploy
npx tsx prisma/seed.ts && npx tsx prisma/product.ts
npm run dev  # :8080

Frontend
cd frontend && npm install
add .env.local → NEXT_PUBLIC_API_URL=http://localhost:8080
npm run dev  # :3000

Stripe webhooks
stripe listen --forward-to localhost:8080/webhooks/stripe
Test card: 4242 4242 4242 4242 · any future date · any CVC
