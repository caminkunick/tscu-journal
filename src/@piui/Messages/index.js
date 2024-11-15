import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import propTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faUpload, faDownload } from '@fortawesome/pro-solid-svg-icons';

const useStyles = makeStyles(theme=>({
  admin: {
    '& .sender': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    '& .sender:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  user: {
    '& .receiver': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    '& .receiver:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const getTime = ts => ( ts ? ts.toMillis : false ) ? moment(ts.toMillis()).format('LLL') : null ;
const ShowMessage = ({ msg, ...props }) => {
  const [ open, setOpen ] = React.useState(false);
  const handleOpen = o => () => setOpen(o);
  const children = React.cloneElement(props.children, {
    onClick: ()=>setOpen(!open),
  })
  return (<>
    { children }
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleOpen(false)}
    >
      <DialogTitle>Message</DialogTitle>
      <DialogContent>
        <TextField fullWidth multiline label="Message" value={msg.message} readOnly InputProps={{disableUnderline:true}} />
        {
          msg.files.length
            ? (<Box mt={2}>
              <List subheader={<ListSubheader>Attach File:</ListSubheader>}>
                <Divider />
                {
                  msg.files.map((file,index)=>(<ListItem button divider key={index}>
                    <ListItemIcon>
                    {
                      file.type.includes('image/')
                        ? <Avatar variant="square" src={file.thumbnail || file.url} />
                        : <Avatar variant="square"><FontAwesomeIcon icon={faFileAlt} /></Avatar>
                    }
                    </ListItemIcon>
                    <ListItemText primary={<a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>} />
                  </ListItem>))
                }
              </List>
            </Box>)
            : null
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  </>)
}

const Messages = props => {
  const classes = useStyles();
  const { msgs } = props;

  const getSort = msg => msgs.sort((a,b)=>{
    let aTime = Date.now();
    let bTime = Date.now();
    try{
      aTime = typeof a.timestamp === 'number' ? a.timestamp : a.timestamp.toMillis();
    }catch(err){ }
    try{
      bTime = typeof b.timestamp === 'number' ? b.timestamp : b.timestamp.toMillis();
    }catch(err){ }
    return bTime - aTime;
  })

  const getIcon = type => (<FontAwesomeIcon
    icon={
      props.variant==='administrator'
        ? ( type==='sender' ? faDownload : faUpload )
        : ( type==='sender' ? faUpload : faDownload )
    }
    style={{marginRight:'0.5rem'}}
  />)

  return (<>
    <List className={ props.variant==='administrator' ? classes['admin'] : classes['user'] }>
      <Divider />
      {
        msgs.length
          ? getSort(msgs).map(msg=>(<React.Fragment key={msg.id}>
            <ShowMessage msg={msg}>
              <ListItem dense button divider className={clsx(msg.type,classes.listitem)}>
                <ListItemText
                  primary={<Box display="flex">
                    <Box flexGrow={1}>
                      <Typography>{ getIcon(msg.type) }{ msg.message }</Typography>
                    </Box>
                    <Box ml={1}>{ msg.files.length ? (<>&nbsp;({ msg.files.length } files)</>) : null }</Box>
                    <Box ml={1}>{ getTime(msg.timestamp) }</Box>
                  </Box>}
                />
              </ListItem>
            </ShowMessage>
          </React.Fragment>))
          : (<ListItem divider>
            <ListItemText primary="Empty" primaryTypographyProps={{color:'textSecondary'}} />
          </ListItem>)
      }
    </List>
  </>);
}
Messages.propTypes = {
  msgs: propTypes.array.isRequired,
};

export default Messages;
