import React from 'react';
import propTypes from 'prop-types';
import { Editor, EditorState, convertFromRaw } from "draft-js";

const EditorDisplay = ({ content }) => {
  const contentState = convertFromRaw(content);
  const editorState = EditorState.createWithContent(contentState);

  return content && <Editor
    editorState={editorState}
    readOnly={true}
  />;
};
EditorDisplay.propTypes = {
  content: propTypes.object.isRequired,
};

export default EditorDisplay;