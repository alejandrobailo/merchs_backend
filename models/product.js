/* All products with brands and categories*/
const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query(`select product.*, category.name as 'category_name', brand.name as 'brand_name' from product inner join brand on product.fk_brand = brand.id inner join category on product.fk_category = category.id order by product.sku ASC`, (err, rows) => {
            if (err) reject(err)
            resolve(rows);
        });
    });
};

/* Create product */
const create = ({ title, price, discount, description, brand, category }) => {
    return new Promise((resolve, reject) => {
        db.query('insert into product (title, price, discount, date, description, fk_brand, fk_category) values (?, ?, ?, ?, ?, ?, ?)',
            [title, price, discount, new Date(), description, brand, category],
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

module.exports = {
    getAll: getAll,
    create: create,
    getById: getById,
    imgToDb: imgToDb
}