import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import environment from "../config/environment.js";

type CloudinaryUploadResult = {
    url: string;
    publicId: string;
};

const cloudinaryUrl = environment.cloudinaryUrl;

if (!cloudinaryUrl) {
    throw new Error("Cloudinary URL is missing in environment variables!");
}

cloudinary.config({
    cloudinary_url: cloudinaryUrl,
});

export function uploadSingleBufferToCloudinary(
    fileBuffer: Buffer,
    folder = "shoppio/products",
): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                timeout: 60000,
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                if (!result) {
                    return reject(new Error("Cloudinary upload failed!!!"));
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            },
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
}

export async function uploadManyBuffersToCloudinary(
    files: Buffer[],
    folder = "shoppio/products",
): Promise<CloudinaryUploadResult[]> {
    return Promise.all(
        files.map((file) => uploadSingleBufferToCloudinary(file, folder)),
    );
}