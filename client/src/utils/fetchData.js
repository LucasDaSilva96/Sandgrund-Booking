import axios from "axios";
import dayjs from "dayjs";
import toast from "react-hot-toast";

// TODO Update all URL's after deployment

export const fetchAllBookingsByYear = async (
  token,
  year = new Date().getFullYear()
) => {
  if (!token) {
    toast.error("No user-token provided.");
    return null;
  }
  try {
    const res = await axios.get(
      `http://localhost:8000/api/v1/tours/bookings?year=${year}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data.result;
  } catch (e) {
    toast.error("ERROR: ", +e.response.data.message);
  }
};

export const fetchAllGuides = async (token) => {
  if (!token) {
    toast.error("No user-token provided.");
    return null;
  }

  try {
    const res = await axios.get(
      `http://localhost:8000/api/v1/guides/getGuides`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.guides;
  } catch (e) {
    toast.error("ERROR: ", +e.response.data.message);
  }
};

export const fetchAllYearsDoc = async (token) => {
  if (!token) {
    toast.error("No user-token provided.");
    return null;
  }

  try {
    const res = await axios.get(`http://localhost:8000/api/v1/tours/tourDocs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (e) {
    toast.error("ERROR: ", +e.response.data.message);
  }
};

export const getFilteredBookings = (
  allTourYearDocs,
  year,
  filterObjOptions
) => {
  const toastId = toast.loading("Loading...");
  const bookingDoc = allTourYearDocs.find((booking) => booking.year === year);

  if (!bookingDoc) {
    toast.dismiss(toastId);
    return []; // No bookings found for the given year
  }

  const OBJ = { ...filterObjOptions };

  for (const [KEY, VALUE] of Object.entries(filterObjOptions)) {
    if (VALUE === "" || VALUE === undefined || VALUE === null) {
      delete OBJ[KEY];
    }
  }

  const filteredBookings = bookingDoc.bookings.filter((booking) => {
    let shouldInclude = true; // Assume booking should be included by default

    for (const [key, value] of Object.entries(OBJ)) {
      switch (key) {
        case "guide":
          if (booking.guide === value) {
            return (shouldInclude = true);
          } else {
            return (shouldInclude = false);
          }

        case "title":
          if (!booking.title.includes(value)) {
            shouldInclude = false;
          }
          break;
        case "status":
          if (booking.status !== value) {
            shouldInclude = false;
          }
          break;
        case "start":
          const start = new Date(booking.start).toISOString().split("T")[0];
          const Value = new Date(value).toISOString().split("T")[0];

          if (start !== Value) {
            shouldInclude = false;
          } else {
            shouldInclude = true;
          }
          break;
        case "contactPerson":
          if (!String(booking.contactPerson).includes(value)) {
            shouldInclude = false;
          }
          break;
        case "contactPhone":
          if (String(booking.contactPhone) !== String(value)) {
            shouldInclude = false;
          }
          break;
        case "contactEmail":
          if (String(booking.contactEmail) !== String(value)) {
            shouldInclude = false;
          }
          break;
        case "snacks":
          if (booking.snacks !== value) {
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
