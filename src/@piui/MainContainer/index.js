import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  withStyles,
  withWidth,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/pro-solid-svg-icons';
import './main-container.scss';
import Profile from './Profile';
import SignIn from '../SignIn';
import logo from 'Assets/journal-logo.svg';
import { Link } from 'react-router-dom';
// import ListProgram from './ListProgram';

const sidebarWidth = 320;
const styles = theme=>({
  root: {
    width: '100%',
    height: '100vh',
    backgroundColor: theme.palette.background.main,
    display: 'flex',
    flexDirection: 'column',
    color: "#333333",
  },
  appbar: {
    boxShadow: theme.shadows[0],
    backgroundColor: "black",
    color: 'white',
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    maxHeight: 'calc(100vh - 64px)',
    overflow: 'hidden',
  },
  sidebar: {
    width: sidebarWidth,
    backgroundColor: theme.palette.grey[50],
    overflow: 'auto',
    paddingBottom: theme.spacing(5),
  },
  drawer: {
    display: 'flex',
    flexDirection: 'column',
  },
  paper: {
    maxWidth: '75vw',
    width: sidebarWidth,
    flexGrow: 1,
    overflow: 'hidden',
  },
  scroll: {
    maxHeight: 'calc(100vh - 64px)',
    overflow: 'auto',
    boxSizing: 'border-box',
    paddingBottom: theme.spacing(5),
    scrollBehavior: 'smooth',
  },
  content: {
    maxHeight: 'calc(100vh - 64px)',
    flexGrow: 1,
    overflow: 'auto',
    boxSizing: 'border-box',
  }
});

const MainContainer = ({ classes, width, ...props }) => {
  const { user } = props;
  const isMobile = ["xs","sm"].includes(width);
  const [ open, setOpen ] = React.useState({
    sidebar: false,
  })
  
  const handleOpen = (key,value) => () => setOpen(o=>({ ...o, [key]:value }));
  
  const ToggleButton = props => (<IconButton color="inherit" edge="start" onClick={handleOpen('sidebar',!open.sidebar)}>
    <FontAwesomeIcon icon={faBars} />
  </IconButton>)
  
  if( props.signInOnly && !user ){
    return (<SignIn />)
  } else {
    return (<div className={clsx('main-container',classes.root)}>
      <AppBar className={classes.appbar} position="fixed" color="default">
        <Toolbar>
          { (props.sidebar&&isMobile) ? <ToggleButton /> : null }
          <Box mx={2} component={Link} to="/">
            <img src={logo} alt="logo" style={{height:40}} />
          </Box>
          <Box flexGrow={1} />
          <Profile />
          {/*
            <ListProgram />
          */}
        </Toolbar>
      </AppBar>
      <Toolbar />
      <main className={classes.main}>
        {
          props.sidebar && !isMobile
            ? (<div className={classes.sidebar}>{ props.sidebar }</div>)
            : null
        }
        <div className={classes.content}>
          <Box py={props.dense ? 0 : 10}>
            { props.children }
          </Box>
        </div>
      </main>
      {
        ( props.sidebar && isMobile )
          ? (<Drawer className={classes.drawer} open={open.sidebar} onClose={handleOpen('sidebar',false)}>
            <div className={clsx(classes.sidebar,classes.paper)}>
              <Toolbar>
                <ToggleButton />
              </Toolbar>
              <Divider />
              <Box className={classes.scroll} flexGrow={1}>{ props.sidebar }</Box>
            </div>
          </Drawer>)
          : null
      }
    </div>)
  }
}

export default withStyles(styles)(withWidth()(connect(s=>({ user:s.user.data }))(MainContainer)));