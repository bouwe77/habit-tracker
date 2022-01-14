import { redirect } from 'remix'
import type { LoaderFunction } from 'remix'
import { formatDate } from '~/utils/dates'

export const loader: LoaderFunction = async () => {
  return redirect('/day/' + formatDate(new Date()))
}
