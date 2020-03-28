//PRODUCT MODEL
const Product = require('./models/product')
//DATES
const moment = require('moment');
//TOKEN
const jwt = require('jwt-simple');
//IMG
const path = require('path')
const fs = require('fs');
//INVOICE
const PDFDocument = require('pdfkit');
const PDFTable = require('voilab-pdf-table');

/* Functions */

let formatDate = (date) => {
    return new Promise((resolve, reject) => {
        date = moment(date).format('DD/MM/YYYY');
        try {
            resolve(date);
        } catch (error) {
            reject(error)
        }
    });
}

const createToken = (user, type) => {
    const payload = {};
    if (type === 'admin') {
        payload.adminId = user.id;
        payload.creationDate = moment().unix();
        payload.expirationDate = moment().add(15, 'days').unix();
    } else {
        payload.userId = user.id;
        payload.creationDate = moment().unix();
        payload.expirationDate = moment().add(15, 'days').unix();
    }
    return jwt.encode(payload, process.env.SECRET_KEY);
}

const insertImage = async (sku, pReqFile) => {
    //Creo el directorio
    let dir = `./public/images/${sku}/`
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
    let files = fs.readdirSync(dir).length;
    let imageNumber = files + 1;
    // Ruta temporal:
    let pathFile = pReqFile.path;
    // Como vamos a llamar a la imagen en el server
    let newPath = dir + imageNumber + path.extname(pathFile).toLowerCase();
    // La guardamos
    fs.createReadStream(pathFile).pipe(fs.createWriteStream(newPath));
    //Le damos un nombre para la DB
    let imageName = '/images/' + sku + '/' + imageNumber + path.extname(pathFile).toLowerCase();
    return await Product.imgToDb(imageName, imageNumber, sku);
}

const editImage = async (sku, pReqFile, num) => {
    let dir = `./public/images/${sku}/`
    let pathFile = pReqFile.path;
    let newPath = dir + num + path.extname(pathFile).toLowerCase();
    fs.createReadStream(pathFile).pipe(fs.createWriteStream(newPath));
    let imageName = '/images/' + sku + '/' + num + path.extname(pathFile).toLowerCase();
    return await Product.imgToDb(imageName, num, sku);
}

const generateInvoice = (arrOrdersById) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const table = new PDFTable(doc, { bottomMargin: 30 });

            doc.pipe(fs.createWriteStream(`./public/invoices/invoice_order_#${arrOrdersById[0].fk_order}.pdf`));

            doc.image('public/images/merchs-logo.png', 15, 15, { width: 75 });

            table
                .addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
                    column: 'description'
                }))
                .setColumnsDefaults({
                    align: 'right',
                })
                .addColumns([
                    {
                        id: 'description',
                        header: 'Product',
                        align: 'left'
                    },
                    {
                        id: 'quantity',
                        header: 'Quantity',
                        width: 50
                    },
                    {
                        id: 'price',
                        header: 'Price',
                        width: 40
                    },
                    {
                        id: 'total',
                        header: 'Total',
                        width: 70,
                        renderer: function (tb, data) {
                            return data.total + ' €';
                        }
                    }
                ]);

            for (let i = 0; i < arrOrdersById.length; i++) {
                table.addBody([
                    {
                        description: arrOrdersById[i].title,
                        quantity: arrOrdersById[i].quantity,
                        price: arrOrdersById[i].price,
                        total: arrOrdersById[i].quantity * arrOrdersById[i].price
                    }
                ]);
            }

            doc.end();
            resolve(doc);
        }
        catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    formatDate: formatDate,
    createToken: createToken,
    insertImage: insertImage,
    generateInvoice: generateInvoice,
    editImage: editImage
}