import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, CreditCard, CheckCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { createBooking } from '../../api/bookings';

const BookingModal = ({ venue, onClose }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    duration: 1,
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const handleBooking = async () => {
    try {
      const totalAmount = venue.price * bookingData.duration;
      const booking = await createBooking({
        venue: venue.id,
        date: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        totalAmount,
      });
      setBookingId(booking.id);
      setBookingSuccess(true);
      setStep(4);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  const steps = [
    { number: 1, title: 'Date & Time', icon: Calendar },
    { number: 2, title: 'Confirm', icon: Clock },
    { number: 3, title: 'Payment', icon: CreditCard },
    { number: 4, title: 'Success', icon: CheckCircle },
  ];

  const totalAmount = venue.price * (bookingData.duration || 1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10"
        >
          {/* Header */}
          <div className="sticky top-0 glass border-b border-neutral/20 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-heading font-bold gradient-text">
              Book {venue.name}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral hover:text-primary transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="p-6 border-b border-neutral/20">
            <div className="flex items-center justify-between">
              {steps.map((stepItem, index) => (
                <React.Fragment key={stepItem.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                        step >= stepItem.number
                          ? 'bg-gradient-primary text-secondary'
                          : 'glass text-neutral'
                      }`}
                    >
                      {step > stepItem.number ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <stepItem.icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className="text-xs mt-2 text-neutral">{stepItem.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        step > stepItem.number
                          ? 'bg-gradient-primary'
                          : 'bg-neutral/20'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Date & Time */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold text-neutral mb-2">Select Date</label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, date: e.target.value })
                    }
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-secondary/50 border border-neutral/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral mb-2">Start Time</label>
                    <input
                      type="time"
                      value={bookingData.startTime}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, startTime: e.target.value })
                      }
                      className="w-full bg-secondary/50 border border-neutral/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral mb-2">End Time</label>
                    <input
                      type="time"
                      value={bookingData.endTime}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, endTime: e.target.value })
                      }
                      className="w-full bg-secondary/50 border border-neutral/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    min="1"
                    value={bookingData.duration}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, duration: parseInt(e.target.value) })
                    }
                    className="w-full bg-secondary/50 border border-neutral/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!bookingData.date || !bookingData.startTime || !bookingData.endTime}
                  className="btn-glow w-full bg-gradient-primary text-secondary py-3 rounded-xl font-bold hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </motion.div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="glass rounded-xl p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral">Venue</span>
                    <span className="font-bold text-white">{venue.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral">Date</span>
                    <span className="font-bold text-white">{bookingData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral">Time</span>
                    <span className="font-bold text-white">
                      {bookingData.startTime} - {bookingData.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral">Duration</span>
                    <span className="font-bold text-white">{bookingData.duration} hour(s)</span>
                  </div>
                  <div className="border-t border-neutral/20 pt-4 flex justify-between">
                    <span className="text-lg font-bold text-white">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 glass border border-neutral/20 text-neutral py-3 rounded-xl font-bold hover:border-primary hover:text-primary transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 btn-glow bg-gradient-primary text-secondary py-3 rounded-xl font-bold hover:shadow-glow"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="glass rounded-xl p-6">
                  <h3 className="text-xl font-heading font-bold mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    {['Razorpay', 'UPI', 'Card'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`w-full glass border-2 rounded-xl p-4 text-left transition ${
                          paymentMethod === method
                            ? 'border-primary shadow-glow'
                            : 'border-neutral/20 hover:border-primary/50'
                        }`}
                      >
                        <span className="font-bold text-white">{method}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 glass border border-neutral/20 text-neutral py-3 rounded-xl font-bold hover:border-primary hover:text-primary transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={!paymentMethod}
                    className="flex-1 btn-glow bg-gradient-primary text-secondary py-3 rounded-xl font-bold hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Pay ₹{totalAmount}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && bookingSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <Confetti width={window.innerWidth} height={window.innerHeight} />
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-secondary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-heading font-bold gradient-text mb-2">
                    Booking Confirmed!
                  </h3>
                  <p className="text-neutral">Your booking ID: {bookingId}</p>
                </div>
                <div className="glass rounded-xl p-6 flex justify-center">
                  <QRCodeSVG value={`BOOKING-${bookingId}`} size={200} />
                </div>
                <p className="text-neutral">Show this QR code at the venue</p>
                <button
                  onClick={onClose}
                  className="btn-glow w-full bg-gradient-primary text-secondary py-3 rounded-xl font-bold hover:shadow-glow"
                >
                  Done
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;

