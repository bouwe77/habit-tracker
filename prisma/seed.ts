import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function seed() {
  await Promise.all(
    getHabits().map((habit) => {
      return db.habit.create({ data: habit })
    }),
  )
}

seed()

function getHabits() {
  return [
    {
      name: 'Take a walk',
    },
    {
      name: 'TypeScript Course',
    },
    {
      name: 'Eat some fruit',
    },
  ]
}
