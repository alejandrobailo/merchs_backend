//PRODUCT MODEL
const Product = require('./models/product')
//DATES
const moment = require('moment');
//TOKEN
const jwt = require('jwt-simple');
//IMG
const path = require('path')
const fs = require('fs');

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

module.exports = {
    formatDate: formatDate,
    createToken: createToken,
    insertImage: insertImage
}