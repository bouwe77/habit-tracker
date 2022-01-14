import { Habit, TrackedHabit } from '@prisma/client'
import { useLoaderData, redirect, LoaderFunction, ActionFunction } from 'remix'
import { getUtcDateNow } from '~/utils/dates'
import {
  getAllHabits,
  getAllTrackedHabits,
  addTrackedHabit,
  removeTrackedHabit,
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
  const what = form.get('what')
  const habitId = form.get('habitId')

  if (typeof habitId !== 'string' || typeof what !== 'string') {
    throw new Error(`Form not submitted correctly.`)
  }

  //TODO Input validation on format for habitId and removeHabitId...

  if (what === 'add') await addTrackedHabit(habitId, getUtcDateNow())
  else await removeTrackedHabit(habitId, getUtcDateNow())

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
            <input type="hidden" name="what" value="add" />
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
            <form method="post">
              <input type="hidden" name="what" value="remove" />
              {data.trackedHabits.map((trackedHabit) => {
                return (
                  <div style={{ margin: '10px' }} key={trackedHabit.id}>
                    <button
                      value={trackedHabit.habit.id}
                      name="habitId"
                      type="submit"
                    >
                      {trackedHabit.habit.name} ({trackedHabit.count})
                    </button>
                  </div>
                )
              })}
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
