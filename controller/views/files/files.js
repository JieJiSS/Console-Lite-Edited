const Vue = require('vue');
const fs = require('fs');

const FilesView = Vue.extend({
  template: fs.readFileSync(`${__dirname}/files.html`).toString('utf-8'),
  props: [
    'files',
    'authorized',
    {
      name: 'searchInput',
      default: '',
    },
  ],

  data: () => ({
    dragging: false,
  }),

  methods: {
    dragover() {
      if(this.authorized) this.dragging = true;
    },

    dragleave() {
      this.dragging = false;
    },

    dragend() {
      this.dragging = false;
    },

    drop(e) {
      if(!this.authorized) return;
      const dt = e.dataTransfer;
      if(dt.files.length !== 1) {
        this.dragging = false;
        alert('请每次只上传一个文件');
        return;
      }

      const name = dt.files[0].name;
      const type = dt.files[0].type;

      fs.readFile(dt.files[0].path, (err, data) => {
        this.$dispatch('add-file', name, type, data);
      });

      this.dragging = false;
    },

    viewFile(file) {
      this.$dispatch('view-file', file);
    },
  },
});

module.exports = FilesView;
