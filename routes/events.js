/*
    Rutas de Eventos /Events
    host + /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

//*Para no aplicar el middleware por todas las rutas y repetir nombre se puede hacer de la sgte forma:
router.use( validateJWT );

//* Crear un nuevo evento
router.post( 
    '/',
    [
        check('title', 'Title is require').not().isEmpty(),
        check('start', 'Start Date is require').custom( isDate ),
        check('end', 'End Date is requite').custom( isDate ),
        validateFields
    ] ,
    createEvent 
);

//*Obtener eventos
router.get( '/', getEvents );

//* Actualizar eventos
router.put( '/:id', updateEvent );

//* Borrar eventos
router.delete( '/:id', deleteEvent );

module.exports = router;