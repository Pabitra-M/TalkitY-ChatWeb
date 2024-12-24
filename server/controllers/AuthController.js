import { request, response } from "express";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import { renameSync, unlinkSync, existsSync } from "fs"

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
};


export const signup = async (req, response, next) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return response.status(400).send("Email and password is required");
        }

        const user = await User.create({ email, password });
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });

        return response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            }
        })
    } catch (error) {
        console.log(error);
        return response.status(500).send("Enternal server error!!");

    }
}


export const login = async (req, response, next) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return response.status(400).send("Email and password is required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return response.status(404).send("User with the given email not found")
        }
        const auth = await compare(password, user.password)
        if (!auth) {
            return response.status(400).send("password is incorrect")
        }

        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });

        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }
        })
    } catch (error) {
        console.log(error);
        return response.status(500).send("Enternal server error!!");

    }
}

export const getUserInfo = async (req, response, next) => {
    try {


        const user = await User.findById(req.userId);
        if (!user) {
            return response.status(404).send("User not found");
        }
        return response.status(200).json({


            id: user.id,
            email: user.email,
            profileSetup: user.profileSetup,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image,
            color: user.color,

        })
    } catch (error) {
        console.log(error);
        return response.status(500).send("Enternal server error!!");

    }
}

export const updateProfile = async (req, response, next) => {
    try {
        const { userId } = req;
        const { firstName, lastName, color } = req.body;
        if (!firstName || !lastName) {
            return response.status(400).send("All fields are required");
        }
        const user = await User.findByIdAndUpdate(userId, { firstName, lastName, color, profileSetup: true }, { new: true, runValidators: true });

        return response.status(200).json({


            id: user.id,
            email: user.email,
            profileSetup: user.profileSetup,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image,
            color: user.color,

        })





    } catch (error) {
        return response.status(500).send("Enternal server error!!");
    }

}

export const addProfileImage = async (req, response, next) => {
    try {
        if (!req.file) {
            return response.status(400).send("Profile image is required");
        }

        const date = new Date();
        let filename = "uploads/profile/" + date.getTime() + req.file.originalname;

        // Check if the source file exists
        if (!existsSync(req.file.path)) {
            return response.status(404).send("Uploaded file not found");
        }

        // Rename the file
        renameSync(req.file.path, filename);

        // Update the user's profile image in the database
        const user = await User.findByIdAndUpdate(
            req.userId,
            { image: filename, profileSetup: true },
            { new: true, runValidators: true }
        );

        return response.status(200).json({
            image: user.image,
        });





    } catch (error) {
        console.log(error);

        return response.status(500).send("Enternal server error!!");
    }
}

export const deleteProfileImage = async (req, response, next) => {
    try {
        const { userId } = req;

        const user = await User.findById(userId);
        if (!user) {
            return response.status(404).send("User not found");
        }
        if (user.image) {
            unlinkSync(user.image);
        }
        user.image = null;
        await user.save();



        return response.status(200).send("Profile image deleted successfully");




    } catch (error) {
        return response.status(500).send("Enternal server error!!");
    }
}


export const logout = async (req, response, next) => {
    try {
        response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
        return response.status(200).send("Logout successfully");
    } catch (error) {
        return response.status(500).send("Enternal server error!!");
    }
}