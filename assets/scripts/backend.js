import 'bootstrap/js/dist/popover';
import 'bootstrap/js/dist/alert';

setTimeout(() => {
  $(".alert").alert('close')
}, 5000);

$(function() {
  $('[data-toggle="popover"]').popover();
});
