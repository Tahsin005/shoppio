import { getDbUserFromReq } from "../../middleware/auth.js";
import { Banner, BannerDocument } from "../../models/Banner.js";
import { AppError } from "../../utils/AppError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadManyBuffersToCloudinary } from "../../utils/cloudinary.js";
import { ok } from "../../utils/envelope.js";
import { type Request, type Response } from "express";

type AdminBannerItem = {
    _id: string;
    imageUrl: string;
    imagePublicId: string;
    createdAt: string;
};

function mapBanner(item: BannerDocument): AdminBannerItem {
    return {
        _id: String(item._id),
        imageUrl: item.imageUrl,
        imagePublicId: item.imagePublicId,
        createdAt: item.createdAt.toISOString(),
    };
}

const BANNER_FOLDER = "shoppio/banners";

export const getBanners = asyncHandler(async (_req: Request, res: Response) => {
    const items = await Banner.find().sort({ createdAt: -1 });

    res.json(
        ok({
            items: items.map(mapBanner),
        }),
    );
});

export const addBanner = asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const files = (req.files || []) as Express.Multer.File[];

    if (!files.length) {
        throw new AppError(400, "At least one image is required");
    }

    const uploadedImages = await uploadManyBuffersToCloudinary(
        files.map((file) => file.buffer),
        BANNER_FOLDER,
    );

    const createFinalBanners = await Banner.insertMany(
        uploadedImages.map((item) => ({
            imageUrl: item.url,
            imagePublicId: item.publicId,
            createdBy: dbUser._id,
        })),
    );

    res.json(
        ok({
            items: createFinalBanners.map(mapBanner),
        }),
    );
})