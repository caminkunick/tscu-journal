import { faPlus, faTrash } from '@fortawesome/pro-solid-svg-icons';
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, IconButton, TextField as OTextField, withStyles } from '@material-ui/core';
import React from 'react';
import TabTitleAddLangDialog from './TabTitleAddLangDialog';

const TextField = withStyles(theme=>({
  root: {
    marginBottom: theme.spacing(3),
  },
}))(OTextField)

const TabTitle = ({ parentData, complete, ...props }) => {
  const [ data, setData ] = parentData;

  const handleChange = lang => ({ target }) => setData(s=>{
    let title = { ...s.title };
    title[lang] = target.value;
    return { ...s, title };
  })
  const handleOtherChange = index => ({ target }) => setData(d=>{
    let title = { ...d.title };
    title.others[index].value = target.value;
    return { ...d, title };
  })
  const handleDeleteOthers = index => () => setData(d=>{
    let title = { ...d.title };
    title.others.splice(index, 1);
    return { ...d, title };
  })

  const getProps = lang => ({
    fullWidth: true,
    value: data.title[lang],
    onChange: handleChange(lang),
    error: !Boolean(data.title[lang]),
    helperText: !Boolean(data.title[lang]) && '* please fill title',
  });

  return (<React.Fragment>
    <TextField
      label="Thai"
      autoFocus
      {...getProps('tha')}
    />
    <TextField
      label="English"
      {...getProps('eng')}
    />
    {
      data.title.others.map(({ lang, value },index)=>(<Box display="flex" alignItems="center" key={index} mb={3}>
        <TextField fullWidth
          label={lang}
          value={value}
          onChange={handleOtherChange(index)}
          style={{marginBottom:0,flexGrow:1}}
          error={!Boolean(value)}
          helperText={!Boolean(value) && '* please fill title'}
        />
        <IconButton size="small" onClick={handleDeleteOthers(index)}>
          <FontAwesomeIcon size="sm" icon={faTrash} />
        </IconButton>
      </Box>))
    }
    <TabTitleAddLangDialog parentData={parentData}>
      <Button variant="outlined" fullWidth
        startIcon={<FontAwesomeIcon icon={faPlus} />}
      >Add anothor language</Button>
    </TabTitleAddLangDialog>
  </React.Fragment>)
}
TabTitle.propTypes = {
  parentData: propTypes.array.isRequired,
};

export default TabTitle;