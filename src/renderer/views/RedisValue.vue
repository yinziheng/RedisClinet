<template>
  <div class="content">
    <el-card class="box-card">
      <div class="topBox">
        <div>
          <h3 class="label">KEY</h3>
          <pre class="value">{{ key }}</pre>
          <h3 class="label">TYPE</h3>
          <pre class="value">{{ type }}</pre>
          <h3 class="label">TTL</h3>
          <pre class="value">{{ ttl }}</pre>
        </div>
        <div class="rightBox">
          <el-button-group class="btn-group btngp2">
            <el-button
              class="btn"
              type="primary"
              icon="el-icon-back"
              size="mini"
              @click="back"
              :disabled="!data.key"
            >GO BACK</el-button>
            <el-button
              class="btn"
              type="primary"
              icon="el-icon-back"
              size="mini"
              @click="backHome"
              :disabled="!data.key"
            >GO HOME</el-button>
          </el-button-group>

          <el-button-group class="btn-group btngp3">
            <el-button
              class="btn"
              type="danger"
              icon="el-icon-edit"
              size="mini"
              :disabled="!data.value"
              @click="loadEditKey"
            >KEY</el-button>

            <el-button
              class="btn"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              :disabled="data.ttl==undefined || data.ttl==null || data.ttl < 0"
              @click="loadEditTtl"
            >TTL</el-button>

            <el-button
              id="btnEditStrValue"
              class="btn"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              :disabled="type!=='string'"
              @click="loadEditStrForm"
            >VALUE</el-button>
          </el-button-group>

          <el-button-group class="btn-group btngp3">
            <el-button
              class="btn"
              type="primary"
              icon="el-icon-refresh"
              size="mini"
              :disabled="!data.value"
              @click="reload"
            >RELOAD</el-button>

            <el-button
              class="btn"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              :disabled="data.type==undefined || data.type==null || data.type =='string'"
              @click="loadAddItemForm"
            >ITEM</el-button>

            <el-button
              class="btn"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="!data.key"
              @click="delMsgBox"
            >DELETE</el-button>
          </el-button-group>
        </div>
      </div>
    </el-card>

    <el-card class="box-card detail">
      <pre v-if="strValue" ref="strValue" class="value">{{ value }}</pre>

      <el-table class="value" v-if="type==='list'" :data="value" :height="valueHeight">
        <el-table-column prop="index" label="INDEX" />
        <el-table-column prop="value" label="VALUE" />
        <el-table-column label="OPERATE" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button @click="loadEditItemForm(scope.row)" type="text" icon="el-icon-edit" />
            <el-button @click="delItem(scope.row)" type="text" icon="el-icon-delete" />
          </template>
        </el-table-column>
      </el-table>

      <el-table class="value" v-if="type==='set'" :data="value" :height="valueHeight">
        <el-table-column prop="value" label="VALUE" />
        <el-table-column label="OPERATE" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button @click="loadEditItemForm(scope.row)" type="text" icon="el-icon-edit" />
            <el-button @click="delItem(scope.row)" type="text" icon="el-icon-delete" />
          </template>
        </el-table-column>
      </el-table>

      <el-table class="value" v-if="type==='zset'" :data="value" :height="valueHeight">
        <el-table-column prop="value" label="VALUE" />
        <el-table-column prop="score" label="SCORE" />
        <el-table-column label="OPERATE" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button @click="loadEditItemForm(scope.row)" type="text" icon="el-icon-edit" />
            <el-button @click="delItem(scope.row)" type="text" icon="el-icon-delete" />
          </template>
        </el-table-column>
      </el-table>

      <el-table class="value" v-if="type==='hash'" :data="value" :height="valueHeight">
        <el-table-column prop="field" label="FIELD" />
        <el-table-column prop="value" label="VALUE" />
        <el-table-column label="OPERATE" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button @click="loadEditItemForm(scope.row)" type="text" icon="el-icon-edit" />
            <el-button @click="delItem(scope.row)" type="text" icon="el-icon-delete" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="EDIT KEY"
      width="600px"
      center
      :visible.sync="editKeyForm.visible"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="editKeyForm" label-position="top" label-width="100px">
        <el-form-item label="CURRENT KEY">
          <el-input v-model="editKeyForm.key" readonly />
        </el-form-item>
        <el-form-item label="INPUT NEW KEY">
          <el-input v-model="editKeyForm.nkey" placeholder="Input new key..." />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editKeyForm.visible=false">CANCEL</el-button>
        <el-button type="primary" @click="editKey">O K</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="EDIT TTL"
      width="600px"
      center
      :visible.sync="editTtlForm.visible"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="editTtlForm" label-position="top" label-width="100px">
        <el-form-item label="CURRENT TTL">
          <el-input v-model="editTtlForm.ttl" readonly />
        </el-form-item>
        <el-form-item label="INPUT NEW TTL">
          <el-input v-model="editTtlForm.nttl" placeholder="Input new ttl..." />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editTtlForm.visible=false">CENCAL</el-button>
        <el-button type="primary" @click="editTtl">O K</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="EDIT VALUE"
      width="600px"
      center
      :visible.sync="editValueForm.visible"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="editValueForm" label-position="top" label-width="100px">
        <el-form-item label="FIELD" v-if="editValueForm.type==='hash'">
          <el-input v-model="editValueForm.field" readonly />
        </el-form-item>
        <el-form-item label="VALUE">
          <el-input
            type="textarea"
            :rows="5"
            v-model="editValueForm.value"
            placeholder="Input value..."
          />
        </el-form-item>
        <el-form-item label="SCORE" v-if="editValueForm.type==='zset'">
          <el-input v-model="editValueForm.score" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editValueForm.visible=false">CENCAL</el-button>
        <el-button @click="editValue" type="primary">O K</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="ADD ITEM"
      width="600px"
      center
      :visible.sync="addItemForm.visible"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="addItemForm" label-position="top" label-width="100px">
        <el-form-item label="FIELD" v-if="addItemForm.type==='hash'">
          <el-input v-model="addItemForm.field" />
        </el-form-item>
        <el-form-item label="VALUE">
          <el-input
            type="textarea"
            :rows="5"
            v-model="addItemForm.value"
            placeholder="Input value..."
          />
        </el-form-item>
        <el-form-item label="SCORE" v-if="addItemForm.type==='zset'">
          <el-input v-model="addItemForm.score" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addItemForm.visible=false">CENCAL</el-button>
        <el-button @click="addItem" type="primary">O K</el-button>
      </div>
    </el-dialog>
  </div>
