// booking-routes.js
import express from "express";
import {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
  getCustomerBookings,
  getWorkerBookings,
} from "../controllers/booking-controller.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/customer/:id",  getCustomerBookings);

// Worker sees only their bookings
router.get("/worker/:id",  getWorkerBookings);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;
