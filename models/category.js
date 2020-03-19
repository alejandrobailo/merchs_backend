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

module.exports = {
    getAll: getAll,
    createCategoryRelation: createCategoryRelation
}