</template> 

<script>
let vhSub = 320;
let ttlTimer;
export default {
  name: "redisValue",
  props: ["data"],
  data() {
    return {
      key: " \r\n ",
      type: " ",
      value: " ",
      ttl: " ",
      success: {
        type: "success",
        title: "SUCCESS",
        message: "Modification succeeded!",
        offset: 70
      },
      error: {
        type: "error",
        title: "ERROR",
        message: "Modification failed!",
        offset: 70
      },
      cancel: {
        type: "info",
        title: "INFO",
        message: "Operation cancelled.",
        offset: 70
      },
      confirmWarn: {
        confirmButtonText: "O K",
        cancelButtonText: "CANCEL",
        type: "warning"
      },
      valueHeight: 0,
      strValue: true,
      editKeyForm: {
        visible: false,
        method: "editKey",
        key: "",
        nkey: ""
      },
      editTtlForm: {
        visible: false,
        key: "",
        ttl: "",
        nttl: ""
      },
      editValueForm: {
        visible: false,
        key: "",
        type: "",
        field: "",
        oldValue: "",
        value: "",
        score: ""
      },
      addItemForm: {
        visible: false,
        key: "",
        type: "",
        field: "",
        score: "",
        value: ""
      }
    };
  },
  watch: {
    data: function(nval, oval) {
      this.loadValueHeight();
      this.loadKey();
      this.loadType();
      this.loadTtl();
      this.loadValue();
    },
    valueHeight: function() {
      var valueHeight = this.valueHeight <= 265 ? 265 : this.valueHeight;

      if (this.$refs.strValue && this.$refs.strValue.style) {
        this.$refs.strValue.style.height = valueHeight + "px";
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    getParent(key) {
      var index = key.lastIndexOf(":");
      key = key.substr(0, index);
      return key;
    },
    back: function() {
      var parent = this.getParent(this.data.key);
      if (this.data.value != null) {
        parent = this.getParent(parent);
      }
      this.$emit("func", { method: "back", key: parent });
    },
    backHome: function() {
      this.$emit("func", { method: "backHome" });
    },
    reload() {
      this.$emit("func", { method: "reload", key: this.data.key });
    },
    delMsgBox() {
      this.$confirm("Do you want to delete?", "WARNING", this.confirmWarn)
        .then(() => {
          var delKey = this.data.key;
          if (this.data.value) {
            this.delKey(delKey);
            return;
          }
          this.$RedisGetKeys(this.data.redis, delKey + ":").then(keys => {
            this.delKeys(keys);
          });
        })
        .catch(() => {
          this.$notify(this.cancel);
        });
    },
    delKey(key) {
      this.$RedisDelKey(this.data.redis, key).then(res => {
        if (res == 0) {
          this.$notify(this.error);
          return;
        }
        var parent = this.getParent(this.data.key);
        this.$emit("func", {
          method: "deleteKey",
          key: this.data.key,
          parent: parent
        });
        this.$notify(this.success);
      });
    },
    delKeys(keys) {
      keys.forEach(key => {
        this.$RedisDelKey(this.data.redis, key).then(res => {
          if (res == 0) {
            this.$notify(this.error);
            throw "delete keys error";
          }
        });
      });
      var parent = this.getParent(this.data.key);
      this.$emit("func", {
        method: "deleteKeys",
        keys: keys,
        parent: parent
      });
      this.$notify(this.success);
    },
    loadEditKey() {
      this.editKeyForm.visible = true;
      this.editKeyForm.key = this.data.key;
    },
    editKey() {
      this.$confirm("Do you want to modify?", "WARNING", this.confirmWarn)
        .then(() => {
          this.$RedisEditKey(
            this.data.redis,
            this.editKeyForm.key,
            this.editKeyForm.nkey
          ).then(res => {
            if (res !== "O K") {
              this.$notify(this.error);
              return;
            }
            this.$notify(this.success);
            this.editKeyForm.parent = this.getParent(this.data.key);
            this.$emit("func", this.editKeyForm);
            this.data.key = this.editKeyForm.nkey;
            this.reload();
          });
          this.editKeyVisible = false;
        })
        .catch(() => {
          this.$notify(this.cancel);
        });
    },
    loadEditTtl() {
      this.editTtlForm.visible = true;
      this.editTtlForm.key = this.data.key;
      this.editTtlForm.ttl = this.data.ttl;
      this.editTtlForm.nttl = "";
    },
    editTtl() {
      this.$confirm("Do you want to modify?", "WARNING", this.confirmWarn)
        .then(() => {
          this.$RedisEditTTL(
            this.data.redis,
            this.editTtlForm.key,
            this.editTtlForm.nttl
          ).then(res => {
            if (res !== 1) {
              this.$notify(this.error);
              return;
            }
            this.editTtlVisible = false;
            this.$notify(this.success);
            this.reload();
          });
        })
        .catch(() => {
          this.$notify(this.cancel);
        });
    },
    loadEditStrForm() {
      this.editValueForm.visible = true;
      this.editValueForm.key = this.data.key;
      this.editValueForm.type = this.data.type;
      this.editValueForm.value = this.value;
    },
    editValue() {
      this.$RedisEditValue(this.data.redis, this.editValueForm).then(res => {
        if (res instanceof String && res !== "OK") {
          this.$notify(this.error);
          return;
        } else if (res instanceof Array) {
          res.forEach(r => {
            if (r[1] !== 1) {
              this.$notify(this.error);
              throw "edit value error";
            }
          });
        }
        this.$notify(this.success);
        this.editValueForm.visible = false;
        this.reload();
      });
    },
    loadEditItemForm(item) {
      this.editValueForm.visible = true;
      this.editValueForm.key = this.data.key;
      this.editValueForm.type = this.data.type;
      this.editValueForm.field = item.field;
      this.editValueForm.score = item.score;
      this.editValueForm.oldValue = item.value;
      this.editValueForm.value = item.value;
      this.editValueForm.index = item.index;
    },
    delItem(item) {
      this.$confirm("Do you want to delete?", "WARNING", this.confirmWarn)
        .then(() => {
          this.$RedisDelItem(this.data.redis, {
            key: this.data.key,
            field: item.field,
            value: item.value,
            index: item.index
          }).then(res => {
            if (res === 0) {
              this.$notify(this.error);
              return;
            }
            this.$notify(this.success);
            this.editValueForm.visible = false;
            this.reload();
          });
        })
        .catch(() => {
          this.$notify(this.cancel);
        });
    },
    loadAddItemForm() {
      this.addItemForm.visible = true;
      this.addItemForm.key = this.data.key;
      this.addItemForm.type = this.data.type;
      this.addItemForm.score = 0;
      this.addItemForm.field = "";
      this.addItemForm.value = "";
    },
    addItem() {
      this.$RedisAddItem(this.data.redis, {
        key: this.addItemForm.key,
        field: this.addItemForm.field,
        score: this.addItemForm.score,
        value: this.addItemForm.value
      }).then(res => {
        if (res == 0) {
          this.$notify(this.error);
          return;
        }
        this.$notify(this.success);
        this.addItemForm.visible = false;
        this.reload();
      });
    },
    loadValueHeight() {
      var valueHeight = this.data.windowHeight - vhSub;
      if (this.valueHeight !== valueHeight && this.data.value === undefined) {
        this.valueHeight = valueHeight;
        this.$emit("func", { method: "reload", key: this.data.key });
      }
      if (this.data.value) {
        this.strValue = this.data.type === "string";
        this.valueHeight = valueHeight;
      }
    },
    loadKey() {
      this.key = this.$OrElse(this.data.key, "");
      var index = this.key.lastIndexOf(":");
      if (index > 0 && this.data.type !== null) {
        this.key = this.key.substr(0, index) + "\r\n" + this.key.substr(index);
      } else {
        this.key = this.key + "\r\n ";
      }
    },
    loadType() {
      this.type = this.$OrElse(this.data.type, " ");
    },
    loadTtl() {
      this.ttl = this.$OrElse(this.data.ttl, " ");
      var that = this;
      if (ttlTimer !== undefined) {
        clearInterval(ttlTimer);
      }
      ttlTimer = setInterval(() => {
        if (that.ttl <= 0) {
          clearInterval(ttlTimer);
          return;
        }
        if (that.data.ttl !== "") {
          that.data.ttl = that.ttl - 1;
          that.ttl = that.data.ttl;
          that.editTtlForm.ttl = that.data.ttl;
        }
      }, 1000);
    },
    loadValue() {
      switch (this.type) {
        case "string":
          this.value = this.$FormatJson(this.data.value, "");
          break;
        case "hash":
          this.value = [];
          for (let field in this.data.value) {
            this.value.push({
              field: field,
              value: this.$FormatJson(this.data.value[field], "")
            });
          }
          break;
        case "set":
          this.value = [];
          for (var setItem of this.data.value) {
            this.value.push({ value: this.$FormatJson(setItem, "") });
          }
          break;
        case "zset":
          this.value = [];
          for (var zsetItem of this.data.value) {
            this.value.push({
              value: this.$FormatJson(zsetItem.value, ""),
              score: zsetItem.score
            });
          }
          break;
        case "list":
          this.value = [];
          for (var i = 0; i < this.data.value.length; i++) {
            this.value.push({
              index: i,
              value: this.$FormatJson(this.data.value[i], "")
            });
          }
          break;
        default:
          this.value = "";
          break;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.content {
  position: fixed;
  top: 60px;
  left: 300px;
  width: calc(100% - 300px);
  overflow: hidden;
  min-width: 600px;
  height: calc(100% - 70px);
  text-align: left;
}

.topBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.rightBox {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.box-card {
  margin: 10px 10px 10px 0px;
}

.operate {
  width: 300px;
  position: absolute;
  top: 120px;
  right: 30px;
}
.detail {
  height: calc(100% - 210px);
  overflow: auto;
  min-height: 292px;
}
.label {
  color: #999;
  user-select: none;
}
.value,
.label {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
.value {
  font-size: 16px;
  color: #333;
  font-weight: 300;
}

.btn-group {
  margin: 8px 0px;
}
.detail .value {
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow: auto;
}
.btngp2 .btn {
  width: 150px;
}
.btngp3 .btn {
  width: 100px;
}
</style>
