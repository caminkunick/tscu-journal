import React from 'react';
import {
    Box,
    withStyles,
} from '@material-ui/core';

const Container = withStyles(theme=>({
    root: {
        width: '100%',
        height: '40vh',
        position: 'relative',
        '& img': {
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            top: 0,
            left: 0,
        },
        [theme.breakpoints.down("sm")]: {
            height: 'auto',
            '&:before': {
                content: "''",
                display: 'block',
                paddingTop: '100%',
            }
        },
    },
}))(Box)
const Inner = withStyles(theme=>({
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.25)',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2,3),
        boxSizing: 'border-box',
    },
    children: {
        textShadow: theme.shadows[5],
    },
}))(({ classes, ...props }) => (<Box className={classes.root}>
    <Box className={classes.children} {...props} />
</Box>))

const CoverImage = props => {
    const { src, children } = props;
    return (<Container>
        <img src={src} alt='cover' />
        { children && (<Inner>{ children }</Inner>) }
    </Container>)
}

export default CoverImage;