import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";


/**
 * GENERATE JWT TOKEN  
*/
const generateToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });
};

/** REGISTER USER */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { fullName, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const newUser = await User.create({ fullName, email, password });

        if (newUser) {
            res.status(201).json({
                _id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email,
                token: generateToken(newUser.id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};



/**
 * USER LOGIN
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            await user.updateStreak();
            res.status(200).json({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                token: generateToken(user.id),
            });
            console.log("Login")
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
};


export const userStreak = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.userId);
        // console.log(user);
        res.json({ streak: user?.streak || 0 });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
};