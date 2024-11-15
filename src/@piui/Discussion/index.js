import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Link,
  Typography,
  withStyles,
} from "@material-ui/core";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { TableHead, Table, Row, Cell } from "../TabTable";
import moment from "moment";

import DialogMessageOpen from "./DialogMessageOpen";
import DialogAdd from "./DialogAdd";
import DialogAddMessage from "./DialogAddMessage";

const NoWrap = withStyles((theme) => ({
  root: {
    whiteSpace: "nowrap",
  },
}))(Box);

const Discussion = ({
  label,
  docs,
  users,
  onDiscussAdd,
  onMessageAdd,
  ...props
}) => {
  const [state, setState] = React.useState({
    discussOpen: null,
    addMsgOpen: null,
  });

  const handleOpenMessage = (id) => () =>
    setState((s) => ({ ...s, discussOpen: id }));
  const handleOpenAddMessage = (open) => () =>
    setState((s) => ({ ...s, addMsgOpen: open }));

  const EnhanceFrom = ({ doc }) => (
    <Cell>
      <NoWrap>{users[doc.user]}</NoWrap>
      <NoWrap>{moment(doc.date.toMillis()).format("L LT")}</NoWrap>
    </Cell>
  );
  const EnhanceLastReply = ({ doc }) => {
    const docLastReply = doc.messages[doc.messages.length - 1];
    return (
      <Cell>
        <NoWrap>{users[docLastReply.user]}</NoWrap>
        <NoWrap>{moment(docLastReply.date.toMillis()).format("L LT")}</NoWrap>
      </Cell>
    );
  };
  const handleMessageAdd = async (msg) => {
    await onMessageAdd(state.discussOpen)(msg);
  };

  return (
    <React.Fragment>
      <TableHead
        secondaryActions={
          onDiscussAdd &&
          onMessageAdd && (
            <DialogAdd onAdd={onDiscussAdd}>
              <Button size="small" color="primary">
                Add Discussion
              </Button>
            </DialogAdd>
          )
        }
      >
        {label || "Discussion"}
      </TableHead>
      <Table
        head={
          <Row>
            <Cell width="100%">Subject</Cell>
            <Cell>From</Cell>
            <Cell>
              <NoWrap>Last Reply</NoWrap>
            </Cell>
            <Cell>
              <NoWrap>Replies</NoWrap>
            </Cell>
            <Cell>Closed</Cell>
          </Row>
        }
      >
        {docs.length ? (
          docs
            .sort((a, b) => {
              const getDate = (date) => (date ? date.toMillis() : Date.now());
              return getDate(a.date) - getDate(b.date);
            })
            .map((doc) => (
              <Row key={doc.id}>
                <Cell>
                  <Link
                    onClick={handleOpenMessage(doc.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {doc.subject}
                  </Link>
                </Cell>
                <EnhanceFrom doc={doc} />
                <EnhanceLastReply doc={doc} />
                <Cell align="center">{doc.messages.length}</Cell>
                <Cell align="center" padding="checkbox">
                  <Checkbox checked={doc.closed} disabled />
                </Cell>
              </Row>
            ))
        ) : (
          <Row>
            <Cell colSpan={10}>
              <Typography variant="caption" color="textSecondary">
                no discussion
              </Typography>
            </Cell>
          </Row>
        )}
      </Table>
      <DialogMessageOpen
        docs={docs}
        id={state.discussOpen}
        onAddClick={handleOpenAddMessage(state.discussOpen)}
        onClose={handleOpenMessage(null)}
        users={users}
      />
      {onDiscussAdd && onMessageAdd && (
        <DialogAddMessage
          open={Boolean(state.addMsgOpen)}
          onAdd={handleMessageAdd}
          onClose={handleOpenAddMessage(null)}
        />
      )}
    </React.Fragment>
  );
};
Discussion.propTypes = {
  label: propTypes.node.isRequired,
  docs: propTypes.array.isRequired,
  users: propTypes.object.isRequired,
  onDiscussAdd: propTypes.func,
  onMessageAdd: propTypes.func,
};

export default connect()(Discussion);
