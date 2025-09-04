import jwt from "jsonwebtoken";

const authorize = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    console.log("Token:",token); // Debugging line
    try {
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debugging line
        req.userId = decoded.userId;
        return next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
export { authorize };