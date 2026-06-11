import multer from "multer";

export const speechToTextMiddleware = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ success: false, message: "Payload too large. Max limit is 0.5MB." });
        }
        return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
        return res.status(400).json({ success: false, message: "An error occurred during file upload" });
    }
    next();

}
