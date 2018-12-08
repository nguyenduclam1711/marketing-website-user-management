const Contact = require("../../models/contact");

module.exports.getContacts = async function (req, res) {

  let contacts = await Contact.find({})
    .populate('locations')
    .sort("-createdAt")
    .exec();

  res.render("admin/contacts", {
    contacts,
  });
}
