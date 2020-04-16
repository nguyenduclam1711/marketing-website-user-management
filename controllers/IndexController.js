const Story = require('../models/story')
const Contact = require('../models/contact')
const Course = require('../models/course')
const Event = require('../models/event')
const Location = require('../models/location')
const Partner = require('../models/partner')
const Employee = require('../models/employee')
const request = require('request')
const {sendMail, getAsyncRedis} = require('../helpers/helper')
const {getAvailableTranslations} = require('./AbstractController')
const fetchEventsByLocation = require("../helpers/fetch_events_by_location");
let redisClient = null;

module.exports.landingpage = async (req, res) => {

  let indexData = null
  try {
    if (process.env.USE_REDIS !== undefined && process.env.USE_REDIS === 'true') {
      // console.log('Redis enabled')
      redisClient = getAsyncRedis()
    } else if (process.env.USE_REDIS === 'false') {
      // console.log('Redis disabled')
    } else {
      console.error('USE_REDIS is not defined in .env')
      process.exit()
    }
    if (process.env.USE_REDIS === 'true') {
      try {
        const getNavData = await redisClient.getAsync(`indexData${req.session.locale}`)
        indexData = JSON.parse(getNavData)

      } catch (error) {
        console.error('Redis ERROR: Could not get IndexController data: ' + error)
      }
    }
    if (indexData === null) {
      let query = await getAvailableTranslations(req, res)
      const companyStoriesQuery = {...query, isCompanyStory: true}
      const nonCompanyStoriesQuery = {...query, isCompanyStory: {$ne: true}}

      const companyStories = Story
        .find(companyStoriesQuery)
        .sort('order')
        .exec({})
      const contact_userRes = Employee
        .findOne({...query, contact_user: true})
        .exec()
      const nonCompanyStories = Story
        .find(nonCompanyStoriesQuery)
        .sort('order')
        .limit(6)
        .exec()
      const locations = Location.find({})
      const partners = Partner.find({})
        .sort('order')
        .exec({})
      const courses = Course
        .find(query)
        .sort({order: 1})
        .exec()
      indexData = await Promise.all([nonCompanyStories, companyStories, locations, partners, courses, contact_userRes])
      const events = await fetchEventsByLocation(true);
      // for await (let loc of indexData[2]) {
      //   if (!events) {
      //     events[
      //       // await Event.find({location: loc._id, start: {$gt: new Date()}})
      //       await Event.find({start: {$gt: new Date()}})
      //         .limit(9)
      //         .sort({start: 1})
      //         .populate("location")
      //       ];
      //   } else {
      //     // const event = await Event.find({ location: loc._id, start: {$gt: new Date()}
      //     const event = await Event.find({ start: {$gt: new Date()}
      //     })
      //       .sort({start: 1})
      //       .limit(9)
      //       .populate("location")
      //     if (event) {
      //       events.push(...event)
      //     }
      //   }
      // }
      indexData.push(events)
      if (process.env.USE_REDIS === 'true') {
        try {
          await redisClient.setAsync(`indexData${req.session.locale}`, JSON.stringify(indexData))
        } catch (error) {
          console.error('Redis ERROR: Could not save IndexController data: ' + error)
        }
      }
    }
    const [nonComanyStoriesRes, companyStoriesRes, locationsRes, partnersRes, coursesRes, contact_user, events] = indexData;

    res.render('index', {
      events,
      companyStories: companyStoriesRes.length !== 0 ? companyStoriesRes : nonComanyStoriesRes.splice(nonComanyStoriesRes.length, nonComanyStoriesRes.length + 3),
      nonComanyStories: nonComanyStoriesRes.splice(0, 3),
      partners: partnersRes,
      locations: locationsRes,
      contact_user,
      courses: coursesRes
    })
  } catch (err) {
    console.log(err)
  }
}
module.exports.contactLocations = async (req, res) => {
  const locations = await Location.find({})
  const contact = req.body
  res.render('contactLocations', {
    locations,
    contact
  })
};
module.exports.contact = async (req, res, next) => {
  try {
    const {name, email, body, phone, locations, TermsofService} = req.body

    if (req.body.age) {
      console.log('Bot stepped into honeypot!')
      req.flash(
        'success',
        'Thanks for your message. We will reply to you as soon as possible.'
      )
      res.redirect(req.headers.referer)
      next()
      return;
    }
    if (!email || !name || !body || !phone || !TermsofService) {
      req.flash('danger', 'Please fill out all form fields')
      res.redirect(req.headers.referer)
      next()
      return;
    }
    const contact = new Contact()
    const track = req.body.track || 'https://digitalcareerinstitute.org';
    contact.name = req.body.name
    contact.email = req.body.email
    contact.phone = req.body.phone.replace(/[a-z]/g, '')
    contact.track = track
    contact.body = req.body.body
    if (req.session.utmParams) {
      contact.utm_source = req.session.utmParams.utm_source
      contact.utm_medium = req.session.utmParams.utm_medium
      contact.utm_campaign = req.session.utmParams.utm_campaign
      contact.utm_content = req.session.utmParams.utm_content
      contact.utm_term = req.session.utmParams.utm_term
    }
    contact.createdAt = new Date()
    contact.isCompany = !!req.body.companytour
    contact.locations = req.body.locations
    if (!contact.email) {
      res.redirect(req.headers.referer)
    }
    const location = await Location.findById(req.body.locations)

    const mailTemplate = `Contact from: <table>
    <tr>
      <td>Message send from: </td>
      <a href=${track}>${track}</a>
   </tr>
    <tr>
      <td>Name: </td>
      <td>${req.body.name}</td>
    </tr>
    <tr>
      <td>Phone: </td>
      <td>${req.body.phone}</td>
    </tr>
    <tr>
      <td>Email: </td>
      <td>${req.body.email}</td>
    </tr>
    <tr>
      <td>Content: </td>
      <td>${req.body.body}</td>
    </tr>
    ${req.body.locations && `<tr> <td>Locations: </td> <td>${location.name}</td> </tr>`}
    </table>
  `
    await contact.save()
    delete req.session.utmParams
    const mailOptions = {
      from: 'contact@digitalcareerinstitute.org',
      to: req.body.companytour
        ? process.env.TOURMAILRECEIVER
        : process.env.MAILRECEIVER,
      subject: req.body.companytour
        ? 'Company Tour request from website'
        : 'Message on website',
      text: mailTemplate,
      html: mailTemplate
    }
    let hubspotPromise = new Promise(()=>{})
    if (!!process.env.HUBSPOT_API_KEY) {
      var options = {
        method: 'POST',
        url: 'https://api.hubapi.com/contacts/v1/contact/',
        qs: {hapikey: process.env.HUBSPOT_API_KEY},
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          properties:
            [
              {property: 'firstname', value: req.body.name.split(' ')[0]},
              {property: 'lastname', value: req.body.name.split(' ').slice(1).join(' ')},
              {property: 'email', value: req.body.email},
              {property: 'phone', value: req.body.phone},
              {
                property: 'form_payload',
                value: JSON.stringify({
                  'track': req.body.track,
                  'locations': req.body.locations,
                  'body': req.body.body,
                  'is_company': req.body.isCompany,
                  'utm_source': req.session.utmParams ? req.session.utmParams.utm_source : "",
                  'utm_medium': req.session.utmParams ? req.session.utmParams.utm_medium : "",
                  'utm_campaign': req.session.utmParams ? req.session.utmParams.utm_campaign : "",
                  'utm_content': req.session.utmParams ? req.session.utmParams.utm_content : "",
                  'utm_term': req.session.utmParams ? req.session.utmParams.utm_term : "",
                })
              }
            ],
        },
        json: true
      };
      hubspotPromise = request(options)
    }

    const info = sendMail(res, req, mailOptions)
    const resolved = await Promise.all([info, hubspotPromise])
    req.flash(
      'success',
      'Thanks for your message. We will reply to you as soon as possible.'
    );
    console.log('Message sent: %s', info.messageId)
    res.redirect(req.headers.referer.replace('/contact', ''))
    next()
  } catch (e) {
    console.error(`Error in /controllers/IndexController.js`)
    console.error(e)

    req.flash('danger', JSON.stringify(e));
    next()
  }
}
module.exports.tour = async (req, res) => {
  try {
    res.render('tour', {companytour: true})
  } catch (err) {
    console.log(err)
  }
}
module.exports.newsletter = (req, res) => {
  const {email} = req.body

  // Make sure fields are filled
  if (!email) {
    return res.status(422).json({
      code: 422,
      message: 'No valid email address given!'
    })
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: 'pending'
        // merge_fields: {}
      }
    ]
  }

  try {
    const postData = JSON.stringify(data)

    const options = {
      url: process.env.URL,
      method: 'POST',
      headers: {
        Authorization: process.env.AUTHORIZATION
      },
      body: postData
    }

    request(options, (err, response) => {
      if (err) {
        return res.json({
          code: response.statusCode,
          message: err.message
        })
      } else {
        const json = JSON.parse(response.body)
        if (response.statusCode === 200 && json.errors.length === 0) {
          return res.status(200).json({
            code: 200,
            message: 'Successfully subscribed to the newsletter!'
          })
        } else {
          return res.status(422).json({
            code: json.errors ? 422 : response.statusCode,
            message: json.errors
          })
        }
      }
    })
  } catch (err) {
    console.log(
      `A error occured in the newsletter subscription route \n\n ${err}`
    )
  }
}
