const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding categories...')

  const defaultCategories = [
    { name: 'Breakfast' },
    { name: 'Lunch' },
    { name: 'Dinner' },
    { name: 'Dessert' },
    { name: 'Snacks' },
    { name: 'Beverages' },
    { name: 'Appetizers' },
    { name: 'Main Course' },
    { name: 'Soups' },
    { name: 'Salads' },
    { name: 'Vegetarian' },
    { name: 'Vegan' },
  ]

  for (const category of defaultCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        name: {
          equals: category.name,
          mode: 'insensitive'
        }
      }
    })

    if (!existing) {
      await prisma.category.create({
        data: { name: category.name }
      })
      console.log(`Created category: ${category.name}`)
    } else {
      console.log(`Category already exists: ${category.name}`)
    }
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
