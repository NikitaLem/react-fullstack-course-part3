module.exports = {
  generateId: data => {
    let id = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
    const check = data.find(p => p.id === id);
    return check ? generateId(data) : id;
  }
};
