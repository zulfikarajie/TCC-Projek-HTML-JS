import express from "express";
import { getAdmin,createAdmin, updateAdmin,deleteAdmin,getAdminById,login,logout } from "../controller/AdminController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { getAccessTokenAdmin } from "../controller/TokenAdmin.js";

const router = express.Router()
//untuk ambil refresh token
router.get("/tokenadmin", getAccessTokenAdmin)

//untuk login logout
router.post("/loginadmin",login)
router.delete("/logoutadmin",logout)

//crud user
router.get("/admin",verifyToken,getAdmin)
router.get("/admin/:id",verifyToken,getAdminById)
router.post("/admin",createAdmin)
router.patch("/admin/:id",verifyToken,updateAdmin)
router.delete("/admin/:id",verifyToken,deleteAdmin)

export default router
