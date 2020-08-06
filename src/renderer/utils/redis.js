// 获取所有KEY
export function getKeys(redis, baseKey) {
	var keys = redis.keys(baseKey + "*", (error, keys) => {
		return keys
	})
	return keys
}

// 获取KEY详细信息
export function getDetail(redis, key) {
	return redis.type(key).then(type => {
		var valuePromise
		switch (type) {
			case "string":
				valuePromise = redis.get(key)
				break
			case "list":
				valuePromise = redis.lrange(key, 0, -1)
				break
			case "set":
				valuePromise = redis.smembers(key)
				break
			case "zset":
				valuePromise = redis.zscan(key, 0).then(val => {
					var zset = []
					var vs = val[1]
					for (var i = 0; i < vs.length; i += 2) {
						zset.push({ value: vs[i], score: vs[i + 1] })
					}
					return zset
				})
				break
			case "hash":
				valuePromise = redis.hgetall(key)
				break
			default:
				valuePromise = new Promise((resolve, reject) => {
					resolve(null)
				})
				break
		}
		return valuePromise.then(val => redis.ttl(key).then(ttl => {
			return { key: key, type: type, ttl: ttl, value: val }
		}))
	})
}

// 设置TTL
export function editTTL(redis, key, ttl) {
	return redis.expire(key, ttl)
}

// 设置VALUE
export function editValue(redis, param) {
	var key = param.key
	return redis.type(key).then((type) => {
		switch (type) {
			case "string":
				return redis.set(key, param.value)
			case "list":
				return redis.lset(key, param.index, param.value)
			case "set":
				return redis.pipeline()
					.srem(key, param.oldValue)
					.sadd(key, param.value)
					.exec()
			case "zset":
				return redis.pipeline()
					.zrem(key, param.oldValue)
					.zadd(key, param.score, param.value)
					.exec()
			case "hash":
				return redis.hset(key, param.field, param.value)
			default:
				return { type: type }
		}
	})
}

// 设置KEY
export function editKey(redis, key, nkey) {
	return redis.rename(key, nkey)
}

// 删除KEY
export function delKey(redis, key) {
	return redis.del(key)
}

// 添加成员
export function addItem(redis, param) {
	console.log(param)
	var key = param.key
	return redis.type(key).then((type) => {
		switch (type) {
			case "list":
				return redis.rpush(key, param.value)
			case "set":
				return redis.sadd(key, param.value)
			case "zset":
				return redis.zadd(key, param.score, param.value)
			case "hash":
				return redis.hset(key, param.field, param.value)
			default:
				return { type: type }
		}
	})
}

// 删除成员
export function delItem(redis, param) {
	var key = param.key
	return redis.type(key).then((type) => {
		switch (type) {
			case "list":
				var timestamp = new Date().getTime()
				var delFlag = "list_item_delete_flag_" + timestamp
				return redis.pipeline()
					.lset(key, param.index, delFlag)
					.lrem(key, 0, delFlag)
					.exec()
			case "set":
				return redis.srem(key, param.value)
			case "zset":
				return redis.zrem(key, param.value)
			case "hash":
				return redis.hdel(key, param.field)
			default:
				return { type: type }
		}
	})
}
