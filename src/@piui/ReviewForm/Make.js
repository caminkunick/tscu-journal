import React from 'react';
import { Select, MenuItem, Box, Typography, TextField } from '@material-ui/core';
import { Table, Row, Cell } from '@piui';
import { Header } from '@piui/Review';

const selectLists = ["-- เลือกผลการประเมิน --","เห็นด้วยอย่างยิ่ง","เห็นด้วย","ไม่เห็นด้วย","ไม่เห็นด้วยอย่างยิ่ง"]
const lists = [
  "บทความก่อให้เกิดองค์ความรู้ใหม่หรือต่อยอดองค์ความรู้เดิมในการศึกษาของสาขาวิชานั้น",
  "บทความเป็นบทความใหม่ มิได้คัดลอกหรือดัดแปลงมาจากบทความเก่าหรือบทความของผู้อื่น",
  "บทความใช้วิธีวิจัยในการดำเนินการวิจัยได้เหมาะสม",
  "บทความใช้ภาษาถูกต้อง เรียบเรียงเนื้อหาได้ชัดเจน สามารถอ่านเข้าใจได้",
  "บทความผ่านมาตรฐานทางวิชาการของสาขาวิชานั้น",
  "บทความวิเคราะห์/สังเคราะห์ข้อมูลและเนื้อหาได้อย่างถูกต้อง น่าเชื่อถือ",
];
const results = [
  "-- เลือกผลการประเมิน --",
  "ควรตีพิมพ์บทความนี้",
  "ควรตีพิมพ์บทความนี้ โดยขอให้ปรับปรุงแก้ไขก่อน",
  "ควรตีพิมพ์บทความนี้ โดยขอให้ปรับปรุงแก้ไขและส่งมาให้ผู้พิจารณาทบทวนอีกครั้ง",
  "ไม่ควรตีพิมพ์บทความนี้",
];


const defaultData = {
  select1: 0,
  select2: 0,
  select3: 0,
  select4: 0,
  select5: 0,
  select6: 0,
  text1: "",
  text2: "",
  result: 0,
};


const MakeReviewForm = ({ comment, onChange, ...props }) => {
  const [ data, setData ] = React.useState({ ...defaultData });

  const handleChange = key => ({ target }) => setData(d=>{
    const newData = { ...d, [key]:target.value };
    onChange(newData);
    return newData;
  });

  React.useState(()=>{
    if(comment){ setData(comment); }
  }, [ comment ])

  return (<>
    <Table
      head={<Row>
        <Cell align="center">ข้อ</Cell>
        <Cell width="100%" align="center">รายการประเมิน</Cell>
        <Cell align="center">ผล</Cell>
      </Row>}
    >
      {
        lists.map((list,index)=>(<Row key={list}>
          <Cell align="center"><Typography>{ index+1 }</Typography></Cell>
          <Cell><Typography>{ list }</Typography></Cell>
          <Cell>
            <Select fullWidth variant="outlined" value={data[`select${index+1}`]} onChange={handleChange(`select${index+1}`)} disabled={Boolean(comment)}>
              { selectLists.map((label,itemIndex)=>(<MenuItem key={index+label} value={itemIndex}>{ label }</MenuItem>)) }
            </Select>
          </Cell>
        </Row>))
      }
    </Table>
    <Box mt={5} />
    <Typography variant="body1">
      <strong>จุดแข็ง หรือ ข้อดี หรือ ลักษณะเด่น ของบทความนี้</strong>&nbsp;(สามารถเขียนเพิ่มเติมด้านหลังเอกสารนี้ หรือแนบเอกสารเพิ่มเติม)</Typography>
    <TextField
      rows={4}
      fullWidth
      multiline
      variant="outlined"
      defaultValue={comment ? comment.text1 : ""}
      onChange={handleChange('text1')}
      disabled={Boolean(comment)}
      />
    <Box mt={5} />
    <Typography variant="body1">
      <strong>จุดอ่อน หรือ ข้อจำกัด หรือ ปัญหา ของบทความนี้</strong>&nbsp;(สามารถเขียนเพิ่มเติมด้านหลังเอกสารนี้ หรือแนบเอกสารเพิ่มเติม)</Typography>
    <TextField
      rows={4}
      fullWidth
      multiline
      variant="outlined"
      defaultValue={comment ? comment.text2 : ""}
      onChange={handleChange('text2')}
      disabled={Boolean(comment)}
    />
    <Box mt={5} />
    <Header>ผลการประเมิน</Header>
    <Select variant="outlined" value={data.result} onChange={handleChange('result')} disabled={Boolean(comment)}>
      { results.map((label,index)=>(<MenuItem key={label} value={index}>{label}</MenuItem>))}
    </Select>
  </>)
}

export default MakeReviewForm;