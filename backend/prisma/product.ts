import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'
dotenv.config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding products...')

  // PRODUCT 1 — Backless Slip Dress
  const p1 = await prisma.product.create({
    data: {
      name: 'Backless Slip Dress',
      price: 70,
      description: 'A sleek backless slip dress that drapes effortlessly. Perfect for evenings out.',
      slug: 'backless-slip-dress',
      images: ['https://res.cloudinary.com/deg3n709i/image/upload/v1773889829/IMG_9619_zi33ce.jpg'],
    }
  })
  const p1Colors = ['Red', 'Emerald', 'Ivory', 'Black']
  const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
  for (const color of p1Colors) {
    for (const size of sizes) {
      await prisma.productVariant.create({
        data: { productId: p1.id, size, color, stock: 10 }
      })
    }
  }
  console.log('Backless Slip Dress created')

  // PRODUCT 2 — Kai Dress
  const p2 = await prisma.product.create({
    data: {
      name: 'Kai Dress',
      price: 75,
      description: 'The Kai dress — minimal, elegant, and effortlessly wearable. A wardrobe essential.',
      slug: 'kai-dress',
      images: [
        'https://res.cloudinary.com/deg3n709i/image/upload/v1773889829/IMG_7921_rb3c2d.jpg',
        'https://res.cloudinary.com/deg3n709i/image/upload/v1773889821/IMG_0628_hrgop4.jpg'
      ],
    }
  })
  for (const color of ['Ivory', 'Black']) {
    for (const size of sizes) {
      await prisma.productVariant.create({
        data: { productId: p2.id, size, color, stock: 10 }
      })
    }
  }
  console.log('Kai Dress created')

  // PRODUCT 3 — Selene Set
  const p3 = await prisma.product.create({
    data: {
      name: 'Selene Set',
      price: 90,
      description: 'The Selene co-ord set in soft Ivory. Delicate, feminine, and made to be seen.',
      slug: 'selene-set',
      images: [
        'https://res.cloudinary.com/deg3n709i/image/upload/v1773889821/IMG_0627_tzcl0x.jpg',
        'https://res.cloudinary.com/deg3n709i/image/upload/v1773889822/IMG_0629_s0es0q.jpg'
      ],
    }
  })
  for (const size of sizes) {
    await prisma.productVariant.create({
      data: { productId: p3.id, size, color: 'Ivory', stock: 10 }
    })
  }
  console.log('Selene Set created')

  // PRODUCT 4 — Bustier
  const p4 = await prisma.product.create({
    data: {
      name: 'Bustier',
      price: 86,
      description: 'A structured Ivory bustier that pairs with everything. Bold and timeless.',
      slug: 'bustier',
      images: [
        'https://res.cloudinary.com/deg3n709i/image/upload/v1773889823/IMG_0632_gzjwgf.jpg',
        'https://res.cloudinary.com/deg3n709i/image/upload/v1773889822/IMG_0631_lkanud.jpg'
      ],
    }
  })
  for (const size of sizes) {
    await prisma.productVariant.create({
      data: { productId: p4.id, size, color: 'Ivory', stock: 10 }
    })
  }
  console.log('Bustier created')

  // PRODUCT 5 — Sparky Valentine
  const p5 = await prisma.product.create({
    data: {
      name: 'Sparky Valentine',
      price: 99,
      description: 'The Sparky Valentine in shimmer — because you deserve to shine every single day.',
      slug: 'sparky-valentine',
      images: [
        'https://res.cloudinary.com/deg3n709i/image/upload/v1773889826/IMG_0635_icn9hr.jpg',
        'https://res.cloudinary.com/deg3n709i/image/upload/v1773889825/IMG_0634_oc5gq6.jpg'
      ],
    }
  })
  for (const size of sizes) {
    await prisma.productVariant.create({
      data: { productId: p5.id, size, color: 'Silver', stock: 10 }
    })
  }
  console.log('Sparky Valentine created')

  console.log(' All products seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })