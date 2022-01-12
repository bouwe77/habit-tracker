const isValidDate = (perhapsDate: string): boolean => {
  const date = new Date(perhapsDate)
  return date.toString() !== 'Invalid Date'
}

const formatDate = (date: Date) => date.toISOString().slice(0, 10)

export { isValidDate, formatDate }
