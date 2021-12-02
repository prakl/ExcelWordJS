import * as React from 'react';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import AliasFormLine from './AliasFormLine';

const sendDBData = _.debounce((data) => {
  axios.post('/api/alias', data);
}, 500);

const sendDBIndexes = _.debounce((data) => {
  axios.post('/api/indexes', data);
}, 500);

export default function AliasForm() {
  const [aliases, setAliases] = useState([]);
  const [indexes, setIndexes] = useState({ header: '', first: '', last: '' });
  useEffect(() => {
    axios.get('/api/alias').then((response) => {
      setAliases(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get('/api/indexes').then((response) => {
      setIndexes(response.data);
    });
  }, []);

  const handleAddAlias = () => {
    const newAliases = [...aliases, {
      alias: '', column: '', row: '', isDebt: false,
    }];
    setAliases(newAliases);
    sendDBData(newAliases);
  };

  const handleRemoveAlias = (idx) => () => {
    const newAliases = [...aliases.slice(0, idx), ...aliases.slice(idx + 1)];
    setAliases(newAliases);
    sendDBData(newAliases);
  };

  const handleDataChange = (idx) => (data) => {
    const newAliases = [...aliases.slice(0, idx), data, ...aliases.slice(idx + 1)];
    setAliases(newAliases);
    sendDBData(newAliases);
  };

  const handleIndexesChange = (index) => (e) => {
    const newIndexes = {
      ...indexes,
      [index]: e.target.value,
    };
    setIndexes(newIndexes);
    sendDBIndexes(newIndexes);
  };

  return (
    <div>
      <div style={{ paddingLeft: '10px' }}>
        <TextField label="Строка заголовка" variant="standard" sx={{ marginRight: '10px' }} value={indexes.header} onChange={handleIndexesChange('header')} />
        <TextField label="Первая строка" variant="standard" sx={{ marginRight: '10px' }} value={indexes.first} onChange={handleIndexesChange('first')} />
        <TextField label="Последняя строка" variant="standard" sx={{ marginRight: '10px' }} value={indexes.last} onChange={handleIndexesChange('last')} />
      </div>
      {
        Boolean(aliases.length) && aliases.map((item, idx) => (
          <AliasFormLine
            onRemoveAlias={handleRemoveAlias(idx)}
            onDataChange={handleDataChange(idx)}
            onAddAlias={handleAddAlias}
            data={item}
            key={idx}
            showAddBtn={idx === aliases.length - 1}
          />
        ))
      }
      {
        aliases.length === 0 && <Button variant="contained" sx={{ margin: '20px' }} onClick={handleAddAlias}>Создать</Button>
      }
    </div>
  );
}

// AliasForm.propTypes = {
//   data: PropTypes.array.isRequired,
//   onAddAlias: PropTypes.func.isRequired,
//   onDataChange: PropTypes.func.isRequired,
//   onRemoveAlias: PropTypes.func.isRequired,
// };
