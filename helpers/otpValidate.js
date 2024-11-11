const otpVerification = async (otpTime) => {
  try {
    const cDateTime = new Date();
    const differenceValue = (otpTime - cDateTime.getTime()) / 1000; // Convert to seconds
    const minutes = Math.abs(differenceValue / 60); // Convert to minutes

    console.log("Expired minutes: " + minutes);

    return minutes > 5; // Return true if OTP has expired
  } catch (error) {
    console.log("Error in otpVerification: ", error.message);
    return false; // Default to false on error
  }
};

export default otpVerification;
 