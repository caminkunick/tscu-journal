import React from 'react';
import { connect } from 'react-redux';
import { Link as RLink } from 'react-router-dom';
import { Box, Button } from '@material-ui/core';
import {
    MainContainer,
    Container,
    ContentHeader,
    UserMenuList,
    ListItemLink,
    BackLink,
    NewSubmission,
} from '@piui';
import { Link, ListItemText } from '@material-ui/core';
import { getMySubmission, sorting } from 'Method';
import { SMSTable, Cell, Row, EmptyRow } from './Table';
import moment from 'moment';
import 'moment/locale/th';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';

const defaultState = {
  fetched: false,
  submissions: [],
  reviewers: [],
  archives: [],
  role: 'user',
};

const Submission = ({ user, dispatch, ...props }) => {
    const { jid, page } = props.match.params;
    const breadcrumbs = [{ label:"Home", to:`/${jid}/` }];
    const [state,setState] = React.useState({ ...defaultState });

    const Sidebar = props => (<React.Fragment>
        <BackLink to={`/${jid}/select-role`} />
        <UserMenuList jid={jid}>
            <ListItemLink to={`/${jid}/s/`} selected={!page}>
                <ListItemText primary="My Submission" />
            </ListItemLink>
            <ListItemLink to={`/${jid}/s/archive`} selected={page==='archive'}>
                <ListItemText primary="Archive" />
            </ListItemLink>
        </UserMenuList>
    </React.Fragment>);
    const EnhanceDate = ({ date, ...props }) => {
        const dateConvert = date ? date.toMillis() : Date.now();
        const mddate = moment(dateConvert).format('LL LT');
        const smdate = moment(dateConvert).format('L');
        return <abbr title={mddate}>{ smdate }</abbr>
    } 


    React.useEffect(()=>{
        if(user){
            dispatch(getMySubmission(jid,user.uid,data=>setState(s=>({ ...s, ...data, fetched:true }))));
        } else {
            setState(s=>({ ...s, ...defaultState, fetched:true }));
        }
        return ()=>(false);
    }, [ jid, user, dispatch ])


    return (<MainContainer signInOnly sidebar={<Sidebar />}>
        <Container maxWidth="md">
            { !page && (<Box>
                <ContentHeader
                    label="My Submission"
                    breadcrumbs={breadcrumbs}
                    secondaryActions={<NewSubmission {...props}>
                        <Button variant="outlined" color="primary"
                            startIcon={<FontAwesomeIcon icon={faPlus} />}
                        >New Submission</Button>
                    </NewSubmission>}
                />
                <SMSTable loading={!state.fetched}>
                    {
                        state.submissions.length
                            ? state.submissions.sort(sorting('date','desc')).map(submit=>(<Row key={submit.id}>
                                <Cell><Link to={`/${jid}/s/id/${submit.id}/`} component={RLink}>{ submit.title.eng }</Link></Cell>
                                <Cell><EnhanceDate date={submit.date} /></Cell>
                            </Row>))
                            : (<EmptyRow>no submission</EmptyRow>)
                    }
                </SMSTable>
            </Box>) }
            { page==='archive' && (<Box>
                <ContentHeader label="Archive" breadcrumbs={breadcrumbs} />
                <SMSTable loading={!state.fetched} headOpts={["Status"]}>
                    {
                        state.archives.length
                            ? state.archives.sort(sorting('date','desc')).map(submit=>(<Row key={submit.id}>
                                <Cell><Link to={`/${jid}/s/id/${submit.id}`} component={RLink}>{ submit.title.eng }</Link></Cell>
                                <Cell>
                                    { (()=>{
                                      if(submit.status==='rejected'){ return `Rejected` }
                                      if(submit.status==='cancel'){ return `Cancel` }
                                      else if(submit.step===3){ return `Completed`; }
                                      return null
                                    })() }
                                </Cell>
                                <Cell><EnhanceDate date={submit.date} /></Cell>
                            </Row>))
                            : (<EmptyRow>no archive</EmptyRow>)
                    }
                </SMSTable>
            </Box>) }
        </Container>
    </MainContainer>)
}

export default connect(s=>({
    user: s.user.data,
}))(Submission);