const router = require('express').Router();
// const bcrypt = require('bcryptjs');
// const { check, validationResult } = require('express-validator');
const Customer = require('../../models/customer');
const Utils = require('../../utils');

// POST http://localhost:3000/api/login
router.post('/', async (req, res) => {
    try {
        const customer = await Customer.emailPassExists(req.body.email, req.body.password);
        if (!customer) {
            return res.status(401).json({ error: 'Error en email y/o password' })
        }
        // Para comparar la pass metida y la hasheada
        //console.log(req.body.password, user.password);
        // o asi, esto da si son iguales true si no false
        /*         const iguales = bcrypt.compareSync(req.body.password, user.password);
                if (iguales) {
                    // Si esta bien le mando el token
                    res.json({ success: createToken(user) });
                } else {
                    res.status(401).json({ error: 'Error en email y/o password' });
                } */
        res.json({
            success: Utils.createTokenFront(customer),
            customerId: customer.id
        })
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
