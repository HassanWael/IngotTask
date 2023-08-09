import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
export default function Navbar() {

  const navigate = useNavigate();
  const { setUser, setIsLoggedIn, user, isLoggedIn } = useContext(AuthContext);

  const logout = () => {
    sessionStorage.clear()
    localStorage.clear()
    setIsLoggedIn(false)
    setUser({})
    window.location.reload(false);
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Ingot Brokers Inc.
          </Typography>
          {
            isLoggedIn ?
              user.is_admin ?
                <>
                  <Button color="inherit">{user.name}</Button>
                </>
                :
                <Button color="inherit">{user.name}</Button>
              :
              <>
              <Button onClick={()=>{navigate('/signin')}} color="inherit">Login</Button>
              <Button onClick={()=>{navigate('/signup')}} color="inherit">Signup</Button>
              </>
          }
          {
            isLoggedIn ?
              <Button onClick={logout} color="inherit">Logout</Button>
              :
              ""
          }

        </Toolbar>
      </AppBar>
    </Box>
  );
}