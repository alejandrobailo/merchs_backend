/* All products with brands*/
const getAll = (userId) => {
    return new Promise((resolve, reject) => {
        db.query(`select product.*, brand.name as 'brand_name' from product inner join brand on product.fk_brand = brand.id and fk_user = ? order by product.sku ASC`, [userId], (err, rows) => {
            if (err) reject(err)
            resolve(rows);
        });
    });
};

const getAllAdmin = () => {
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
const create = ({ title, price, discount, description, brand, user }) => {
    return new Promise((resolve, reject) => {
        db.query('insert into product (title, price, discount, product_date, description, fk_brand, fk_user) values (?, ?, ?, ?, ?, ?, ?)',
            [title, price, discount, new Date(), description, brand, user],
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

/* Edit product User */
const editById = ({ title, description, price, discount }, sku) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE product SET title = ?, description = ?, price = ?, discount = ? WHERE sku = ?', [title, description, price, discount, sku], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/* Edit product Admin */
const editByIdAdmin = ({ title, description, price, discount, product_status }, sku) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE product SET title = ?, description = ?, price = ?, discount = ?, product_status = ? WHERE sku = ?', [title, description, price, discount, product_status, sku], (err, result) => {
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
        db.query(`select product.*, brand.name as 'brand', GROUP_CONCAT(category.name) as 'cat_name' from product inner join brand on product.fk_brand = brand.id inner join tbi_category_product on product.sku = tbi_category_product.fk_product inner join category on category.id = tbi_category_product.fk_category where product.product_status = 'active' group by product.sku, brand.name`, (err, rows) => {
            if (err) reject(err)
            resolve(rows);
        });
    });
};

const updateProductQuantity = (order) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE tbi_size_product SET quantity = quantity - ? WHERE fk_product = ? AND fk_size = ?', [order.quantityToSubstract, order.sku, order.size], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const getSizeEncoded = (sizeNotEncoded) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT size.id FROM size WHERE size.number = ?', [sizeNotEncoded], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
};

const getSizeDecoded = (sizeEncoded) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT size.number FROM size WHERE size.id = ?', [sizeEncoded], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
};

module.exports = {
    getAll: getAll,
    getAllAdmin: getAllAdmin,
    getProductCategories: getProductCategories,
    create: create,
    getById: getById,
    imgToDb: imgToDb,
    editById: editById,
    editByIdAdmin: editByIdAdmin,
    deleteById: deleteById,
    getAllApi: getAllApi,
    updateProductQuantity: updateProductQuantity,
    getSizeEncoded: getSizeEncoded,
    getSizeDecoded: getSizeDecoded
}