require("dotenv").config({ path: __dirname + "/../.env" });
const request = require("request");
const Event = require("../../models/event");
const Location = require("../../models/location");
const fetchEventsByLocation = require("../../helpers/fetch_events_by_location");

// to catch the error if 'EVENTBRIDE_API_KEY' path not exist in .env file
if (!process.env.EVENTBRIDE_API_KEY) {
  console.log("EVENTBRIDE_API_KEY MISSING");
  // process.exit();
}

module.exports.getEvents = async (req, res) => {
  const eventsByLocation = await fetchEventsByLocation(false, 0)

  res.render("admin/events", {
    eventsByLocation
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
  if (!process.env.EVENTBRIDE_API_KEY) return [];
  const url = `https://www.eventbriteapi.com/v3/organizers/16608751086/events/?order_by=start_asc&expand=venue&start_date.range_start=${new Date().toISOString().substr(0, 19)}&token=${process.env.EVENTBRIDE_API_KEY}`;
  try {
    return new Promise(function (resolve, reject) {
      request(url, async (error, response, body) => {
        body = JSON.parse(body);
        if (body.error) {
          console.log("error:", body);
        }

        for await (let event of body.events) {
          try {
            const existingEvent = await Event.findOne({
              eventbride_id: event.id
            });
            let location = undefined
            if (event.venue) {
              location = await Location.findOne({
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
            }
            let locationId = location ? location._id : null
            if (!existingEvent) {
              const newevent = new Event({
                eventbride_id: event.id,
                location: locationId,
                name: event.name.text,
                text: event.description.text,
                start: event.start.local,
                url: event.url,
                imageurl: !!event.logo ? event.logo.url : "/media/bg1.jpg"
              });
              await newevent.save();
            }
          } catch (err) {
            console.log(err);
            reject("Events cronjob dont fetched");
            res.redirect("/admin/events?alert=created");
          }
        }
        resolve("Events cronjob fetched");
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
