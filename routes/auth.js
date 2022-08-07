/*
    Rutas de Usuarios /Auth
    host + /api/auth
*/
// const express = require('express');
// const router = express.Router;
const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { registerUser, loginUser, renewTokenUser } = require('../controllers/auth');
const { validateFields } =  require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

router.post(
    '/',
    [//*Middleware
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validateFields
    ], 
    loginUser
);

//* El atributo después del Path corresponde a un arreglo de Middleware que se van a encargar
//* de validar los campos que vienen en el BODY
router.post(
    '/new', 
    [//*Middleware
        check('name' , 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validateFields
    ], 
    registerUser
);

router.get(
    '/renew',
    [
        validateJWT
    ],
    renewTokenUser
);

module.exports = router;