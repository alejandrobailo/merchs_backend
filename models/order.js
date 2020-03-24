const getByCustomer = (customerId, status) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM merchs.order WHERE fk_customer = ? AND status = ?', [customerId, status], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

const getProductsInOrder = (orderId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM product INNER JOIN tbi_product_order ON fk_product = product.sku AND fk_order = ?', [orderId], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

module.exports = {
    getByCustomer: getByCustomer,
    getProductsInOrder: getProductsInOrder
}