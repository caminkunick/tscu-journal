import React from 'react';
import { MainContainer, Container, ContentHeader, ListItemLink } from '@piui';
import { Skeleton } from '@material-ui/lab';
import { AppBar, Tabs, Tab, ListItemText } from '@material-ui/core';
import TabSendRequest from './TabSendRequest';
import { getSubmit } from './func';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';

const Sidebar = props => {
    const { jid, sid } = props.match.params;
    return (<React.Fragment>
        <ListItemLink divider to={`/${jid}/admin/s/${sid}/reviewer`}>
            <ListItemText primary={<><FontAwesomeIcon icon={faChevronLeft} />&nbsp;Back</>} />
        </ListItemLink>
    </React.Fragment>)
}

const PageReviewer = props => {
    const { jid, sid } = props.match.params;
    const [ state, setState ] = React.useState({
        fetched: false,
        submit: {},
        tab: 0,
    })


    const handleChangeTab = (e,tab) => setState(s=>({ ...s, tab }));


    React.useEffect(()=>{
        getSubmit(jid,sid)
            .then(submit=>setState(s=>({ ...s, submit, fetched:true })));
    }, [ jid, sid ])


    return (<MainContainer sidebar={<Sidebar {...props} />}>
        <Container maxWidth="md">
            <ContentHeader
                label={ state.fetched ? state.submit.title.eng : <Skeleton width={`30%`} /> }
                breadcrumbs={[
                    { label:"Home", to:`/` },
                    { label:"Administrator" },
                    { label:"Submission", to:`/${jid}/admin/s` },
                    { label:"Submit", to:`/${jid}/admin/s/${sid}` },
                    { label:"Reviewer", to:`/${jid}/admin/s/${sid}/reviewer` },
                ]}
            />
            <AppBar position="static">
                <Tabs value={state.tab} onChange={handleChangeTab}>
                    <Tab label="Send Request" />
                </Tabs>
            </AppBar>
            {
                state.fetched
                    ? (<React.Fragment>
                        <TabSendRequest {...props} submit={state.submit} />
                    </React.Fragment>)
                    : null
            }
        </Container>
    </MainContainer>)
}

export default PageReviewer;