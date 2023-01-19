const express = require("express");
const router = express.Router();
const ApiUserController = require("../../controllers/api/ApiUserController");

router.get('/', ApiUserController.apiGetUsers);
router.post('/', ApiUserController.apiCreateUser);
router.put('/:userId', ApiUserController.apiUpdateUser);
router.delete('/:userId', ApiUserController.apiDeleteUser);

module.exports = router;
