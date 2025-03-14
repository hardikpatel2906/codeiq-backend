import express from "express";
import { loginUser, registerUser, userStreak } from "../controllers/userController";

const route = express.Router();


route.post("/register", registerUser);
route.post("/login", loginUser);

route.get("/streak/:userId", userStreak);


export default route;