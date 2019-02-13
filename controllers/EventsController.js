require('dotenv').config({ path: __dirname + '/../.env' });
const request = require("request");
const Event = require('../models/event');
const Location = require('../models/location');

module.exports.getEvents = async (req, res) => {
  const locations = await Location.find({});
  let eventsByLocation = [];
  for await (let loc of locations) {
    eventsByLocation.push({
      name: loc.name,
      events: await Event.find({ location: loc._id }).populate('location').sort({ 'start': -1 }).limit(3)
    })
  }
  res.render('events', {
    eventsByLocation
  })
}

module.exports.getEventsByLocation = async (req, res) => {
  let location = await Location.findOne({ "name": { $regex: new RegExp(req.params.location, "i") } })

  let events = await Event.find({ location: location._id })

  res.render('eventsByLocation', {
    events,
    location
  })
}

