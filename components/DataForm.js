import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import Dropzone from './Dropzone';

export default function DataForm() {
  const [datasheet, setDatasheet] = useState(null);
  useEffect(() => {
    axios.get('/api/datasheet-data').then((response) => {
      setDatasheet(response.data);
    });
  }, []);

  const handleDatasheetDrop = (files) => {
    if (files.length) {
      const formData = new FormData();
      formData.append('datasheet', files[0]);
      axios.post('/api/upload-datasheet', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => setDatasheet(response.data));
    }
  };

  const handleDeleteDatasheet = () => {
    if (datasheet) {
      axios.delete('/api/datasheet').then(() => {
        setDatasheet(null);
      });
    }
  };

  const handleGenerateClick = () => {
    window.location.href = '/api/generate';
  };

  return (
    <>
      <Typography variant="h6" component="div" sx={{ padding: '0 10px' }}>
        Данные
      </Typography>
      {datasheet && <>
        <Typography sx={{ padding: '0 10px' }}>
          Загруженный файл: {datasheet.name}
        </Typography>
        <IconButton aria-label="delete" sx={{ padding: '3px' }} onClick={handleDeleteDatasheet}>
          <DeleteIcon />
        </IconButton>
        <IconButton aria-label="download" sx={{ padding: '3px' }} href="/api/datasheet">
          <DownloadIcon />
        </IconButton>
        <Button variant="contained" onClick={handleGenerateClick}>Сгенерировать</Button>
      </>}
      {!datasheet && <Dropzone onDrop={handleDatasheetDrop} />}
    </>
  );
}
