const getAll = () => {
    return new Promise((resolve, reject) => db.query('select * from category', (err, rows) => {
        if (err) reject(err)
        resolve(rows);
    }));
};

const createCategoryRelation = (categories, productId) => {
    return new Promise((resolve, reject) => {
        categories = JSON.parse(categories);
        for (category of categories) {
            db.query('insert into tbi_category_product (fk_product, fk_category) values (?, (select category.id from category where name = ?))',
                [productId, category], (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
        }
    });
}

const deleteById = (sku) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM tbi_category_product WHERE fk_product = ?', [sku], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const getById = (sku) => {
    return new Promise((resolve, reject) => {
        db.query('select category.name from tbi_category_product, category where tbi_category_product.fk_product = ? and fk_category = category.id', [sku], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

module.exports = {
    getAll: getAll,
    createCategoryRelation: createCategoryRelation,
    deleteById: deleteById,
    getById: getById
}

