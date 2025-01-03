import jwt from 'jsonwebtoken';
import 'dotenv/config'; 

export const generateToken = (data, time = null) => {
    try {
      if (!process.env.SECRET_KEY) {
        return {
          status: 0,
          error: "SECRET_KEY is not defined in environment variables",
        };
      }
  
      if (!data || Object.keys(data).length === 0) {
        return {
          status: 0,
          error: "Invalid data passed for token generation",
        };
      }
  
      const token = time
        ? jwt.sign(data, process.env.SECRET_KEY, { expiresIn: time })
        : jwt.sign(data, process.env.SECRET_KEY);
  
      return {
        status: 1,
        token,
      };
    } catch (error) {
      return {
        status: 0,
        error: error.message,
      };
    }
  };
  