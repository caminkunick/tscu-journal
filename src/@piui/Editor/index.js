import React from 'react';
import propTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertFromRaw } from 'draft-js';
// import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
import './editor.css';

const toolbar = {
  options: ['inline', 'textAlign', 'link', 'history'],
  inline: {
    inDropdown: false,
    options: ['bold', 'italic', 'underline', 'strikethrough'],
  },
  textAlign: {
    inDropdown: false,
    options: ['left', 'center', 'right'],
  },
  link: {
    inDropdown: false,
    defaultTargetOption: '_blank',
    options: ['link', 'unlink'],
  },
  history: {
    inDropdown: false,
    options: ['undo', 'redo'],
  },
};

const EditorComp = ({ defaultText, ...props }) => {
  const [ state, setState ] = React.useState(null);
  const setInputRef = (ref) => {
    if(props.inputRef){
      props.inputRef.current = ref;
    }
  };
  
  const handleEditorStateChange = editorState => setState(editorState);
  const handleContentStateChange = editorState => {
    props.onChange(editorState);
  };

  React.useEffect(()=>{
    if(state===null && defaultText){
      const contentState = convertFromRaw(defaultText);
      const cacheState = EditorState.createWithContent(contentState);
      setState(cacheState);
    }
  }, [ defaultText, state ])
  
  return (<>
  <Editor
    toolbar={ props.toolbar ? {...toolbar,...props.toolbar} : toolbar }
    editorState={state}
    editorClassName="draft-editor"
    editorRef={setInputRef}
    onEditorStateChange={handleEditorStateChange}
    onContentStateChange={handleContentStateChange}
  />
  {/*
    state
      ? <Editor toolbar={{options:[]}} editorState={state} readOnly={true} />
      : null
  */}
  </>);
};
EditorComp.propTypes = {
  onChange: propTypes.func.isRequired,
};

export default EditorComp;