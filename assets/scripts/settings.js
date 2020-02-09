import React from 'react';
import ReactDOM from 'react-dom';
import StringTranslation from './StringTranslation.jsx'

let settingsRoot = document.getElementById('stringtranslationroot');
if (settingsRoot) {
  ReactDOM.render(
    <div>
      {/*This is rendered with  React-->*/}
      <StringTranslation/>
    </div>,
    settingsRoot
  );
}
