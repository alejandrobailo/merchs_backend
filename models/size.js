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

const getById = (productId) => {
    return new Promise((resolve, reject) => {
        db.query('select tbi_size_product.quantity, size.number from tbi_size_product, size where tbi_size_product.fk_product = ? and fk_size = size.id', [productId], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

/* Edit sizes */
const editById = (sizesQuantities, sku) => {
    return new Promise((resolve, reject) => {
        sizesQuantities = JSON.parse(sizesQuantities);
        for (item of sizesQuantities) {
            db.query('UPDATE tbi_size_product SET quantity = ? WHERE fk_product = ? and fk_size = (select size.id from size where size.number = ?)',
                [item.quantity, sku, item.size], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
        }
    });
};

module.exports = {
    getAll: getAll,
    createSizesRelation: createSizesRelation,
    getById: getById,
    editById: editById
}