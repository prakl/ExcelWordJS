import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import Dropzone from './Dropzone';

export default function TemplateForm() {
  const [template, setTemplate] = useState(null);
  useEffect(() => {
    axios.get('/api/template-data').then((response) => {
      setTemplate(response.data);
    });
  }, []);

  const handleTemplateDrop = (files) => {
    if (files.length) {
      const formData = new FormData();
      formData.append('template', files[0]);
      axios.post('/api/upload-template', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => setTemplate(response.data));
    }
  };

  const handleDeleteTemplate = () => {
    if (template) {
      axios.delete('/api/template').then(() => {
        setTemplate(null);
      });
    }
  };

  return (
    <>
      <Typography variant="h6" component="div" sx={{ padding: '0 10px' }}>
        Шаблон
      </Typography>
      {template && <>
        <Typography sx={{ padding: '0 10px' }}>
          Загруженный шаблон: {template.name}
        </Typography>
        <IconButton aria-label="delete" sx={{ padding: '3px' }} onClick={handleDeleteTemplate}>
          <DeleteIcon />
        </IconButton>
        <IconButton aria-label="download" sx={{ padding: '3px' }} href="/api/template">
          <DownloadIcon />
        </IconButton>
      </>}
      {!template && <Dropzone onDrop={handleTemplateDrop} />}
    </>
  );
}
