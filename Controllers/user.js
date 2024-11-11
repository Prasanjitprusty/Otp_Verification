import twilio from "twilio";
import otpGenerator from "otp-generator";
import userModel from "../models/user.js";
import dotenv from "dotenv";
import otpVerification from "../helpers/otpValidate.js";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = new twilio(accountSid, authToken);

class userController {
  static sendOtp = async (req, resp) => {
    try {
      const { phoneNumber } = req.body;
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      const cDate = new Date();
      const expirationTime = new Date(cDate.getTime() + 5 * 60 * 1000); // 5 minutes from now

      // Save OTP and expiration in DB
      await userModel.findOneAndUpdate(
        { phoneNumber },
        {
          otp,
          otpExpiration: expirationTime,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      // Send OTP using Twilio
      await twilioClient.messages.create({
        body: `Your OTP is ${otp}`,
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
      });

      return resp.status(200).json({
        success: true,
        msg: "OTP Sent Successfully",
      });
    } catch (error) {
      return resp.status(400).json({
        success: false,
        msg: error.message,
      });
    }
  };

  static verifyOtp = async (req, resp) => {
    try {
      const { phoneNumber, otp } = req.body;
      const otpData = await userModel.findOne({
        phoneNumber,
        otp,
      });

      if (!otpData) {
        return resp.status(400).json({
          success: false,
          msg: "You entered wrong OTP!!",
        });
      }

      // Wait for the OTP verification
      const isOtpExpired = await otpVerification(otpData.otpExpiration.getTime());
      if (isOtpExpired) {
        return resp.status(400).json({
          success: false,
          msg: 'Your OTP has expired',
        });
      }else{
        return resp.status(200).json({
          success: true,
          msg: 'OTP Verification Successful!!',
        });
      }

    

    } catch (error) {
      return resp.status(400).json({
        success: false,
        msg: error.message,
      });
    }
  };
}

export default userController;
