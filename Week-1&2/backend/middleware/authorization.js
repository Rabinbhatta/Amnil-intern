import jwt from "jsonwebtoken";

const authorizeUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    console.log("Token:",token);
    try {
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.userType !== 'user'){
            return res.status(403).json({ error: "Forbidden: Access is denied" });
        }
        req.userId = decoded.userId;
        return next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

const authorizeAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.userType !== 'admin'){
            return res.status(403).json({ error: "Forbidden: Access is denied" });
        }
        req.userId = decoded.userId;
        return next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
export { authorizeUser };