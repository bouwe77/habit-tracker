const getUtcDateNow = () => getUtcDate(new Date())

const getUtcDate = (date: Date) => {
  date.setUTCHours(0, 0, 0, 0)
  return date
}

const isValidDate = (perhapsDate: string): boolean => {
  const date = new Date(perhapsDate)
  return date.toString() !== 'Invalid Date'
}

const formatDate = (date: Date) => date.toISOString().slice(0, 10)

export { getUtcDate, getUtcDateNow, isValidDate, formatDate }
