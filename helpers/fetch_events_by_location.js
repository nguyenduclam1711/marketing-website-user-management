const Location = require("../models/location");
const Event = require("../models/event");
module.exports = async (justFuture = false, limit = 9) => {
  // const locations = await Location.find({});
  // let eventsByLocation = [];

  // for await (let loc of locations) {
  //   const query = justFuture ? { location: loc._id, start: { $gt: new Date() } } : { location: loc._id }
  //   eventsByLocation.push({
  //     name: loc.name,
  //     events: await Event.find(query)
  //       .populate("location")
  //       .sort({ start: 1 })
  //       .limit(limit)
  //   });
  // }

  const query = justFuture ? {start: {$gt: new Date()}} : {}
  return Event.find(query)
    .populate("location")
    .sort({start: 1})
    .limit(limit)
};
