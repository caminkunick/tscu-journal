import React from 'react';
import { MainContainer, Container, ListItemLink, ContentHeader } from '@piui';
import Sidebar from '../../_sidebar';
import {
    Box,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/pro-solid-svg-icons';
import AddReviewer from './AddReviewer';
import { db, dbTimestamp } from 'Modules/firebase';

const getReviewers = (jid,sid,callback) => {
    const path = db
        .collection('journals').doc(jid)
        .collection('submits').doc(sid)
        .collection('reviewers');
    return path.onSnapshot(async snapshot=>{
        const promiseReviewers = snapshot.docs.map(async doc=>{
            const data = { ...doc.data(), id:doc.id };
            const userdata = (await db.collection('journals').doc(jid).collection('users').doc(data.user).get()).data();
            return { ...data, userdata };
        });
        const reviewers = await Promise.all(promiseReviewers);
        callback({ reviewers });
    })
}

const PageReviewer = props => {
    const { jid, sid } = props.match.params;
    const [ state, setState ] = React.useState({
        fetched: false,
        reviewers: [],
    })

    
    const handleAddReviewer = async ({ user, files }) => {
        try{
            const filesData = files.map(file=>file.result);
            await db.collection('journals').doc(jid).collection('submits').doc(sid).collection('reviewers').add({
                user,
                files: filesData,
                state: 0,
                status: 'onprocess',
                timestamp: dbTimestamp(),
            })
            return true;
        } catch(err){
            console.log(err)
            return false;
        }
    }


    React.useEffect(()=>{
        return getReviewers(jid,sid, data => setState(s=>({ ...s, ...data, fetched:true })));
    }, [ jid, sid ])


    return (<MainContainer sidebar={<Sidebar {...props} selected="reviewer" />}>
        <Container maxWidth="md">
            <ContentHeader
                label="Reviewer"
                breadcrumbs={[
                    { label:"Home", to:`/` },
                    { label:"Administrator" },
                ]}
            />
            <Box mb={1} textAlign="right">
                <AddReviewer {...props} onAdd={handleAddReviewer}>
                    <Button variant="outlined"
                        startIcon={<FontAwesomeIcon icon={faUserPlus} />}
                    >Add Reviewer</Button>
                </AddReviewer>
            </Box>
            <List>
                <Divider />
                {
                    state.fetched
                        ? (
                            state.reviewers.length
                                ? state.reviewers.map(({ id, userdata, ...doc })=>(<ListItemLink button divider
                                    to={`/${jid}/admin/s/${sid}/reviewer/${id}`}
                                    key={id}
                                >
                                    <ListItemText primary={`${userdata.info.eng.fname} ${userdata.info.eng.sname}`} />
                                </ListItemLink>))
                                : (<ListItem divider>
                                    <ListItemText primary="no reviewer" primaryTypographyProps={{color:'textSecondary'}} />
                                </ListItem>)
                        )
                        : (<ListItem divider>
                            <ListItemText primary={<Skeleton width={`30%`} />} />
                        </ListItem>)
                }
            </List>
        </Container>
    </MainContainer>);
}

export default PageReviewer;