import { formatJson } from '../utils/format'
import { orelse } from '../utils/orelse'
import {
	getKeys,
	getDetail,
	editTTL,
	editValue,
	editKey,
	delKey,
	addItem,
	delItem
} from "../utils/redis";

export default {
	install(Vue) {
		Vue.prototype.$FormatJson = (val) => formatJson(val),
			Vue.prototype.$OrElse = (val, other) => orelse(val, other),
			Vue.prototype.$RedisGetKeys = (redis, baseKey) => getKeys(redis, baseKey),
			Vue.prototype.$RedisGetDetail = (redis, key) => getDetail(redis, key),
			Vue.prototype.$RedisEditTTL = (redis, key, ttl) => editTTL(redis, key, ttl),
			Vue.prototype.$RedisEditValue = (redis, param) => editValue(redis, param),
			Vue.prototype.$RedisEditKey = (redis, key, nkey) => editKey(redis, key, nkey),
			Vue.prototype.$RedisDelKey = (redis, key) => delKey(redis, key),
			Vue.prototype.$RedisAddItem = (redis, param) => addItem(redis, param),
			Vue.prototype.$RedisDelItem = (redis, param) => delItem(redis, param)
	}
}