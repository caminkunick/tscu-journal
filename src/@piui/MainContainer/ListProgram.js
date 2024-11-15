import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  IconButton,
  Dialog,
  Grid,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faFileAlt, faBook, faFileImage, faFile, faFileVideo, faMapMarkerAlt, faRoute } from '@fortawesome/pro-solid-svg-icons';


const useStyles = makeStyles(theme=>({
  root: {
    width: '100%',
    padding: theme.spacing(3),
    boxSizing: 'border-box',
  },
  button: {
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
    cursor: 'pointer',
    transition: 'background-color 0.25s',
    padding: theme.spacing(1),
    "& .MuiButton-label": {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
  },
}));


const ListProgram = props => {
  const classes = useStyles();
  const [ open, setOpen ] = React.useState(false);
  
  
  const menus = [
    {
      label: 'Output',
      items: [
        { label:'Article', to:'/article', icon:faFileAlt, },
        { label:'Book', to:'/book', icon:faBook, },
      ]
    },
    {
      label: 'Database',
      items: [
        { label:'Photo', to:'/photo', icon:faFileImage, },
        { label:'File', to:'/file', icon:faFile, },
        { label:'Video', to:'/video', icon:faFileVideo, },
        { label:'Marker', to:'/marker', icon:faMapMarkerAlt, },
        { label:'Route', to:'/route', icon:faRoute, },
      ],
    },
  ];
  
  
  const handleOpen = (newOpen) => () => setOpen(newOpen);
  
  
  return (<>
    <IconButton edge="end" color="inherit" onClick={handleOpen(true)}>
      <FontAwesomeIcon icon={faTh} />
    </IconButton>
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={handleOpen(false)}
    >
      <Paper className={classes.root}>
        {
          menus.map(menu=>(<React.Fragment key={menu.label}>
            <Typography color="textSecondary" paragraph>{menu.label}</Typography>
            <Grid container spacing={1}>
            {
              menu.items && menu.items.map((item,index)=>(<Grid item xs={6} md={4} key={index}>
                <Button className={classes.button} fullWidth onClick={handleOpen(false)} component={Link} to={item.to}>
                  <FontAwesomeIcon size="4x" icon={item.icon} />
                  <Typography>{item.label}</Typography>
                </Button>
              </Grid>))
            }
            </Grid>
          </React.Fragment>))
        }
      </Paper>
    </Dialog>
  </>)
}

export default ListProgram;