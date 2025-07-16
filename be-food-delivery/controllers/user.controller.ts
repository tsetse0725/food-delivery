
import { Request, Response } from "express";
import { UserModel } from "../models/User.model";

export const updateUserAddress = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { address } = req.body;

  if (!address || !address.trim()) {
    return res.status(400).json({ message: "Address is required" });
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { address },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Address updated successfully",
      address: updatedUser.address,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
