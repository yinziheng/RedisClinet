<template>
  <div id="app" ref="app">
    <Title v-bind:data="titleData" @func="titleMethod" />
    <Keys v-bind:data="menuData" @func="menuMethod" />
    <Value v-bind:data="contentData" @func="contentMethod" />
  </div>
</template>

<script>
// 加载模块
import nedb from "nedb";
import Value from "./views/RedisValue.vue";
import Title from "./views/WindowTitle.vue";
import Keys from "./views/RedisKeys.vue";
import Redis from "ioredis";
import { allKey } from "./utils/redis";

// 实例化连接对象（不带参数默认为内存数据库）
const local = new nedb({
  filename: "../db/local.db",
  autoload: true
});

//创建集群连接
let redis;

export default {
  name: "app",
  components: {
    Title,
    Keys,
    Value
  },
  data() {
    return {
      allKeys: [],
      titleData: {
        local: local
      },
      contentData: {
        key: "",
        valueType: "",
        keyValue: "",
        windowHeight: 0,
        redis: redis
      },
      menuData: {
        key: "",
        datas: [],
        windowHeight: 0
      },
      windowHeight: 750,
      windowWidth: 1200
    };
  },
  watch: {
    windowHeight: function() {
      this.$refs.app.style.height = this.windowHeight - 2 + "px";
    }
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      that.windowHeight = window.innerHeight;
      that.windowWidth = window.innerWidth;

      that.menuData = {
        key: that.menuData.key,
        datas: that.menuData.datas,
        windowHeight: window.innerHeight
      };
      that.contentData = {
        key: that.contentData.key,
        windowHeight: window.innerHeight,
        redis: redis
      };
    };
  },
  created() {
    this.initConfig();
  },
  methods: {
    initConfig() {
      var that = this;
      local.findOne({ selected: true }, (err, res) => {
        if (!res) {
          return;
        }
        that.initRedis(res);
        that.loadRedisAllKey();
      });
    },
    initRedis(redisConfig) {
      var pass = redisConfig.pass;
      var db = redisConfig.db;
      var redisNodes = redisConfig.nodes;
      if (redisNodes.length > 1) {
        redis = new Redis.Cluster(redisConfig, {
          redisOptions: { password: pass }
        });
      }
      // 如果只配置一个，那么认为是单节点连接
      else if (redisNodes.length === 1) {
        var prefix = "";
        var conn = `redis://:${pass}@${redisNodes[0].host}:${redisNodes[0].port}/${db}`;
        var keyPrefix = { keyPrefix: prefix };
        redis = new Redis(conn, keyPrefix);
      } else {
        throw "redis config error";
      }
    },
    selectedMenuKey(selectedKey) {
      const that = this;
      var content = this.$RedisGetDetail(redis, selectedKey);
      content.then(data => {
        if (data.value == null) {
          that.loadMenuKey(selectedKey);
        }
        that.contentData = {
          key: data.key,
          type: data.type == "none" ? null : data.type,
          ttl: data.ttl == -2 ? null : data.ttl,
          value: data.value,
          redis: redis,
          windowHeight: window.innerHeight
        };
      });
    },
    loadMenuKey(selectedKey) {
      var keySet = new Set();
      this.allKeys.forEach(key => {
        if (key === undefined) {
          return;
        }
        if (selectedKey !== "" && key.indexOf(selectedKey + ":") != 0) {
          return;
        }
        if (selectedKey !== "") {
          key = key.replace(selectedKey + ":", "");
        }
        if (selectedKey === key) {
          key = "";
        }
        var index = key.indexOf(":");
        if (index > 0 && index < key.length - 1) {
          key = key.substr(0, index);
        }
        if (key !== "") {
          keySet.add(key);
        }
      });
      var datas = [];
      keySet.forEach(key => {
        datas.push({ key: key });
      });
      this.menuData = {
        key: selectedKey,
        datas: datas,
        windowHeight: window.innerHeight
      };
    },
    loadRedisAllKey() {
      var that = this;
      this.allKeys = this.$RedisGetKeys(redis, "")
        .then(keys => {
          that.allKeys = keys;
          return that;
        })
        .then(that => {
          that.loadMenuKey("");
        });
    },
    titleMethod(param) {
      switch (param.method) {
        case "selectedConnect":
          this.initConfig();
          break;
        case "search":
          this.selectedMenuKey(param.key);
          break;
        default:
          break;
      }
    },
    menuMethod(param) {
      switch (param.method) {
        case "selectedKey":
          this.selectedMenuKey(param.key);
          break;
        case "reload":
          this.loadRedisAllKey();
          break;
        default:
          break;
      }
    },
    contentMethod(param) {
      switch (param.method) {
        case "back":
          this.selectedMenuKey(param.key);
          break;
        case "backHome":
          this.selectedMenuKey("");
          break;
        case "reload":
          this.selectedMenuKey(param.key);
          break;
        case "editKey":
          for (let i = 0; i < this.allKeys.length; i++) {
            if (param.key === this.allKeys[i]) {
              this.allKeys[i] = param.nkey;
            }
          }
          this.selectedMenuKey(param.parent);
          break;
        case "deleteKey":
          for (let i = 0; i < this.allKeys.length; i++) {
            if (param.key === this.allKeys[i]) {
              this.allKeys[i] = undefined;
            }
          }
          this.selectedMenuKey(param.parent);
          break;
        case "deleteKeys":
          for (let i = 0; i < this.allKeys.length; i++) {
            param.keys.forEach(key => {
              if (key === this.allKeys[i]) {
                this.allKeys[i] = undefined;
              }
            });
          }
          this.selectedMenuKey(param.parent);
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style >
* {
  margin: 0px;
  padding: 0px;
}
body {
  overflow: hidden;
  border: 1px solid #f56c6c;
}
#app {
  font-family: "Microsoft YaHei";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
  height: 798px;
  width: 1198px;
}
</style>
