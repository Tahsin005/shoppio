import { Router } from "express";
import multer from "multer";
import { requireAdmin } from "../../../middleware/auth.js";
import { addCategory, addProduct, getCategories, getProduct, getProducts, updateCategory, updateProduct } from "../../../controllers/admin/product.controllers.js";

export const adminProductRouter = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 5 * 1024 * 1024,
        files: 10,
    },
});

adminProductRouter.use(requireAdmin);

// categories
adminProductRouter.get("/categories", getCategories);
adminProductRouter.post("/categories", addCategory);
adminProductRouter.put("/categories/:id", updateCategory);

// products
adminProductRouter.get("/products", getProducts);
adminProductRouter.get("/products/:id", getProduct);
adminProductRouter.post("/products", upload.array("images", 10), addProduct);
adminProductRouter.put("/products/:id", upload.array("images", 10), updateProduct);