import React,{useRef, useState} from 'react'
// import ReactQuill from 'react-quill'
// import 'react-quill/dist/quill.snow.css';

import {SummernoteLite} from "react-summernote-lite";

// to see the default props for SummernoteLite
import { DEFAULT_PROPS } from "react-summernote-lite";


function Editor({placeholder, value,setValue}) {

  const noteRef = useRef();

  function handleChange (html) {
    setValue('description',html)
  }

  return (
        // <ReactQuill 
        // theme={theme}
        // onChange={handleChange}
        // value={value}
        // modules={modules}
        // formats={formats}
        // placeholder={placeholder}
        
        // />
        <SummernoteLite
        ref={noteRef}
        defaultCodeValue={value}
        placeholder={placeholder}
        tabsize={2}
        height={350 || "50vh"}
        dialogsInBody={true}
        blockquoteBreakingLevel={0}
        toolbar={[
          ['style', ['style']],
          ['font', ['bold', 'underline', 'clear', 'strikethrough', 'superscript', 'subscript']],
          ['fontsize', ['fontsize']],
          ['fontname', ['fontname']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['table', ['table']],
          ['insert', ['link', 'picture', 'video', 'hr']],
          ['view', ['fullscreen', 'codeview', 'help']]
        ]}
        fontNames={[
          "Arial",
          "Georgia",
          "Verdana",
          "e.t.c..."
        ]}
        callbacks={{
          onImageUpload: function (files){
              setImageFiles(files);
          },
          onChange: function(e){
            handleChange(e)
          },
          onKeyup: function (e){},
          onKeyDown: function (e){},
          onPaste: function (e){}
        }}
      />
      
  )
}

export default Editor