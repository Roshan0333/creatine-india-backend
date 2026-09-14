import bcrypt from "bcrypt";

const saltRound = 10;
 
export const encryptPassword = async(password) => {
    try{
        const encrypt = await bcrypt.hash(password, saltRound);

        return {
            status: true,
            password: encrypt
        }
    }
    catch(err){
        return {
            status: false,
            error: err.message
        }
    }
}

export const decryptPassword = async (password, hashPassword) => {
    try{
        const decryptPassword = await bcrypt.compare(password, hashPassword);

        return {
            status: true,
            result: decryptPassword
        }
    }
    catch(err){
        return {
            status: false,
            error: err.message
        }
    }
}