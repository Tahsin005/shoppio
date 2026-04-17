import { Router } from "express";
import { getCustomerCategories, getCustomerProduct, getCustomerProducts } from "../../controllers/customer/product.controllers.js";

export const customerProductRouter = Router();

customerProductRouter.get("/categories", getCustomerCategories);
customerProductRouter.get("/products", getCustomerProducts);
customerProductRouter.get("/products/:id", getCustomerProduct);