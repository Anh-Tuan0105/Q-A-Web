import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 1, // 1MB
    },
});


export const uploadImageFromBuffer = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: "Qa_web/avatars",
            resource_type: "image",
            transformation: [
                {
                    width: 250,
                    height: 250,
                    crop: "fill",
                },
            ],
            ...options,
        },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        uploadStream.end(buffer);
    });
}