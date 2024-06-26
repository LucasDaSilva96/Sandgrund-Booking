import axios from 'axios';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('UTC');
dayjs.extend(isSameOrBefore);

export const fetchAllBookingsByYear = async (
  year = new Date().getFullYear()
) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/tours/bookings?year=${year}`
    );

    return res.data.result;
  } catch (e) {
    toast.error('ERROR: ', +e.response.data.message);
  }
};

export const fetchAllGuides = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/guides/getGuides`
    );

    return res.data.guides;
  } catch (e) {
    toast.error('ERROR: ', +e.response.data.message);
  }
};

export const fetchAllYearsDoc = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/tours/tourDocs`
    );

    return res.data.data;
  } catch (e) {
    toast.error('ERROR: ', +e.response.data.message);
  }
};

export const getFilteredBookings = (
  allTourYearDocs,
  year,
  filterObjOptions
) => {
  const toastId = toast.loading('Loading...');
  const bookingDoc = allTourYearDocs.find((booking) => booking.year === year);

  if (!bookingDoc) {
    toast.dismiss(toastId);
    return []; // No bookings found for the given year
  }

  const OBJ = { ...filterObjOptions };

  for (const [KEY, VALUE] of Object.entries(filterObjOptions)) {
    if (VALUE === '' || VALUE === undefined || VALUE === null) {
      delete OBJ[KEY];
    }
  }

  const filteredBookings = bookingDoc.bookings.filter((booking) => {
    let shouldInclude = true; // Assume booking should be included by default

    for (const [key, value] of Object.entries(OBJ)) {
      switch (key) {
        case 'guide':
          if (booking.guide !== value) {
            shouldInclude = false;
          }
          break;
        case 'title':
          if (!booking.title.includes(value)) {
            shouldInclude = false;
          }
          break;
        case 'status':
          if (booking.status !== value && value !== 'All') {
            shouldInclude = false;
          }
          break;
        case 'start':
          const startInput = dayjs(value).toDate();
          const startInputDate = new Date(startInput);
          const startBooking = dayjs(booking.start).toDate();
          const startBookingDate = new Date(startBooking);

          startInputDate.setHours(0, 0, 0, 0);
          startBookingDate.setHours(0, 0, 0, 0);

          if (startBookingDate.getTime() < startInputDate.getTime()) {
            shouldInclude = false;
          }
          break;
        case 'contactPerson':
          if (!String(booking.contactPerson).includes(value)) {
            shouldInclude = false;
          }
          break;
        case 'contactPhone':
          if (String(booking.contactPhone) !== String(value)) {
            shouldInclude = false;
          }
          break;
        case 'contactEmail':
          if (String(booking.contactEmail) !== String(value)) {
            shouldInclude = false;
          }
          break;
        case 'snacks':
          if (booking.snacks !== value && value !== 'All') {
            shouldInclude = false;
          }
          break;
        default:
          break;
      }

      // If shouldInclude is false for any condition, no need to check further
      if (!shouldInclude) {
        break;
      }
    }

    return shouldInclude;
  });

  toast.dismiss(toastId);
  return filteredBookings;
};

export const getResetPasswordToken = async (email) => {
  const toastId = toast.loading('Loading...');
  if (!email) {
    toast.dismiss(toastId);
    toast.error('No email provided');
    return {
      status: 'fail',
      resetToken: null,
    };
  }
  try {
    const req = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/v1/users/resetPassword`,
      {
        email,
      }
    );

    toast.success('Token successfully retrieved.');
    return {
      status: 'success',
      resetToken: req.data.resetToken,
    };
  } catch (e) {
    toast.error('ERROR: ' + e.response.data.message);
    return {
      status: 'fail',
      resetToken: null,
    };
  } finally {
    toast.dismiss(toastId);
  }
};
