import "bootstrap/js/dist/popover";
import "bootstrap/js/dist/alert";
import Quill from "quill/dist/quill";

setTimeout(() => {
  $(".alert").alert("close");
}, 5000);

$(function() {
  $('[data-toggle="popover"]').popover();
});

const editor = new Quill("#editor", {
  modules: {
    toolbar: [
      ["bold", "italic", "underline"],
      ["blockquote"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      // [{ script: "sub" }, { script: "super" }],
      // [{ indent: "-1" }, { indent: "+1" }],
      // [{ direction: "rtl" }],

      // [{ size: ["small", false, "large", "huge"] }],

      // [{ color: [] }, { background: [] }],
      // [{ font: [] }],
      // [{ align: [] }],

      ["clean"]
    ]
  },
  placeholder: "Content...",
  theme: "snow"
});

const about = document.querySelector("textarea[name=content]");

editor.on("editor-change", function(eventName, ...args) {
  about.value = JSON.stringify(editor.getContents());
});

editor.setContents(JSON.parse(about.value).ops, "api");
