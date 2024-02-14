import dynamic from "next/dynamic";
import { useState } from "react";
import { EditorState,convertToRaw  } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const DynamicEditor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  { ssr: false }
);

const Index = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    const rawContentState = convertToRaw(newEditorState.getCurrentContent());
    console.log(rawContentState);
  };

  return (
    <div>
      <DynamicEditor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
      />
    </div>
  );
};

export default Index;
