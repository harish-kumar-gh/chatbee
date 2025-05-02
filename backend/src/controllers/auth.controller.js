import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!fullName || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 characters" });
    }

    // check whether email is in correct format or not e.g john@ which is not valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({
          message: "Email already exists please provide a different Email",
        });
    }

    const idx = Math.floor(Math.random() * 100) + 1; // generates a num b/w 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    // create/upsert stream user

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic,
      });
      console.log(`Stream user created successfully for the user ${newUser.fullName}`)
    } catch (error) {
        console.log("Error while creating Stream User", error);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d in milliseconds
      httpOnly: true, //prevents XSS attacks
      sameSite: "strict", //prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", // only be secure when we are in production
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    // console.log("Signup error:", error);

    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d in milliseconds
      httpOnly: true, //prevents XSS attacks
      sameSite: "strict", //prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", // only be secure when we are in production
    });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in login Controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout succsesfully" });
}

export async function onboard(req, res) {
    console.log(req.user)
    try {
        const userId = req.user._id

        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
              message: "All fields are required",
              missingFields: [
                !fullName && "fullName",
                !bio && "bio",  
                !nativeLanguage && "nativeLanguage",  
                !learningLanguage && "learningLanguage",
                !location && "location"
              ].filter(Boolean),
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            fullName,
            bio,
            nativeLanguage,
            learningLanguage,
            location,
          isOnboarded: true,
        }, {new: true})

        if(!updatedUser) {
            return res.status(404).json({message: "User not found"})
        }

        // upsert stream user
        try {
          await upsertStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullName,
            image: updatedUser.profilePic || "",
          });
          console.log(`Stream user updated successfully for the user ${updatedUser.fullName}`);
          
        } catch (error) {
          console.log(`Error while updating Stream User`, error.message);
          
        }

        res.status(200).json({
            success: true,
            message: "User onboarded successfully",
            user: updatedUser
        })
    } catch (error) {
        return res.status(500).json({message: "Internal server error while onboardng the user", error: error.message})
    }
}