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

export async function saveTrackedHabit(habitId: string) {
  const trackedHabit = await db.trackedHabit.findFirst({
    where: {
      habitId,
    },
  })

  if (!trackedHabit) {
    await db.trackedHabit.create({
      data: { habitId, date: new Date(), count: 1 },
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

  //   await db.trackedHabit.upsert({
  //     include: {
  //       habit: true,
  //     },
  //     where: {
  //       habitId: habitId,
  //     },
  //     update: {
  //       count: {
  //         increment: 1,
  //       },
  //     },
  //     create: { habitId, date: new Date(), count: 1 },
  //   })
}
