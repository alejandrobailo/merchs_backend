const getAll = () => {
    return new Promise((resolve, reject) => db.query('select * from brand', (err, rows) => {
        if (err) reject(err)
        resolve(rows);
    }));
};


const createBrandRelation = (brand, productId) => {
    return new Promise((resolve, reject) => {
        db.query('insert into tbi_brand_product (fk_product, fk_brand) values (?, ?)',
            [productId, brand], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
    });
}


module.exports = {
    getAll: getAll,
    createBrandRelation: createBrandRelation
}