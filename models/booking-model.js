import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // Customer info
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    customer_phone: { type: String, required: true },
    customer_address: { type: String, required: true },
    customer_city: { type: String, required: true },
    customer_postal_code: { type: String, required: true },

    // Worker info
    worker_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    worker_name: { type: String, required: true },
    worker_skills: { type: [String], default: [] },
    worker_hour_rate: { type: Number, required: true },

    // Booking info
    booking_date: { type: Date, default: null },
    booking_time: { type: String, default: "" },
    booking_duration: { type: String, default: "" },
    booking_duration_hours: { type: Number, default: 0 },
    booking_description: { type: String, default: "" },
    booking_is_urgent: { type: Boolean, default: false },
    booking_status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },

    // Price breakdown
    price_service: { type: Number, default: 0 },
    price_service_fee: { type: Number, default: 0 },
    price_urgent_fee: { type: Number, default: 0 },
    price_total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
