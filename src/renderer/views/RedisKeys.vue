<template>
  <div ref="menu" class="menu">
    <el-card class="box-card">
      <el-button
        id="reload"
        type="text"
        icon="el-icon-refresh"
        size="mini"
        @click="reload"
      >RELOAD ALL KEY</el-button>
      <el-table
        class="keys"
        ref="keys"
        :data="data.datas"
        @cell-click="selectedKey"
        :height="keyHeight"
      >
        <el-table-column prop="key" label="KEYS" />
      </el-table>
    </el-card>
  </div>
</template>

<script>
let khSub = 132;
export default {
  name: "redisKey",
  props: ["data"],
  components: {},
  watch: {
    data: function(nval, oval) {
      if (this.data.windowHeight) {
        var keyHeight = this.data.windowHeight - khSub;
        this.keyHeight = keyHeight > 500 ? keyHeight : this.keyHeight;
      }
    }
  },
  data() {
    return {
      keyHeight: 0
    };
  },
  mounted() {},
  created() {},
  methods: {
    selectedKey(row, column, event, cell) {
      var key = this.data.key;
      if (key !== "") {
        key = key + ":";
      }
      this.$emit("func", { method: "selectedKey", key: key + row.key });
    },
    reload() {
      this.$emit("func", { method: "reload" });
    }
  }
};
</script>

<style>
.menu {
  top: 60px;
  position: fixed;
  overflow: hidden;
  height: calc(100% - 60px);
  width: 300px;
  min-width: 200px;
  min-height: 580px;
  /* background: #fafafa; */
}
.menu .box-card {
  margin: 10px 5px 10px 10px;
  height: calc(100% - 30px);
  min-height: 500px;

  width: calc(100% - 20px);
  overflow-x: hidden;
  overflow-y: auto;
}
.selectedKeyKey {
  text-align: left;
  padding: 0px;
  margin: 0px;
  text-indent: 10px;
  color: #999;
  height: 20px;
}
.selectedKeyKey i {
  float: right;
  cursor: pointer;
}
#reload {
  position: absolute;
  top: 40px;
  right: 30px;
  z-index: 1;
}
.keys {
  user-select: none;
}
</style>