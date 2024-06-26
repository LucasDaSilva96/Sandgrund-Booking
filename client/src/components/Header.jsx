import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, login } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { logUserOut } from "../utils/postData";
import { forgetMe } from "../utils/rememberMe";
import toast from "react-hot-toast";

// Array of pages for navigation
const pages = [
  "Calendar",
  "Overview",
  "Guides",
  "Search-Bookings",
  "New-Booking",
];

// Array of settings
const settings = ["Account", "Logout"];

// Header component
function Header() {
  const user = useSelector(getCurrentUser); // Getting current user from Redux store
  const [anchorElNav, setAnchorElNav] = useState(null); // State for navigation menu anchor element
  const [anchorElUser, setAnchorElUser] = useState(null); // State for user menu anchor element
  const navigate = useNavigate(); // Navigate function from react-router-dom
  const dispatch = useDispatch(); // Dispatch function from Redux

  // Function to handle logout
  const handleLogout = async () => {
    if (await logUserOut()) {
      forgetMe(); // Clearing remember me
      // Dispatching login action with empty user data
      dispatch(
        login({
          email: "",
          name: "",
          photo: "",
          role: "",
          _id: "",
          token: "",
          isLoggedIn: false,
        })
      );

      window.location.replace("/"); // Redirecting to home
      window.location.assign("/");
    } else {
      toast.error("Error: Could't log the user out."); // Error toast
      return null;
    }
  };

  // Function to open navigation menu
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  // Function to open user menu
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // Function to close navigation menu
  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null);

    if (page && typeof page === "string") {
      switch (page) {
        case "Calendar":
          navigate("/"); // Navigate to calendar
          break;
        case "New-Booking":
          const dateStr = new Date().toISOString().split("T")[0];
          navigate(`newReservation/${dateStr}`);
          break;
        default:
          navigate(`/${page}`);
          break;
      }
    }
  };

  // Function to close user menu
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
            }}
          >
            <img
              src="/android-chrome-192x192.png"
              alt="logo"
              className=" max-h-14"
            />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          ></Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user.name} src={user.photo} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar__small"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <div
                    onClick={async () => {
                      switch (setting) {
                        case "Account":
                          navigate(setting);
                          break;
                        case "Logout":
                          await handleLogout();
                          break;

                        default:
                          return null;
                      }
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </div>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
