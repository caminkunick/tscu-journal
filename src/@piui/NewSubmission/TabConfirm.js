import React from 'react';
import { fileTypes } from '@piui';
import { Box, Checkbox, Divider, Table, TableBody, TableCell, TableContainer, TableRow, Typography, withStyles } from '@material-ui/core';

const labels = [
  "เป็นผลงานของข้าพเจ้าเพียงผู้เดียว",
  "เป็นผลงานของข้าพเจ้าและผู้ที่ระบุชื่อในบทความ",
  "ไม่ได้ละเมิดลิขสิทธิ์ผลงานผู้อื่น",
  "ไม่เคยตีพิมพ์เผยแพร่ในวารสารใด ๆ มาก่อน",
  "ไม่อยู่ในระหว่างการพิจารณาตีพิมพ์ในวารสารอื่นอีกนับจากวันที่ได้นำส่งบทความนี้มายังกองบรรณาธิการวารสารไทยศึกษา จุฬาลงกรณ์มหาวิทยาลัย",
  "ข้าพเจ้าจะขอรับผิดชอบเกี่ยวกับเนื้อหาทั้งหมดที่ปรากฏในบทความนี้   และยอมรับผลการพิจารณาจากกองบรรณาธิการว่าเป็นที่สิ้นสุด และจะปรับปรุงบทความให้มีรูปแบบตรงตามข้อกำหนดของวารสารไทยศึกษา จุฬาลงกรณ์มหาวิทยาลัย",
]

const Header = withStyles(theme=>({
  h6: {
    fontFamily: 'Prompt',
  }
}))(Typography);

const Row = withStyles(theme=>({
  root: {
    cursor: 'pointer',
  }
}))(TableRow);

const Cell = withStyles(theme=>({
  head: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const TabConfirm = ({ parentData, fetching, ...props }) => {
  const [ data, setData ] = parentData;

  const handleChecked = index => () => !fetching && setData(d=>{
    let checked = [ ...d.checked ];
    checked[index] = !d.checked[index];
    return { ...d, checked };
  })

  return (<React.Fragment>
    <TableContainer>
      <Table size="small">
        <TableBody>
          <TableRow>
            <Cell variant="head">Title</Cell>
            <Cell width="100%">
              [Thai] {data.title.tha}<br />
              [English] {data.title.eng}
              { data.title.others.map(({ lang, value },index)=>(<React.Fragment key={index}>
                <br />[{lang}] {value}
              </React.Fragment>)) }
            </Cell>
          </TableRow>
          <TableRow>
            <Cell variant="head">Author</Cell>
            <Cell>
              {data.authors.map((author,index)=>(<React.Fragment key={index}>
                { index!==0 && <br /> }
                <span>{`${author.tha.fname} ${author.tha.sname}`}</span>
              </React.Fragment>))}
            </Cell>
          </TableRow>
          <TableRow>
            <Cell variant="head">Attachment</Cell>
            <Cell>
              {data.files.map((file,index)=>(<React.Fragment key={index}>
                { index!==0 && <br /> }
                <span>[{fileTypes[file.type]}] <a href={file.url} rel="noopener noreferrer" target="_blank">{file.name}</a></span>
              </React.Fragment>))}
            </Cell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    <Box mt={5} />
    <Header className="prompt" variant="h6" paragraph><b>ข้าพเจ้าขอรับรองว่าบทความที่ได้ส่งมานี้</b></Header>
    <Divider />
    <Table>
      <TableBody>
      { labels.map((label,index)=>(<Row hover={!fetching} key={index} onClick={handleChecked(index)}>
        <Cell padding="checkbox">
          <Checkbox checked={data.checked[index]} disabled={fetching} color="primary" />
        </Cell>
        <Cell>{ label }</Cell>
      </Row>)) }
      </TableBody>
    </Table>
  </React.Fragment>)
}

export default TabConfirm;