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

const createTokenFront = (customer) => {
    const payload = {
        customerId: customer.id,
        fechaCreacion: moment().unix(),
        fechaExpiracion: moment().add(150, 'minutes').unix()
    }
    return jwt.encode(payload, process.env.SECRET_KEY)
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
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const table = new PDFTable(doc);
            const prods = [];

            doc.pipe(fs.createWriteStream(`./public/invoices/invoice_order_#${arrOrdersById[0].fk_order}.pdf`));

            doc
                .font('Courier')
                .fontSize(10)

            doc.image('public/images/merchs-logo.png', 65, 30, { width: 75 });

            doc
                .text(`Invoice Number: #${arrOrdersById[0].fk_order} `, 350, 35)
                .text(`Invoice Date: ${arrOrdersById[0].order_date} `, 350, 50)

            doc
                .text('Customer Details', 65, 160)
                .text(`Name: ${arrOrdersById[0].first_name} ${arrOrdersById[0].last_name}`, 85, 175)
                .text(`Phone: ${arrOrdersById[0].phone}`, 85, 190)
                .text(`Email: ${arrOrdersById[0].email}`, 85, 205)
                .text(`Address: ${arrOrdersById[0].address}, ${arrOrdersById[0].city}, ${arrOrdersById[0].region}`, 85, 220)
                .text(`Postal Code: ${arrOrdersById[0].postcode}`, 85, 235)
                .text(`Country: ${arrOrdersById[0].country}`, 85, 250)

            doc.text('Order Details', 65, 280)

            doc.moveDown(1);

            table
                .addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
                    column: 'description'
                }))
                .setColumnsDefaults({
                    align: 'center'
                })
                .addColumns([
                    {
                        id: 'sku',
                        header: 'SKU',
                        width: 50,
                    },
                    {
                        id: 'description',
                        header: 'Product',
                        width: 150,
                        align: 'left'
                    },
                    {
                        id: 'size',
                        header: 'Size',
                        width: 40,
                    },
                    {
                        id: 'quantity',
                        header: 'Quantity',
                        width: 60,
                    },
                    {
                        id: 'price',
                        header: 'Price',
                        width: 40,
                    },
                    {
                        id: 'subtotal',
                        header: 'Subtotal',
                        width: 66,
                    }
                ]);

            for (let i = 0; i < arrOrdersById.length; i++) {
                const sizeDecoded = await Product.getSizeDecoded(arrOrdersById[i].fk_size);
                prods.push(
                    {
                        sku: arrOrdersById[i].sku,
                        description: arrOrdersById[i].title,
                        size: sizeDecoded[0].number,
                        quantity: arrOrdersById[i].quantity,
                        price: arrOrdersById[i].price,
                        subtotal: arrOrdersById[i].quantity * arrOrdersById[i].price
                    }
                );
            }
            table.addBody(prods);

            doc.moveDown(1);

            doc.text(`TOTAL:${arrOrdersById[0].totalAmount}€`);

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
    createTokenFront: createTokenFront,
    insertImage: insertImage,
    generateInvoice: generateInvoice,
    editImage: editImage
}