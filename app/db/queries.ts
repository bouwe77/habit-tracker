import { db } from '~/db/db.server'

export async function getAllHabits() {
  return db.habit.findMany()
}

export async function getAllTrackedHabits() {
  return db.trackedHabit.findMany({
    include: {
      habit: true,
    },
  })
}

export async function saveTrackedHabit(habitId: string, date: Date) {
  console.log(date)

  const trackedHabit = await db.trackedHabit.findFirst({
    where: {
      habitId,
      date,
    },
  })

  if (!trackedHabit) {
    await db.trackedHabit.create({
      data: { habitId, date, count: 1 },
    })
  } else {
    await db.trackedHabit.update({
      where: {
        id: trackedHabit.id,
      },
      data: {
        count: {
          increment: 1,
        },
      },
    })
  }
}
