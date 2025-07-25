import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../models/userModel";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const createUser = async (req: MulterRequest, res: Response) => {
  try {
    const { firstName, lastName, email, phone, role, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "אימייל זה כבר נמצא בשימוש" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let profileImageUrl;
    if (req.file) {
      profileImageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      role,
      passwordHash,
      profileImage: profileImageUrl,
    });

    res.status(201).json(newUser);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

export default createUser;
