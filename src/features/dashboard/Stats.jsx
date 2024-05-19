import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import Stat from './Stat';
import { formatCurrency } from '../../utils/helpers';

function Stats({ bookings, confirmedStays, cabins, numDays }) {
  const sales = confirmedStays.reduce((acc, val) => acc + val.totalPrice, 0);

  const occupations =
    confirmedStays.reduce((acc, val) => acc + val.numNights, 0) /
    (cabins.length * numDays);

  return (
    <>
      <Stat
        icon={<HiOutlineBriefcase />}
        title='Bookings'
        value={bookings.length}
        color='blue'
      />
      <Stat
        icon={<HiOutlineBanknotes />}
        title='Sales'
        value={formatCurrency(sales)}
        color='green'
      />
      <Stat
        icon={<HiOutlineCalendarDays />}
        title='Check ins'
        value={confirmedStays.length}
        color='indigo'
      />
      <Stat
        icon={<HiOutlineChartBar />}
        title='Occupancy rate'
        value={Math.round(occupations * 100) + '%'}
        color='yellow'
      />
    </>
  );
}

export default Stats;
