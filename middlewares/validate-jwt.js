const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = ( req, res = response, next ) => {

    //*Como reviso el JWT x-token header
    const token = req.header('x-token');
    
    if( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'Error - Not found token.',
        });
    }
    
    try {
        //* Verifica que el token este creado tal cual fue en el inicio
        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        )
        
        //* Vuelvo a setear el body para tener los datos nuevos
        req.uid = uid;
        req.name = name;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Error - Invalid token.',
        });
    }
    
    next();
}

module.exports = { validateJWT }