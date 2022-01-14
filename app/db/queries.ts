import { db } from '~/db/db.server'

export async function getAllHabits() {
  return db.habit.findMany()
}

export async function getAllTrackedHabits(date: Date) {
  return db.trackedHabit.findMany({
    where: {
      date: date,
    },
    include: {
      habit: true,
    },
  })
}

export async function addTrackedHabit(habitId: string, date: Date) {
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

export async function removeTrackedHabit(habitId: string, date: Date) {
  const trackedHabit = await db.trackedHabit.findFirst({
    where: {
      habitId,
      date,
    },
  })

  if (!trackedHabit) return

  if (trackedHabit.count === 1) {
    await db.trackedHabit.delete({
      where: { id: trackedHabit.id },
    })
  } else {
    await db.trackedHabit.update({
      where: {
        id: trackedHabit.id,
      },
      data: {
        count: {
          decrement: 1,
        },
      },
    })
  }
}
