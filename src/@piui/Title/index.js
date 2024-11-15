import React from 'react';
import propTypes from 'prop-types';
import { TableHead, Table, Row, Cell } from '@piui/TabTable';
import { Delete } from '@piui';

import DialogAdd from './DialogAdd';
import { IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/pro-solid-svg-icons';

import DialogEdit from './DialogEdit';

const Title = ({ data, ...props }) => {
  const [ state, setState ] = React.useState({
    edit: null,
    remove: null,
  })


  const handleEditClose = () => setState(s=>({ ...s, edit:null }));
  const handleRemoveConfirm = async () => {
    await props.onRemoveOther(state.remove.index)();
    handleRemoveClose();
  }
  const handleRemoveOpen = index => () => {
    const title = data.submit.title.others[index];
    setState(s=>({ ...s, remove:{
      index: index,
      title:`Remove "${title.lang}" title`,
      label:`Do you want to delete "${title.lang}" title?`,
    }}))
  }
  const handleRemoveClose = () => setState(s=>({ ...s, remove:null }));

  
  const Edit = ({ id }) => {
    const labels = { tha:"Thai", eng:"English" };
    return ( props.onEdit && data.submit.step===0 )
      ? (<IconButton size="small"
        onClick={()=>setState(s=>({ 
          ...s,
          edit: {
            title: `Change "${labels[id]}" title`,
            value: data.submit.title[id],
            onEdit: props.onEdit(id),
            onClose: handleEditClose,
          }
        }))}
      ><FontAwesomeIcon icon={faEdit} size="xs" /></IconButton>)
      : null ;
  }
  const EditOther = ({ index }) => data.submit.step===0 && (<React.Fragment>
    { props.onEditOther && (<IconButton size="small" onClick={()=>setState(s=>({ 
        ...s,
        edit: {
          title: `Change "${data.submit.title.others[index].lang}" title`,
          value: data.submit.title.others[index].value,
          onEdit: props.onEditOther(index),
          onClose: handleEditClose,
        }
      }))}><FontAwesomeIcon icon={faEdit} size="xs" /></IconButton>) }
    { props.onRemoveOther && (<IconButton size="small" onClick={handleRemoveOpen(index)}>
      <FontAwesomeIcon icon={faTrash} size="xs" />
    </IconButton>) }
  </React.Fragment>);

  
  const TitleRow = props => (<Row>
    <Cell width="10%">{ props.lang }</Cell>
    <Cell width="90%">{ props.value }</Cell>
    <Cell style={{whiteSpace:"nowrap"}}>{ props.actions }</Cell>
  </Row>);


  return data.submit && data.submit.title && (<React.Fragment>
    <TableHead
      secondaryActions={ ( props.onAdd && data.submit.step===0 ) && (<DialogAdd onConfirm={props.onAdd} />) }
    >Title</TableHead>
    <Table>
      <TitleRow lang="Thai" value={data.submit.title.tha} actions={<Edit id="tha" />} />
      <TitleRow lang="English" value={data.submit.title.eng} actions={<Edit id="eng" />} />
      { data.submit.title.others.map((title,index)=><TitleRow key={index} {...title} actions={<EditOther index={index} />} />) }
    </Table>
    <DialogEdit data={state.edit} />
    <Delete data={state.remove} onDelete={handleRemoveConfirm} onClose={handleRemoveClose} />
  </React.Fragment>)
}
Title.propTypes = {
  data: propTypes.object.isRequired,
  onAdd: propTypes.func,
  onEdit: propTypes.func,
  onEditOther: propTypes.func,
  onRemoveOther: propTypes.func,
}

export default Title;