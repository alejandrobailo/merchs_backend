const getAll = () => {
    return new Promise((resolve, reject) => db.query('select * from size', (err, rows) => {
        if (err) reject(err)
        resolve(rows);
    }));
};

const createSizesRelation = (sizesQuantities, productId) => {
    return new Promise((resolve, reject) => {
        sizesQuantities = JSON.parse(sizesQuantities);
        for (item of sizesQuantities) {
            db.query('insert into tbi_size_product (fk_product, fk_size, quantity) values (?, (select size.id from size where size.number = ?), ?)',
                [productId, item.size, item.quantity], (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
        }
    });
}

module.exports = {
    getAll: getAll,
    createSizesRelation: createSizesRelation
}