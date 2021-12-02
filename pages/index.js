import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AliasForm from '../components/AliasForm';
import TemplateForm from '../components/TemplateForm';
import DataForm from '../components/DataForm';

export default function Home() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Гаражный кооператив &quot;Ромашка&quot;
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ marginTop: '20px' }}>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <Paper elevation={3} >
              <TemplateForm />
            </Paper>
            <Paper elevation={3} sx={{ marginTop: '10px' }}>
              <DataForm />
            </Paper>
          </Grid>
          <Grid item xs={7}>
            <Paper elevation={3}>
              <Typography variant="h6" component="div" sx={{ padding: '0 10px' }}>
                Алиасы
              </Typography>
              <AliasForm />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>

  );
}
