const Location = require("../models/location");
const Event = require("../models/event");
module.exports = async () => {
  const locations = await Location.find({});
  let eventsByLocation = [];

  for await (let loc of locations) {
    eventsByLocation.push({
      name: loc.name,
      events: await Event.find({ location: loc._id })
        .populate("location")
        .sort({ start: -1 })
        .limit(3)
    });
  }
  return eventsByLocation;
};
