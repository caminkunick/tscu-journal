import React from 'react';
import {
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/pro-solid-svg-icons';
import { MainContainer, DialogDelete, ContentHeader } from '@piui';
import Sidebar from '../Sidebar';
import { getEditor, addEditor, removeEditor } from './func';
import AddEditor from './AddEditor';


const PageEditor = props => {
  const { jid } = props.match.params;
  const [ state, setState ] = React.useState({
    fetched: false,
    editors: [],
    users: [],
  });
  
  
  const getEditorName = editor => {
    if(editor.info){
      const { tha, eng, email } = editor.info;
      return (
        (<>
          {tha && `${tha.title==="อื่นๆ" ? tha.othertitle : tha.title}${tha.fname} ${tha.sname}`}
          <br />
          {eng && `${eng.title==="Others" ? eng.othertitle : eng.title} ${eng.fname} ${eng.sname}`}
        </>)
        || email
      )
    }
    return editor.uid;
  }
  const handleAdd = async uid => {
    await addEditor({ jid, uid })
    const data = await getEditor(jid)
    setState(s=>({ ...s, ...data }));
    return true;
  }
  const handleRemove = uid => async () => {
    await removeEditor({ jid, uid })
    const data = await getEditor(jid)
    setState(s=>({ ...s, ...data }));
    return true;
  }
  
  
  React.useState(()=>{
    document.title = `Editor | Phra.in`;
    getEditor(jid).then(data=>setState(s=>({ ...s, ...data, fetched:true })));
  }, [ jid ])
  
  
  return (<MainContainer sidebar={<Sidebar jid={jid} selected="editor" />}>
    <Container maxWidth="md">
      <ContentHeader
        label="Reviewer"
        breadcrumbs={[
          { label:"Home", to:`/` },
          { label:"Administrator" },
        ]}
        secondaryActions={<AddEditor users={state.users} onAdd={handleAdd} />}
      />
      <List>
        <Divider />
      {
        state.fetched
          ? (
            state.editors.length
              ? state.editors.map(editor=>(<ListItem dense divider button title={`UID: ${editor.uid}`} key={editor.uid}>
                <ListItemText
                  primary={getEditorName(editor)}
                  secondary={(editor&&editor.info&&editor.info.email)}
                  secondaryTypographyProps={{variant:'caption'}}
                />
                <ListItemSecondaryAction>
                  <DialogDelete onDelete={handleRemove(editor.uid)}>
                    <IconButton size="small">
                      <FontAwesomeIcon icon={faTrash} size="xs" />
                    </IconButton>
                  </DialogDelete>
                </ListItemSecondaryAction>
              </ListItem>))
              : (<ListItem dense divider>
                <ListItemText primary={<Typography color="textSecondary">no editor</Typography>} />
              </ListItem>)
          )
          : (<ListItem dense divider>
            <ListItemText primary={<Skeleton width={`50%`} />} />
          </ListItem>)
      }
      </List>
    </Container>
  </MainContainer>)
}

export default PageEditor;