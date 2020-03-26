// Function for the API
const getOrdersByCustomer = (customerId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM merchs.order WHERE fk_customer = ?', [customerId], (err, rows) => {
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
        db.query('SELECT * FROM product INNER JOIN tbi_product_order ON fk_product = product.sku INNER JOIN merchs.order ON fk_order = merchs.order.id INNER JOIN customer ON fk_customer = customer.id AND product.fk_user = ?', [userId], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

const getAllOrders = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM product INNER JOIN tbi_product_order ON fk_product = product.sku INNER JOIN merchs.order ON fk_order = merchs.order.id INNER JOIN customer ON fk_customer = customer.id', (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

module.exports = {
    getOrdersByCustomer: getOrdersByCustomer,
    getProductsInOrder: getProductsInOrder,
    getOrdersByUser: getOrdersByUser,
    getAllOrders: getAllOrders
}