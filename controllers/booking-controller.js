import Booking from "../models/booking-model.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();
    return res.status(201).json({
      success: true,
      message: "Successfully Booked the Service",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings (admin or worker/customer dashboard)
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get booking by ID
export const getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.params.id; // get ID from frontend
    console.log("Fetching bookings for customer:", customerId);

    const bookings = await Booking.find({ customer_id: customerId });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ success: false, message: "No bookings found" });
    }

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getWorkerBookings = async (req, res) => {
  try {
    const workerId = req.params.id; 
    console.log("Fetching bookings for worker:", workerId);

    const bookings = await Booking.find({ worker_id: workerId });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking (worker accept/reject, customer cancel, etc.)
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.status(200).json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
