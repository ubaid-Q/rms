import React, { useEffect, useState } from 'react';
import { Container, Box, TextField, Button, Typography, Link, Theme, ThemeProvider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import NextLink from 'next/link';
import { login } from './service';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f0f0f0', // Background color based on theme mode
  },
  loginBox: {
    maxWidth: '400px',
    padding: theme.spacing(4),
    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff', // Background color based on theme mode
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  inputGroup: {
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
  footer: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  homeButton: {
    marginTop: theme.spacing(2),
  },
  link: {
    textDecoration: 'none',
  },
}));

export default function Login({ darkMode, toggleDarkMode }) {
  const classes = useStyles();
  const [admin, setAdmin] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (admin) {
      localStorage.setItem('adminData', JSON.stringify(admin));
    }
  }, [admin]);

  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(formData.get('email'), formData.get('password'));
    const success = await login({ email: formData.get('email'), password: formData.get('password') }, setAdmin);
    if (success) router.push('/dashboard');
  };

  return (
    <div className={classes.root}>
      <Container className={classes.loginBox}>
        <Typography variant="h4" className={classes.title} align="center">
          Login
        </Typography>
        <form onSubmit={submitForm}>
          <Box className={classes.inputGroup}>
            <TextField fullWidth label="Email" name="email" variant="outlined" required />
          </Box>
          <Box className={classes.inputGroup}>
            <TextField fullWidth label="Password" type="password" name="password" variant="outlined" required />
          </Box>
          <Button fullWidth variant="contained" color="primary" className={classes.submitButton} type="submit">
            Login
          </Button>
        </form>
        <Box className={classes.footer}>
          <NextLink href="/dashboard" passHref>
            <Button fullWidth variant="outlined" color="primary" className={classes.homeButton}>
              Home
            </Button>
          </NextLink>
        </Box>
      </Container>
    </div>
  );
}
