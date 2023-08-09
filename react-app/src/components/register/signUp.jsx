import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Input } from '@mui/material';
import axios, { Axios } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import Navbar from '../user/navbar';
import { useEffect } from 'react';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {

  const navigate = useNavigate();
  const { reffer } = useParams();
  const { setUser, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (reffer) {
      axios.get(`http://localhost:9000/public/api/add_visitors?code=${reffer}`);
    }
  }, [])
  const handleSubmit = (event) => {

    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
      phone_number: data.get('phone_number'),
      birthdate: data.get('birthdate'),
      user_image: data.get('user_image'),
      name: data.get('firstName'),
      refferer: data.get('refferer')
    });


    axios.post('http://localhost:9000/public/api/signup', data).then((res) => {

      if (res.data.user) {
        setUser(res.data.user)
        setIsLoggedIn(true)
        sessionStorage.setItem('token', res.data.user.api_token)
        navigate('/user')
      }

    });
  };

  return (
    <>
      <Navbar />
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    autoComplete="given-name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    required
                    fullWidth
                    name="user_image"
                    label="Upload Image"
                    type="file"
                    id="user_image"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="phone_number"
                    label="Phone Number"
                    type="text"
                    id="phone_number"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="birthdate"
                    label="Birth Date:"
                    type="text"
                    id="birthdate"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="refferer"
                    label="Referrer Code"
                    type="text"
                    id="refferer"
                    defaultValue={reffer}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </>

  );
}