const express = require('express')
const router = express.Router()

const EventsController = require('../../controllers/admin/AdminEventsController');
const { ensureAuthenticated, redirectNonAdmin } = require("../../helpers/passport");

router.get('/', ensureAuthenticated, redirectNonAdmin, EventsController.getEvents)
router.get('/fetchevents', ensureAuthenticated, redirectNonAdmin, EventsController.fetchevents);
router.get('/deleteevents', ensureAuthenticated, redirectNonAdmin, EventsController.deleteevents);
router.get('/:location', ensureAuthenticated, redirectNonAdmin, EventsController.getEventsByLocation)

module.exports = router
