import jwt from "jsonwebtoken";
let decodeJwt;
export default decodeJwt = (req)=>{
    const token = req.headers["x-access-token"];
    return jwt.decode(token);    
}