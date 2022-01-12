import { useLoaderData, redirect, LoaderFunction, ActionFunction } from 'remix'
import { db } from '~/db/db.server'

type LoaderData = {
  habits: Array<{ id: string; name: string }>
  trackedHabits: Array<{ id: string; name: string; count: number }>
}

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    habits: await db.habit.findMany(),
    trackedHabits: await db.trackedHabit.findMany({
      include: {
        habit: true,
      },
    }),
  }
  return data
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const habitId = form.get('habitId')

  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  if (typeof habitId !== 'string') {
    throw new Error(`Form not submitted correctly.`)
  }

  // Check TrackedHabit already exists for the HabitId
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

  return redirect(`/day`)
}

export default () => {
  const data = useLoaderData<LoaderData>()

  return (
    <>
      <h1>Today</h1>

      <div>
        <form method="post">
          {data.habits.map((habit) => {
            return (
              <div key={habit.id}>
                <button value={habit.id} name="habitId" type="submit">
                  {habit.name}
                </button>
              </div>
            )
          })}
        </form>
      </div>

      <div>
        {data.trackedHabits.map((trackedHabit) => {
          return (
            <div key={trackedHabit.id}>
              <button>
                {trackedHabit.habit.name} ({trackedHabit.count})
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}
