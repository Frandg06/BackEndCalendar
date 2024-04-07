const { response } = require("express");
const Event = require("../models/Event");


const getEvents = async(req, res = response) => {

  const events = await Event.find({user: req.uid}).populate('user','name email')
  try {

    res.status(200).json({
      ok: true,
      msg: events
    })

  }catch(error){
    res.status(500).json({
      ok: false,
      msg: error
    })
  }
}


const storeEvent = async(req, res = response) => {

  const event = new Event(req.body)

  try {

    event.user = req.uid;
    const savedEvent = await event.save()
    res.status(200).json({
      ok: true,
      savedEvent
    })

  }catch(error){
    res.status(500).json({
      ok: false,
      msg: error
    })
  }
}

const updateEvent = async(req, res = response) => {

  const eventId = req.params.id;
  

  try {
    const event = await Event.findById( eventId );

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "El evento no existe con ese id"
      })
    }

    if(event.user.toString() != req.uid) {
      return res.status(404).json({
        ok: false,
        msg: "No tiene provilegio de editar el evento"
      })
    }

    const newElemet = {
      ...req.body,
      user: req.uid
    }

    const updateEvent = await Event.findByIdAndUpdate(eventId, newElemet, { new: true });

    res.status(200).json({
      ok: true,
      msg: updateEvent
    })

  }catch(error){
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: error
    })
  }
}

const deleteEvent = async(req, res = response) => {
  const eventId = req.params.id;

  
  try {

    const event = await Event.findById( eventId );

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "El evento no existe con ese id"
      })
    }

    if(event.user.toString() != req.uid) {
      return res.status(404).json({
        ok: false,
        msg: "No tiene provilegio de editar el evento"
      })
    }

    await Event.findByIdAndDelete( eventId );

    res.status(200).json({
      ok: true,
      msg: "Elemento eliminado correctamente"
    })

  }catch(error){
    res.status(500).json({
      ok: false,
      msg: error
    })
  }
}


module.exports = {
  getEvents,
  storeEvent,
  updateEvent,
  deleteEvent
}