// Function for the API
const createOrder = (order) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO merchs.order (order_status, fk_customer, totalAmount) VALUES (?, ?, ?)', [order.order_status, order.customerId, order.totalAmount], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const createOrderProducts = (orderId, order) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO tbi_product_order (fk_order, fk_product, fk_size, quantity) VALUES (?, ?, ?, ?)', [orderId, order.sku, order.size, order.quantityToSubstract], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

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

const getAllOrdersByUser = (userId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM product INNER JOIN tbi_product_order ON fk_product = product.sku INNER JOIN merchs.order ON fk_order = merchs.order.id INNER JOIN customer ON fk_customer = customer.id where product.fk_user = ?',[userId], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

const getMoneyMonth = (userId) => {
    return new Promise((resolve, reject) => {
        db.query(`select DATE_FORMAT(order.order_date, "%m-%Y") as 'month', sum(product.price * tbi_product_order.quantity) as 'money' 
        from merchs.order 
        inner join tbi_product_order on tbi_product_order.fk_order = order.id
        inner join product on product.fk_user = ? and tbi_product_order.fk_product = product.sku
        GROUP BY DATE_FORMAT(order.order_date, "%m-%Y")`,
            [userId], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
    });
}

const getProductsOrderedByBrand = (userId) => {
    return new Promise((resolve, reject) => {
        db.query(`select brand.name, SUM(tbi_product_order.quantity) as 'numProds' from brand
        inner join product on product.fk_brand = brand.id
        inner join tbi_product_order on fk_product = product.sku 
        where product.fk_user = ?
        GROUP BY brand.name`,
            [userId], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
    });
}

module.exports = {
    getOrdersByCustomer: getOrdersByCustomer,
    getProductsInOrder: getProductsInOrder,
    getOrdersByUser: getOrdersByUser,
    getAllOrders: getAllOrders,
    getMoneyMonth: getMoneyMonth,
    getProductsOrderedByBrand: getProductsOrderedByBrand,
    createOrder: createOrder,
    createOrderProducts: createOrderProducts,
    getAllOrdersByUser: getAllOrdersByUser
}