import express from "express";
import { getUsers,createUser, updateUser,deleteUser,getUsersById,login,logout } from "../controller/UserController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { getAccessToken } from "../controller/TokenController.js";

const router = express.Router()
//untuk ambil refresh token
router.get("/token", getAccessToken)

//untuk login logout
router.post("/loginuser",login)
router.delete("/logoutuser",logout)

//crud user
router.get("/user",verifyToken,getUsers)
router.get("/user/:id",verifyToken,getUsersById)
router.post("/user",createUser)
router.patch("/user/:id",verifyToken,updateUser)
router.delete("/user/:id",verifyToken,deleteUser)

export default router
