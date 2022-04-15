const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();
const guestMiddleware = require('../middlewares/guestMiddleware.js');
const authMiddleware = require('../middlewares/authMiddleware.js')
const adminMiddleware = require('../middlewares/adminMiddleware.js')
const avatarProfile = require('../middlewares/imageRegister.js');
const validacionesEdit = require('../middlewares/validationsEditUser.js');
const validacionesRegister = require('../middlewares/validationsRegister.js');

router.get('/registerUser', authMiddleware, adminController.viewRegisterUser);
router.post('/registerUser',avatarProfile.single('avatar'),validacionesRegister, adminController.registerUser);

router.get("/editUser/:id", authMiddleware, adminController.editVistaUser)
router.put("/editUser/:id", avatarProfile.single('avatar'), validacionesEdit, adminController.editUserAdmin)

router.get("/users", authMiddleware, adminMiddleware, adminController.listarUsuarios);
router.delete("/users/delete/:id", adminController.eliminarUsuario);

module.exports = router;