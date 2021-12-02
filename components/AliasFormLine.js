import * as React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Checkbox from '@mui/material/Checkbox';

const Wrapper = styled.div`
  padding: 10px;
  display: flex;
  flex-wrap: nowrap;
`;

export default function AliasFormLine({
  showAddBtn, onAddAlias, onRemoveAlias, data, onDataChange,
}) {
  const handleFieldChange = (field) => (e) => {
    onDataChange({
      ...data,
      [field]: e.target.value,
    });
  };

  const handleIsDebtChange = (e) => {
    onDataChange({
      ...data,
      isDebt: e.target.checked,
    });
  };

  return (
    <Wrapper>
      <TextField label="Алиас" variant="standard" sx={{ marginRight: '10px' }} value={data.alias} onChange={handleFieldChange('alias')} />
      <TextField label="Столбец" variant="standard" sx={{ marginRight: '10px' }} value={data.column} onChange={handleFieldChange('column')} />
      <TextField label="Строка" variant="standard" sx={{ marginRight: '10px' }} value={data.row} onChange={handleFieldChange('row')} />
      <Checkbox checked={data.isDebt} onChange={handleIsDebtChange} sx={{ padding: '3px', marginTop: '18px' }} />
      <IconButton aria-label="delete" sx={{ padding: '3px', marginTop: '18px' }} onClick={onRemoveAlias}>
        <DeleteIcon />
      </IconButton>
      {showAddBtn && <IconButton aria-label="add" sx={{ padding: '3px', marginTop: '18px' }} onClick={onAddAlias}>
        <AddIcon />
      </IconButton>}
    </Wrapper>
  );
}

AliasFormLine.propTypes = {
  showAddBtn: PropTypes.bool,
  onAddAlias: PropTypes.func.isRequired,
  onRemoveAlias: PropTypes.func.isRequired,
  onDataChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

AliasFormLine.defaultProps = {
  showAddBtn: true,
};
