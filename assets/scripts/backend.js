import {alertTimeout} from "./helper.js"
import "bootstrap/js/dist/popover";
import "bootstrap/js/dist/alert";
import "./settings";
import Quill from "quill/dist/quill";

setTimeout(() => {
  $(".alert").alert("close");
}, alertTimeout);

$(function () {
  $('[data-toggle="popover"]').popover();
});

const editorContainer = document.getElementById("editor");
if (editorContainer) {
  const editor = new Quill(editorContainer, {
    modules: {
      toolbar: [
        ["bold", "italic", "underline"],
        ["blockquote"],
        [{header: 1}, {header: 2}],
        [{list: "ordered"}, {list: "bullet"}],
        ['image', 'code-block', 'link'],
        // [{ script: "sub" }, { script: "super" }],
        [{indent: "-1"}, {indent: "+1"}],
        // [{ direction: "rtl" }],
        [{size: ["small", "large"]}],
        // [{ color: [] }, { background: [] }],
        // [{ font: [] }],
        [{align: []}],
        ["clean"]
      ]
    },
    placeholder: "Content...",
    theme: "snow"
  });

  const about = document.querySelector("textarea[name=content]");

  editor.on("editor-change", function (eventName, ...args) {
    about.value = JSON.stringify(editor.getContents());
  });
  if (about && about.value) {
    const ops = JSON.parse(about.value).ops
    if (ops) {
      editor.setContents(ops, "api");
    } else {
      editor.setText(about.value.toString().replace(/\\|"/gi, ''), "api");
    }
  }
}

const deleteButtons = document.querySelectorAll("button.btn-danger, button.btn-outline-danger");
Array.from(deleteButtons).map(button => button.addEventListener("click", (e) => !confirm("are you sure?") && e.preventDefault()))
