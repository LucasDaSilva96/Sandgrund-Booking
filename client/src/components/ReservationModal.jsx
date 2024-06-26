import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentSelectedBooking,
  getCurrentSelectedBookingModified,
  getReservationModalStatus,
  toggleReservationModal,
} from '../redux/bookingSlice';
import { Divider, Typography } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeFilledOutlinedIcon from '@mui/icons-material/AccessTimeFilledOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import DescriptionTextBox from './DescriptionTextBox';
import Button from '@mui/material/Button';
import ChangeReservationStatusSelect from './ChangeReservationStatusSelect';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import GroupsIcon from '@mui/icons-material/Groups';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AssignGuideOrChangeGuideSelect from './AssignGuideOrChangeGuideSelect';
import { getCurrentUser } from '../redux/userSlice';
import { updateOneBooking } from '../utils/postData.js';
import { getAllGuides } from '../redux/guideSlice.js';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export default function ReservationModal() {
  const queryClient = useQueryClient(); // Initializing useQueryClient hook
  const modalOpen = useSelector(getReservationModalStatus); // Getting modal open status from Redux store
  const dispatch = useDispatch(); // Initializing useDispatch hook
  const selectedBooking = useSelector(getCurrentSelectedBooking); // Getting currently selected booking from Redux store
  const guide =
    useSelector(getAllGuides).find((el) => el._id === selectedBooking.guide) ||
    null; // Getting guide information from Redux store based on the selected booking
  const user = useSelector(getCurrentUser); // Getting current user information from Redux store
  const selectedBookingWasModified = useSelector(
    getCurrentSelectedBookingModified
  );
  const reservationModalStatus = useSelector(getReservationModalStatus); // Getting reservation modal status from Redux store
  const navigate = useNavigate(); // Initializing useNavigate hook

  // If selected booking start or end date is not available, return null
  if (!selectedBooking.start || !selectedBooking.end) return null;

  // Function to handle updating the booking
  const handleUpdateBookingClick = async () => {
    // If guide is assigned to the booking, update booking with guide's email
    if (selectedBooking.guide) {
      await updateOneBooking(
        user.token,
        selectedBooking,
        selectedBooking._id,
        guide.email
      );
      queryClient.invalidateQueries(); // Invalidate queries to fetch updated data
    } else {
      // If no guide is assigned, update booking without guide's email
      await updateOneBooking(user.token, selectedBooking, selectedBooking._id);
    }

    queryClient.invalidateQueries(); // Invalidate queries to fetch updated data
    // If reservation modal is open, close it
    if (reservationModalStatus) {
      dispatch(toggleReservationModal());
    }
  };

  // Function to toggle the reservation modal
  const toggleDrawer = (newOpen) => () => {
    dispatch(toggleReservationModal()); // Dispatching action to toggle reservation modal
  };
  // Extracting start hour and minute from selected booking start time
  const [startHour, startMinute] = selectedBooking.start
    .split('T')[1]
    .split('.')[0]
    .split(':');

  // Extracting end hour and minute from selected booking end time
  const [endHour, endMinute] = selectedBooking.end
    .split('T')[1]
    .split('.')[0]
    .split(':');

  // List of items to display in the drawer
  const DrawerList = (
    <List
      sx={{
        width: '110%',
        bgcolor: 'background.paper',
        display: 'grid',
        gridTemplateColumns: 'repeat( auto-fit, minmax(250px, 1fr) )',
        padding: '10px',
      }}
    >
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <CalendarMonthOutlinedIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary='Start Date'
          secondary={dayjs(selectedBooking.start).format('DD/MM/YYYY')}
        />
      </ListItem>

      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <AccessTimeFilledOutlinedIcon />
          </Avatar>
        </ListItemAvatar>

        <ListItemText
          primary='Start Time'
          secondary={[startHour, startMinute].join(':')}
        />
      </ListItem>

      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <EventBusyOutlinedIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary='End Date'
          secondary={dayjs(selectedBooking.end).format('DD/MM/YYYY')}
        />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <AccessTimeOutlinedIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary='End Time'
          secondary={[endHour, endMinute].join(':')}
        />
      </ListItem>

      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <LocalActivityIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          className={'status-text-' + selectedBooking.status}
          primary='Status'
          secondary={selectedBooking.status}
        />
      </ListItem>

      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <AccessibilityNewIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary='Group Leader'
          secondary={selectedBooking.contactPerson}
        />
      </ListItem>

      {selectedBooking.contactPhone ? (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <LocalPhoneIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary='Phone Number'
            secondary={selectedBooking.contactPhone}
          />
        </ListItem>
      ) : null}

      {selectedBooking.contactEmail ? (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <EmailIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary='Email'
            secondary={selectedBooking.contactEmail}
          />
        </ListItem>
      ) : null}

      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <GroupsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary='Participants'
          secondary={selectedBooking.participants}
        />
      </ListItem>

      {selectedBooking.guide ? (
        <ListItem>
          <ListItemAvatar>
            <Avatar alt={guide.fullName} src={guide.photo} />
          </ListItemAvatar>
          <ListItemText primary='Guide' secondary={guide.fullName} />
        </ListItem>
      ) : null}

      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <RestaurantMenuIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary='Coffee/Mingle'
          secondary={selectedBooking.snacks === true ? 'Yes' : 'No'}
        />
      </ListItem>
    </List>
  );

  return (
    <aside>
      <Drawer
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto',
          padding: '10px',
        }}
        anchor='right'
        open={modalOpen}
        onClose={toggleDrawer()}
      >
        <Typography variant='h5' align='center' sx={{ py: 1 }}>
          {selectedBooking.title}
        </Typography>
        {DrawerList}
        <Divider />
        {selectedBooking.description ? (
          <DescriptionTextBox description={selectedBooking.description} />
        ) : null}
        <Stack
          spacing={2}
          direction='row'
          sx={{
            alignSelf: 'center',
            marginTop: '10px',
            flexWrap: 'wrap',
            padding: '0 5px',
          }}
        >
          <Button
            variant='contained'
            size='medium'
            sx={{ minWidth: '150px' }}
            onClick={() => {
              return navigate(`booking/${selectedBooking._id}`);
            }}
          >
            Edit Reservation
          </Button>
          <ChangeReservationStatusSelect />
          <AssignGuideOrChangeGuideSelect />
        </Stack>
        {selectedBookingWasModified ? (
          <Button
            onClick={async () => await handleUpdateBookingClick()}
            variant='contained'
            color='success'
            sx={{
              width: '300px',
              alignSelf: 'center',
              marginTop: 'auto',
              marginBottom: '10px',
            }}
          >
            Save
          </Button>
        ) : null}
      </Drawer>
    </aside>
  );
}
