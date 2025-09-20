class UserSocketMap {
  map = new Map();

  set(userId, socketId) {
    return this.map.set(userId, socketId);
  }

  get(userId) {
    return this.map.get(userId);
  }

  delete(userId) {
    return this.map.delete(userId);
  }

  clear() {
    return this.map.clear();
  }

  getKeys() {
    let keys = [];

    for (const key of this.map.keys()) {
      keys.push(key);
    }

    return keys;
  }
}

module.exports = UserSocketMap;
