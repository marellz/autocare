import VendorRequestService from "../services/vendor/vendorRequest.service";
import { Request, Response } from "express";
class VendorRequestController {
  static async findAll(req: Request, res: Response) {
    try {
      const { vendorId, requestId } = req.query;
      const vendorRequests = await VendorRequestService.findAll({
        vendorId,
        requestId,
      });
      res.status(200).json(vendorRequests);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching vendor requests", error });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vendorRequest = await VendorRequestService.findById(id);
      if (!vendorRequest) {
        return res.status(404).json({ message: "Vendor request not found" });
      }
      res.status(200).json(vendorRequest);
    } catch (error) {
      res.status(500).json({ message: "Error fetching vendor request", error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { vendorId, requestId } = req.body;
      // todo: make sure vendorId and RequestId are not null, and no such combination exists
      const newVendorRequest = await VendorRequestService.create({
        vendorId,
        requestId,
      });
      res.status(201).json(newVendorRequest);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating vendor requests", error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const vendorRequest = await VendorRequestService.findById(id);
      if (!vendorRequest) {
        return res.status(404).json({ message: "Vendor request not found" });
      }
      const { condition, price, notes } = req.body;
      await VendorRequestService.update(id, {
        condition,
        price,
        notes,
      });
      res.status(200).json({ message: "Vendor request updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating vendor request", error });
    }
  }
}

export default VendorRequestController;
