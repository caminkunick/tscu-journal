import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Box, Button, Divider, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { db } from 'Modules/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPlus, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { getAuthorName } from 'Method';
import { AuthorInfo, DialogDelete } from '@piui';


const getUserInfo = (jid) => async (dispatch,getState) => {
  const user = getState().user.data;
  const query = await db.collection('journals').doc(jid).collection('users').doc(user.uid).get();
  return query.data() ? query.data().info : null;
}
const setUserInfo = (jid,author) => async (dispatch,getState) => {
  const user = getState().user.data;
  await db.collection('journals').doc(jid).collection('users').doc(user.uid).set({
    info:author,
  }, {merge: true});
}

const TabAuthor = ({ jid, parentData, dispatch, ...props }) => {
  const [ data, setData ] = parentData;

  const changeUserInfo = async ({ sender, ...author }) => sender && await dispatch(setUserInfo(jid,author));
  const handleRemove = (index) => () => setData(d=>{
    let authors = [ ...d.authors ];
    authors.splice(index, 1);
    return { ...d, authors };
  })
  const handleAddAuthor = (author) => {
    setData(d=>({ ...d, authors:[ ...d.authors, author ] }));
    changeUserInfo(author);
  }
  const handleChangeAuthor = index => (author) => {
    setData(d=>{
      let authors = [ ...d.authors ];
      authors[index] = author;
      return { ...d, authors };
    });
    changeUserInfo(author);
  }

  React.useEffect(()=>{
    if(data.authors.filter(a=>Boolean(a.sender)).length===0){
      dispatch(getUserInfo(jid))
        .then(info=>{
          if(info){
            setData(d=>{
              let authors = [ ...d.authors ];
              authors.push({ ...info, sender:true });
              return { ...d, authors };
            })
          }
        })
    }
  }, [ jid, data.authors, setData, dispatch ])
  

  return (<React.Fragment>
    <List>
      <Divider />
      {
        data.authors.length
          ? data.authors.map((author,index)=>(<ListItem divider key={index}>
            <ListItemText
              primary={<>
                {getAuthorName(author.tha)} ({author.tha.dept})<br />
                {getAuthorName(author.eng)} ({author.eng.dept})
              </>}
              secondary={<>
                E-mail: {author.email}<br />
                Phone: {author.phone}
              </>}
            />
            <ListItemSecondaryAction>
                <AuthorInfo
                  data={author}
                  onConfirm={handleChangeAuthor(index)}
                  button={<IconButton title="Edit" size="small">
                    <FontAwesomeIcon icon={faPencilAlt} size="xs" />
                  </IconButton>}
                />
                <DialogDelete onDelete={handleRemove(index)}>
                  <IconButton size="small" title="Remove">
                    <FontAwesomeIcon size="xs" icon={faTrash} />
                  </IconButton>
                </DialogDelete>
            </ListItemSecondaryAction>
          </ListItem>))
          : (<ListItem divider>
            <ListItemText primary="no author" primaryTypographyProps={{color:'textSecondary'}} />
          </ListItem>)
      }
    </List>
    <Box mt={3} display="flex" justifyContent="center">
      <AuthorInfo
        onConfirm={handleAddAuthor}
        button={<Button variant="outlined"
          startIcon={<FontAwesomeIcon icon={faPlus} />}            
        >Add Author</Button>}
      />
    </Box>
  </React.Fragment>);
}
TabAuthor.propTypes = {
  jid: propTypes.string.isRequired,
  parentData: propTypes.array.isRequired,
};

export default connect()(TabAuthor);