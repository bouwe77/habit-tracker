const getUtcDateNow = () => getUtcDate(new Date())

const getUtcDate = (date: string | Date): Date => {
  let utcDate = date

  if (typeof utcDate === 'string') {
    if (!isValidDate(utcDate)) utcDate = new Date()
    else utcDate = new Date(utcDate)
  }

  utcDate.setUTCHours(0, 0, 0, 0)
  return utcDate
}

const isValidDate = (perhapsDate: string): boolean => {
  const date = new Date(perhapsDate)
  return date.toString() !== 'Invalid Date'
}

const formatDate = (date: Date) => date.toISOString().slice(0, 10)

export { getUtcDate, getUtcDateNow, isValidDate, formatDate }
