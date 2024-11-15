import { Box, Typography } from "@material-ui/core";
import { Attachments, Discussion, Table } from "@piui";
import { Cell, Row, TableHead } from "@piui/TabTable"
import { getAuthorName } from "Method";
import { useContext } from "react"
import { ObserveSubmitContext } from "../Context";


const TitleRow = props => (<Row>
  <Cell width="10%">{ props.lang }</Cell>
  <Cell width="90%">{ props.value }</Cell>
  <Cell style={{whiteSpace:"nowrap"}}>{ props.actions }</Cell>
</Row>);

export const ContentSubmission = props => {
  const { getFiles, getDiscuss, ...store } = useContext(ObserveSubmitContext);
  const [state] = store.state;

  return (state.fetched && state.submit && state.submit.title) ? (<>
    <TableHead>Title</TableHead>
    <Table>
      <TitleRow lang="Thai" value={state.submit.title.tha} />
      <TitleRow lang="English" value={state.submit.title.eng} />
    </Table>
    <Box mt={5} />
    <TableHead>Author</TableHead>
    <Table
      head={<Row>
        <Cell>Name</Cell>
        <Cell align="center">E-mail</Cell>
        <Cell align="center">Phone</Cell>
      </Row>}
    >
    {
      (state.submit.authors && state.submit.authors.length)
        ? state.submit.authors.map( (author,index) => (<Row key={index}>
          <Cell width={`100%`}>
            [Thai] { getAuthorName(author.tha) } ({author.tha.dept})<br />
            [English] { getAuthorName(author.eng) } ({author.eng.dept})
          </Cell>
          <Cell><Typography variant="caption" noWrap>{author.email}</Typography></Cell>
          <Cell>
            <abbr title={'Phone: '+author.phone}>
              <Typography variant="caption" noWrap>{author.phone.slice(0,-4)}XXXX</Typography>
            </abbr>
          </Cell>
        </Row>))
        : (<Row>
          <Cell colSpan={10}>
            <Typography variant="caption" color="textSecondary">no author</Typography>
          </Cell>
        </Row>)
    }
    </Table>
    <Box mt={5} />
    <Attachments
      label="Submission Files"
      fetched={state.fetched}
      withType
      files={getFiles('user0')}
    />
    <Box mt={5} />
    <Discussion
      label="Pre-Review Discussions"
      fetched={state.fetched}
      docs={getDiscuss('pre-review')}
      users={state.users}
    />
  </>) : null;
}