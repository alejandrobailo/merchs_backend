/* All products with brands*/
const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query(`select product.*, brand.name as 'brand_name' from product inner join brand on product.fk_brand = brand.id order by product.sku ASC`, (err, rows) => {
            if (err) reject(err)
            resolve(rows);
        });
    });
};

const getProductCategories = (productId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM category INNER JOIN tbi_category_product ON fk_category = category.id AND fk_product = ?', [productId], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

/* Create product */
const create = ({ title, price, discount, description, brand }) => {
    return new Promise((resolve, reject) => {
        db.query('insert into product (title, price, discount, date, description, fk_brand) values (?, ?, ?, ?, ?, ?)',
            [title, price, discount, new Date(), description, brand],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
    });
}

/* Get product by SKU */
const getById = (sku) => {
    return new Promise((resolve, reject) => {
        db.query('select * from product where product.sku = ?', [sku], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

/* Insert IMG */
const imgToDb = (name, counter, id) => {
    return new Promise((resolve, reject) => {
        db.query('update product set image_? = ? where sku = ?', [counter, name, id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

/* Edit product */
const editById = ({ title, description, price, discount }, sku) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE product SET title = ?, description = ?, price = ?, discount = ? WHERE sku = ?', [title, description, price, discount, sku], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/* Delete product */
const deleteById = (sku) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM product WHERE sku = ?', [sku], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/* API QUERIES */
/* All products*/
const getAllApi = () => {
    return new Promise((resolve, reject) => {
        db.query(`select product.*, brand.name as 'brand', GROUP_CONCAT(category.name) as 'cat_name' from product inner join brand on product.fk_brand = brand.id inner join tbi_category_product on product.sku = tbi_category_product.fk_product inner join category on category.id = tbi_category_product.fk_category group by product.sku, brand.name`, (err, rows) => {
            if (err) reject(err)
            resolve(rows);
        });
    });
};

module.exports = {
    getAll: getAll,
    getProductCategories: getProductCategories,
    create: create,
    getById: getById,
    imgToDb: imgToDb,
    editById: editById,
    deleteById: deleteById,
    getAllApi: getAllApi
}