const getAll = () => {
  return new Promise((resolve, reject) => {
    db.query("select * from product", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  getAll: getAll
};
