import { Habit, TrackedHabit } from '@prisma/client'
import { useLoaderData, redirect, LoaderFunction, ActionFunction } from 'remix'
import {
  getAllHabits,
  getAllTrackedHabits,
  saveTrackedHabit,
} from '~/db/queries'

type LoaderData = {
  habits: Habit[]
  trackedHabits: (TrackedHabit & { habit: Habit })[]
}

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    habits: await getAllHabits(),
    trackedHabits: await getAllTrackedHabits(),
  }
  return data
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const habitId = form.get('habitId')

  if (typeof habitId !== 'string') {
    throw new Error(`Form not submitted correctly.`)
  }

  //TODO Input validation

  await saveTrackedHabit(habitId)

  return redirect(`/day`)
}

export default () => {
  const data = useLoaderData<LoaderData>()

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            padding: '10px',
            marginRight: '10px',
            border: '1px solid blue',
          }}
        >
          <form method="post">
            {data.habits.map((habit) => {
              return (
                <div style={{ margin: '10px' }} key={habit.id}>
                  <button value={habit.id} name="habitId" type="submit">
                    {habit.name}
                  </button>
                </div>
              )
            })}
          </form>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0', padding: '0' }}>Today</h2>
          <div
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid blue',
              textAlign: 'left',
            }}
          >
            {data.trackedHabits.map((trackedHabit) => {
              return (
                <div style={{ margin: '10px' }} key={trackedHabit.id}>
                  <button>
                    {trackedHabit.habit.name} ({trackedHabit.count})
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
