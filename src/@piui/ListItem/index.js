import {
  ListItem,
  withStyles,
} from '@material-ui/core';

export default withStyles(theme=>({
  root:{
    
  },
  selected: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: 'white',
    transition: 'background-color 0.25s',
    "&:hover": {
      backgroundColor: `${theme.palette.primary.dark} !important`,
    }
  },
}))(ListItem)