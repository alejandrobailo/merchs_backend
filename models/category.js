const getAll = () => {
    return new Promise((resolve, reject) => db.query('select * from category', (err, rows) => {
        if (err) reject(err)
        resolve(rows);
    }));
};


const createCategoryRelation = (category, productId) => {
    return new Promise((resolve, reject) => {
        db.query('insert into tbi_category_product (fk_product, fk_category) values (?, ?)',
            [productId, category], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
    });
}
module.exports = {
    getAll: getAll,
    createCategoryRelation: createCategoryRelation
}

