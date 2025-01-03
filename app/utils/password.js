import bcrypt from "bcryptjs";

// Generate hashed password
export const genPassword = async (pass) => {
    try {
        const saltRound = 14;
        const salt = bcrypt.genSaltSync(saltRound);
        const genPass = bcrypt.hashSync(pass, salt);
        return genPass;
    } catch (err) {
        console.log("Error in genPassword:", err);
        return false;
    }
}

// Compare plain password with hashed password
export const comparePass = async (plainPassword, hashPassword) => {
    try {
        console.log("Plain password:", plainPassword);  
        console.log("Hashed password from DB:", hashPassword);  
        const passwordMatch = await bcrypt.compare(plainPassword, hashPassword);
        return passwordMatch;
    } catch (err) {
        console.log("Error in comparePass:", err);
        return false;
    }
}
