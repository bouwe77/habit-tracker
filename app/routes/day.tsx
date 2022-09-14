import { Habit, TrackedHabit } from '@prisma/client'
import {
  useLoaderData,
  redirect,
  LoaderFunction,
  ActionFunction,
  Link,
} from 'remix'
import {
  formatDate,
  getUtcDate,
  getUtcDateNow,
  isValidDate,
} from '~/utils/dates'
import {
  getAllHabits,
  getAllTrackedHabits,
  addTrackedHabit,
  removeTrackedHabit,
} from '~/db/queries'

type LoaderData = {
  habits: Habit[]
  trackedHabits: (TrackedHabit & { habit: Habit })[]
  formattedDate: string
  previousDate: string
  nextDate: string
}

export const loader: LoaderFunction = async ({ params }) => {
  let day = params.day

  // Redirect to today if no or an invalid date is provided
  if (!day || !isValidDate(day))
    return redirect('/day/' + formatDate(new Date()))

  const date = getUtcDate(day)

  const previousDate = new Date(day)
  previousDate.setDate(date.getDate() - 1)
  const nextDate = new Date(day)
  nextDate.setDate(date.getDate() + 1)

  const data: LoaderData = {
    habits: await getAllHabits(),
    trackedHabits: await getAllTrackedHabits(date),
    formattedDate: formatDate(date),
    previousDate: formatDate(previousDate),
    nextDate: formatDate(nextDate),
  }

  return data
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const what = form.get('what')
  const habitId = form.get('habitId')
  const date = form.get('date')

  if (
    typeof what !== 'string' ||
    typeof habitId !== 'string' ||
    typeof date !== 'string'
  ) {
    throw new Error(`Form not submitted correctly.`)
  }

  //TODO Input validation...

  if (what === 'add') await addTrackedHabit(habitId, getUtcDate(date))
  else await removeTrackedHabit(habitId, getUtcDate(date))

  return redirect(`/day/${date}`)
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
          <form method="post" action={`/day`}>
            <input type="hidden" name="what" value="add" />
            <input type="hidden" name="date" value={data.formattedDate} />
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
          <Link to={`/day/${data.previousDate}`}>prev</Link>
          <h2 style={{ margin: '0', padding: '0' }}>{data.formattedDate}</h2>
          <Link to={`/day/${data.nextDate}`}>next</Link>
          <div
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid blue',
              textAlign: 'left',
            }}
          >
            <form method="post" action={`/day`}>
              <input type="hidden" name="what" value="remove" />
              <input type="hidden" name="date" value={data.formattedDate} />
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
