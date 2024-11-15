import React from 'react';
import { Link as L } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  withStyles,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

const Header = withStyles(theme=>({
  root: {
    flexGrow: 1,
    fontFamily: 'Prompt, Helvetica, sans-serif',
  },
}))(props => <Typography variant="h4" {...props} />)

const ContentHeader = props => {
  return (<>
    <Box display="flex" alignItems="center" mb={3}>
      <Box display="flex" flexDirection="column" flexGrow={1}>
        {
          ( props.breadcrumbs ? props.breadcrumbs.length : false )
            ? (<>
              <Box mt={1} />
              <Breadcrumbs aria-label="breadcrumb">
                {
                  props.breadcrumbs.map((item,index)=>(
                    item.to
                      ? <Link color="inherit" component={L} to={item.to} key={index}>
                        <Typography variant="caption">{item.label}</Typography>
                      </Link>
                      : <Typography variant="caption" color="textPrimary" key={index}>{item.label}</Typography>
                  ))
                }
              </Breadcrumbs>
            </>)
            : null
        }
        <Header>
          <strong>
            { props.loading ? <Skeleton width={`33%`} /> : (props.label || props.children) }
          </strong>
        </Header>
      </Box>
      { props.secondaryActions }
    </Box>
  </>)
}

export default ContentHeader;