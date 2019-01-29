require("dotenv").config({ path: __dirname + "/../.env" });
const request = require("request");
const Event = require("../../models/event");
const Location = require("../../models/location");

// to catch the error if 'EVENTBRIDE_API_KEY' path not exist in .env file
if (!process.env.EVENTBRIDE_API_KEY) {
  console.error("EVENTBRIDE_API_KEY MISSING");
  process.exit();
}

module.exports.getEvents = async (req, res) => {
  let events = await Event.find().populate("location");

  locationEvents = events.reduce(function(acc, obj) {
    if (obj.location) {
      if (!acc[obj.location.name]) {
        acc[obj.location.name] = [];
      }
      acc[obj.location.name].push(obj);
      return acc;
    } else {
      return acc;
    }
  }, {});

  res.render("admin/events", {
    locationEvents
  });
};
module.exports.getEventsByLocation = async (req, res) => {
  let location = await Location.findOne({
    name: { $regex: new RegExp(req.params.location, "i") }
  });

  let events = await Event.find({ location: location._id });

  res.render("admin/eventslocation", {
    events
  });
};

module.exports.fetchevents = async (req, res) => {
  const url = `https://www.eventbriteapi.com/v3/organizers/16608751086/events/?order_by=start_desc&expand=venue&token=${
    process.env.EVENTBRIDE_API_KEY
  }`;
  try {
    return new Promise(function(resolve, reject) {
      request(url, async (error, response, body) => {
        body = JSON.parse(body);
        if (error) {
          console.log("error:", error);
        }
        //const events = await body.events.map(async event => {
        for await (let event of body.events) {
          try {
            const existingEvent = await Event.findOne({
              eventbride_id: event.id
            });
            if (!existingEvent) {
              let location = await Location.findOne({
                name: { $regex: new RegExp(event.venue.address.city, "i") }
              });
              if (!location) {
                location = new Location({
                  name: event.venue.address.city,
                  street: event.venue.address.address_1,
                  zip: event.venue.address.postal_code,
                  latitude: event.venue.address.latitude,
                  longitude: event.venue.address.longitude
                });
                location = await location.save();
              }
              let locationId = location._id ? location : null;

              const newevent = new Event({
                eventbride_id: event.id,
                location: location._id,
                name: event.name.text,
                text: event.description.text,
                start: event.start.local,
                url: event.url,
                imageurl: event.logo.original.url
              });
              await newevent.save();
            }
          } catch (err) {
            console.log(err);
            reject("dont worked");
            res.redirect("/admin/events?alert=created");
          }
        }
        resolve("worked");
        if (res) {
          res.redirect("/admin/events?alert=created");
        }
      });
    });
  } catch (err) {
    console.log(err);
    res.redirect("/admin/events?alert=created");
  }
};

module.exports.deleteevents = async (req, res) => {
  try {
    Event.collection.drop();
    res.redirect("/admin/events?alert=created");
  } catch (err) {
    console.log(err);
    res.redirect("/admin/events?alert=created");
  }
};
