/**
 * 设置本地缓存
 * @param key 缓存的键名
 * @param value 缓存的内容
 */
export function setStorage<K extends Storage.Key>(key: K, value: Storage.Value<K>) {
  uni.setStorageSync(key, value)
}

/**
 * 获取本地缓存
 * @param key 缓存的键名
 * @returns 返回对应类型的数据，不存在时返回 null
 */
export function getStorage<K extends Storage.Key>(key: K): Storage.Value<K> | null {
  const data = uni.getStorageSync(key)
  return data !== '' ? data : null
}

/**
 * 移除指定的本地缓存
 * @param key 需要移除的键名
 */
export function removeStorage<K extends Storage.Key>(key: K) {
  uni.removeStorageSync(key)
}

/**
 * 清除所有的本地缓存
 */
export function clearStorage() {
  uni.clearStorageSync()
}
