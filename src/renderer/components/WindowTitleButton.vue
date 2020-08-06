<template>
  <el-button :icon="iconClass"  class="winfowTitleButton" @click="click" />
</template>

<script>
const { ipcRenderer: ipc } = window.require("electron");

const icons = {
  min: "el-icon-minus",
  close: "el-icon-close"
};
export default {
  name: "Titlebtn",
  props: {
    type: String
  },
  data() {
    return {
      iconClass: ""
    };
  },
  computed: {},
  created() {
    if (icons[this.type]) {
      this.iconClass = icons[this.type];
    }
  },
  methods: {
    click: function() {
      ipc.send(this.type);
    }
  }
};
</script>
    
<style>
.winfowTitleButton {
  -webkit-app-region: no-drag;
}
</style>