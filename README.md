# Habit Tracker

## TO DO

- Decrement TrackedHabit by clicking on it. If count 1: Delete the TrackedHabit record

- Add a "/day/$date" route (example: "/day/2022-01-12")

- Save TrackedHabit for the current day

- Navigate through days: prev/next

- Button "Today" which links to the "/day" route

- Add CSS styling: Tailwind

- Add a "/week" route, which shows the current week

- Add a "/week/$weeknumber" route

- Navigate between weeks with "next" and "previous"

- Display all days of the selected week

- Display all TrackedHabits per day

- List all Habits and counts for that week: Group TrackedHabits calculate their total counts

- Each Habit is either a "weekly" or "monthly" habit, and has a goal count

## DONE

- Create new Remix app

- Setup Prisma + Sqlite

- Seed script for habits

- Add a "/day" route

- List all habits from the database

- List all tracked habits for today

- Click on Habit to insert a TrackedHabit for today

- When a TrackedHabit was already inserted: update it (upsert)
