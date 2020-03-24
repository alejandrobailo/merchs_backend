const getOrdersByCustomer = (customerId, status) => {
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

const getOrdersByUser = (userId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM product INNER JOIN tbi_product_order ON fk_product = product.sku INNER JOIN merchs.order ON fk_order = merchs.order.id AND product.fk_user = ?', [userId], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

module.exports = {
    getOrdersByCustomer: getOrdersByCustomer,
    getProductsInOrder: getProductsInOrder,
    getOrdersByUser: getOrdersByUser
}