//const express = require('express');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt')


const registerUser = async( req, res = response ) => {

    const { email, password } = req.body;

    try {
        
        let user = await User.findOne({ email });
        if( user ){
            return  res.status(400).json({
                ok: false,
                msg: 'Error - User email exists.'
            });
        }
        
        user = new User( req.body );

        //*Encriptar password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();
        //*Generar JWT
        const token = await generateJWT( user.id, user.name );
    
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        }); 

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error - User register.'
        }); 
    }    
}

const loginUser = async( req, res = response ) => {
    
    const { email, password } = req.body;

    try {
        
        const user = await User.findOne({ email });
        if( !user ){
            return  res.status(400).json({
                ok: false,
                msg: 'Error - User not found.'
            });
        }

        //*Confirmar el password password
        const validPassword = bcrypt.compareSync( password, user.password );
        
        if( !validPassword ){
            return  res.status(400).json({
                ok: false,
                msg: 'Error - User incorrect password.'
            });
        }

        //* Generar JWT
        const token = await generateJWT( user.id, user.name );

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });    

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error - Login User.'
        }); 
    }    
}

const renewTokenUser = async( req, res = response ) => {
    try {

        const { uid, name } = req;
        
        //*Generar un JWT
        const token = await generateJWT( uid, name );

        res.json({
            ok: true,
            uid, 
            name,
            token,
        });    

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error - Renew Token.'
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    renewTokenUser
}