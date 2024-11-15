import React from 'react';
import { Link } from 'react-router-dom';
import {
    CoverImage,
    MainContainer,
    Container,
    ContentHeader,
} from '@piui';
import { getJournalInfo } from 'Method';
import {
    Box, Button,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Typography } from '@material-ui/core';
import cover from 'Assets/cover_resize.jpg'

const JournalPage = props => {
    const { jid } = props.match.params;
    const [state,setState] = React.useState({
        fetched: false,
        submit: {},
    })

    React.useEffect(()=>{
        getJournalInfo(jid).then(submit=>setState(s=>({ ...s, submit, fetched:true })));
    }, [ jid ])

    return (<MainContainer dense>
        <CoverImage src={cover} />
        <Container maxWidth="md">
            <Box py={10}>
                <ContentHeader
                    label={
                        state.fetched
                            ? state.submit.title
                            : <Skeleton width={`30%`} />
                    }
                    breadcrumbs={[
                        { label:"Home", to:`/` },
                    ]}
                    secondaryActions={<React.Fragment>
                        <Button variant="outlined" color="primary" component={Link} to={`/${jid}/select-role/`}>Sign in</Button>
                    </React.Fragment>}
                />
                <Box>
                    <p>วารสารไทยศึกษามีวัตถุประสงค์เพื่อเผยแพร่ผลงานวิจัยเกี่ยวกับไท-ไทศึกษา ในลักษณะสหวิทยาการเพื่อสร้างพลวัตและความเป็นเลิศแห่งความรู้ไทย-ไทศึกษา และเป็นสื่อกลางแลกเปลี่ยนความคิดเห็นทางวิชาการด้านไทย-ไทศึกษาในกลุ่มคณาจารย์ นักวิจัย นักวิชาการ ตลอดจนนิสิตนักศึกษา และผู้สนใจ</p>
                    <p>วารสารไทยศึกษาเป็นวารสารวิชาการด้านมนุษยศาสตร์ รับพิจารณาบทความวิจัยและวิชาการที่เกี่ยวข้องกับไทย-ไทศึกษาในหลากหลายสาขา ทั้งภาษาและวรรณคดีไทย วรรณคดีท้องถิ่น วรรณคดีเปรียบเทียบ คติชนวิทยา การเรียนและการสอนภาษาไทย ศิลปกรรมศาสตร์ ปรัชญาและศาสนา ประวัติศาสตร์ มานุษวิทยา การสื่อสารและวัฒนธรรมศึกษา โดยบทความที่ติพิมพ์ต้องผ่านการพิจารณาจากผู้ทรงคุณวุฒิในระบบ double blind review</p>
                    <p>
                        วารสารไทยศึกษาเป็นวารสารราย 6 เดือน (2 ฉบับต่อปี)<br />
                        – ฉบับที่ 1 มกราคม – มิถุนายน<br />
                        – ฉบับที่ 2 กรกฎาคม – ธันวาคม
                    </p>
                    <Typography variant="h6"><b>ติดต่อวารสาร</b></Typography>
                    <p>กองบรรณาธิการวารสารไทยศึกษา<br />
                    สถาบันไทยศึกษา จุฬาลงกรณ์มหาวิทยาลัย<br />
                    อาคารประชาธิปก-รำไพพรรณี ชั้น 9<br />
                    แขวงวังใหม่ เขตปทุมวัน<br />
                    กรุงเทพฯ 10330</p>
                    <p>
                        E-mail: chula.its.journal@gmail.com<br />
                        โทร: 02-218-7494
                    </p>
                </Box>
            </Box>
        </Container>
    </MainContainer>)
}

export default JournalPage;