<template>
  <div id="windowTitle">
    <div class="titleLeft">
      <p class="windowName">Redis Client</p>
      <el-button class="noDrag" @click="loadConnect">CONNECTS</el-button>
    </div>
    <div class="titleRight noDrag">
      <el-input placeholder="INPUT SEARCH KEY" v-model="key" class="inputKey">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <WindowTitleButton type="min" />
      <WindowTitleButton type="close" />
    </div>

    <el-dialog
      title="CONNECTS"
      width="600px"
      center
      :visible.sync="connect.visible"
      :show-close="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-table :data="connects" height="400">
        <el-table-column label="SELECT" fixed="left" width="80">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.selected" @change="selectedConnect(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="NAME" />
        <el-table-column prop="db" label="DB" />
        <el-table-column label="OPERATION" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                @click="loadConnectForm(scope.row._id)"
                icon="el-icon-edit"
                type="primary"
                size="mini"
                round
              />
              <el-button
                @click="delConnect(scope.row._id)"
                icon="el-icon-delete"
                type="danger"
                size="mini"
                round
              />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        icon="el-icon-circle-plus"
        style="width:100%;margin-top:5px"
        @click="loadConnectForm()"
      >CONNECT</el-button>

      <div slot="footer" class="dialog-footer">
        <el-button @click="connect.visible=false">CLOSE</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="CONNECT"
      width="600px"
      center
      :visible.sync="connectForm.visible"
      :show-close="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="connectForm" label-position="top" label-width="100px">
        <el-form-item label="NAME">
          <el-input v-model="connectForm.name" placeholder="Input name..." />
        </el-form-item>

        <el-form-item style="margin-bottom:0px">
          <el-form-item label="HOST" style="width:70%;float:left;" />
          <el-form-item label="PORT" style="width:15%;float:left;margin-left:20px" />
        </el-form-item>
        <div ref="hostPort" v-for="(item,index) in connectForm.nodes" v-bind:key="index">
          <el-form-item style="width:70%;float:left;">
            <el-input placeholder="Input host..." v-model="item.host" />
          </el-form-item>
          <el-form-item style="width:20%;float:left;margin-left:20px">
            <el-input placeholder="Input port..." v-model="item.port" />
          </el-form-item>
          <el-button
            icon="el-icon-delete"
            style="float:left;margin-left:20px;width:10px"
            type="text"
            @click="delHostPort(index)"
          />
        </div>
        <el-button
          @click="addHostPort"
          icon="el-icon-circle-plus"
          style="width:100%;margin-bottom:15px"
        >HOST PORT</el-button>

        <el-form-item>
          <el-form-item label="PASS" style="width:70%;float:left;">
            <el-input v-model="connectForm.pass" placeholder="Input pass..." />
          </el-form-item>
          <el-form-item label="DB" style="width:26%;float:right;">
            <el-input v-model="connectForm.db" placeholder="Input db..." />
          </el-form-item>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="connectForm.visible=false">CLOSE</el-button>
        <el-button type="primary" @click="saveConnect">O K</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 
<script>
import WindowTitleButton from "../components/WindowTitleButton";
import { success, error, cancel, confirmWarn } from "../utils/messageBox";
export default {
  name: "windowTitle",
  props: ["data"],
  components: {
    WindowTitleButton
  },
  data() {
    return {
      key: "",
      connect: {
        visible: false
      },
      connects: [],
      connectForm: {
        visible: false,
        _id: "",
        name: "",
        pass: "",
        db: "",
        selected: "",
        nodes: []
      }
    };
  },
  mounted() {},
  created() {},
  methods: {
    search() {
      this.$emit("func", {
        method: "search",
        key: this.key
      });
    },
    loadConnect() {
      this.connect.visible = true;
      this.loadConnects();
    },
    loadConnects() {
      this.data.local.find({}, (err, res) => {
        this.connects = res;
        console.log(res);
      });
    },
    selectedConnect(selectedConn) {
      this.data.local.update(
        {},
        { $set: { selected: false } },
        { multi: true },
        (err, res) => {
          if (err) {
            this.$notify(error());
            return;
          }
          this.data.local.update(
            { _id: selectedConn._id },
            { $set: { selected: true } },
            (err, res) => {
              if (err) {
                this.$notify(error());
                return;
              }
              this.$notify(success());
              this.connects.forEach(conn => {
                conn.selected = false;
              });
              selectedConn.selected = true;
              this.$emit("func", { method: "selectedConnect" });
            }
          );
        }
      );
    },
    loadConnectForm(_id) {
      if (_id === null || _id === undefined) {
        this.clearConnectForm();
        return;
      }
      this.data.local.findOne({ _id: _id }, (err, res) => {
        this.connectForm = {
          visible: true,
          _id: res._id,
          name: res.name,
          pass: res.pass,
          db: res.db,
          selected: res.selected,
          nodes: res.nodes
        };
      });
    },
    clearConnectForm() {
      this.connectForm = {
        visible: true,
        name: "",
        pass: "",
        db: "",
        selected: "",
        nodes: [{ host: "", port: "" }]
      };
    },
    saveConnect() {
      if (this.connectForm._id !== undefined) {
        this.update();
      } else {
        this.insert();
      }
      this.connectForm.visible = false;
    },
    update() {
      var updateParam = {
        name: this.connectForm.name,
        pass: this.connectForm.pass,
        db: this.connectForm.db,
        selected: this.connectForm.selected,
        nodes: this.connectForm.nodes
      };
      this.data.local.update(
        { _id: this.connectForm._id },
        { $set: updateParam },
        (err, res) => {
          if (res === 0) {
            this.$notify(error());
            return;
          }
          this.$notify(success());
          this.loadConnects();
          if (this.connectForm.selected) {
            this.$emit("func", { method: "selectedConnect" });
          }
        }
      );
    },
    insert() {
      this.data.local.insert(this.connectForm, (err, res) => {
        if (!res._id) {
          this.$notify(error());
          return;
        }
        this.$notify(success());
        this.loadConnects();
      });
    },
    addHostPort() {
      this.connectForm.nodes.push({ host: "", port: "" });
    },
    delHostPort(index) {
      this.connectForm.nodes.splice(index, 1);
    },
    delConnect(_id) {
      this.data.local.remove({ _id: _id }, (err, res) => {
        if (res === 0) {
          this.$notify(error());
          return;
        }
        this.$notify(success());
        this.loadConnects();
      });
    }
  }
};
</script>
    
<style >
#windowTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-app-region: drag;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: #f56c6c;
  position: absolute;
  left: 1px;
}
.titleLeft {
  display: flex;
  padding-left: 10px;

  align-items: center;
}
.titleRight {
  display: flex;
  padding-right: 145px;
  align-items: center;
}
.windowName {
  font-size: 26px;
  color: #fff;
  margin-right: 15px;
}
.noDrag {
  -webkit-app-region: no-drag;
}
.inputKey {
  margin-right: 10px;
}
</style>