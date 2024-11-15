import React from 'react';
import propTypes from 'prop-types';
import { Title } from '@piui';


const EnhanceTitleTable = ({ data, onUpdate, ...props }) => {

  const handleAdd = async title => {
    const submit = await data.addOtherTitle(title.lang,title.value);
    onUpdate({ submit });
  }
  const handleEdit = lang => async value => {
    const submit = await data.setTitle(lang,value);
    onUpdate({ submit });
  }
  const handleEditOther = index => async value => {
    const submit = await data.setOtherTitle(index,value);
    onUpdate({ submit });
  }
  const handleRemoveOther = index => async () => {
    const submit = await data.removeOtherTitle(index);
    onUpdate({ submit });
  }

  return (<React.Fragment>
    <Title
      data={data}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onEditOther={handleEditOther}
      onRemoveOther={handleRemoveOther}
    />
  </React.Fragment>)
}
EnhanceTitleTable.propTypes = {
  data: propTypes.object.isRequired,
  onUpdate: propTypes.func.isRequired,
}

export default EnhanceTitleTable;