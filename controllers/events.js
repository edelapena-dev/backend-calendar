const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Event = require('../models/Event');

const createEvent = async(req, res = response) => {
    
    try {
        const event = new Event( req.body );
        event.user = req.uid;

        const eventSave = await event.save();

        res.json({
            ok: true,
            event: eventSave
        });    


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error - Create event'
        });
    }    
} 

const getEvents = async(req, res = response) => {
    try {
        const event = await Event.find()
                                 .populate('user', 'name');
        
        res.json({
            ok: true,
            event
        });
        
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error - Get events.'
        });    
    }
} 

const updateEvent= async(req, res = response) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById( eventId );
        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'Error - Event not found.'
            });    
        }
        if( event.user.toString() !== req.uid){
            return res.status(401).json({
                ok: false,
                msg: 'Error - You don´t privilege for update.'
            });    
        }
        const eventUpdate = { 
            ...req.body,
            user: req.uid
        };

        //* Este metodo siempre retorna los valores anterior al cambio para revisar, pero si se agrega un tercer argumento se peude obtener los ultimos datos
        const eventSave = await Event.findByIdAndUpdate( eventId, eventUpdate, { new: true } );


        res.json({
            ok: true,
            event: eventSave
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error - Update event.'
        });    
    }
} 

const deleteEvent = async(req, res = response) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById( eventId );
        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'Error - Event not found.'
            });    
        }
        if( event.user.toString() !== req.uid){
            return res.status(401).json({
                ok: false,
                msg: 'Error - You don´t privilege for delete.'
            });    
        }
        
        //await Event.deleteOne({ id: eventId });
        await Event.findByIdAndDelete( eventId );

        res.json({ ok: true });

    } catch (error) {
        console.log(error)
        res.json({
            ok: false,
            msg: 'Error - Delete event.'
        });    
    }
    
} 

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}