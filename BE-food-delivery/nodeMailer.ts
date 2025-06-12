import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "tse9406@gmail.com", 
    pass: "ewrldvnweccdvrxj", 
  },
});
