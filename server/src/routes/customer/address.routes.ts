import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { addAddress, deleteAddress, getAddress, updateAddress } from "../../controllers/customer/address.controllers.js";

export const customerAddressRouter = Router();

customerAddressRouter.use(requireAuth);
customerAddressRouter.get("/addresses", getAddress);
customerAddressRouter.post("/addresses", addAddress);
customerAddressRouter.patch("/addresses/:addressId", updateAddress);
customerAddressRouter.delete("/addresses/:addressId", deleteAddress);