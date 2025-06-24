import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  FaCreditCard,
  FaRupeeSign,
  FaShieldAlt,
  FaLock,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { CiBank } from "react-icons/ci";
import { BsCheckCircleFill, BsCreditCard } from "react-icons/bs";
import { RiVisaLine, RiMastercardLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import RazorLogo from "../assets/razorpay.png";
import UPI from "../assets/UPI.svg";
import PhonePay from "../assets/phonepay.png";
import Paytm from "../assets/Paytm.png";
import GPAY from "../assets/GPAY.webp";

const Payment = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // State for order details
  const [amount, setAmount] = useState(0);
  const [testDetails, setTestDetails] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Payment form state
  const [activeTab, setActiveTab] = useState("card");
  const [showSavedCards, setShowSavedCards] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [showUpiApps, setShowUpiApps] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showBankList, setShowBankList] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Sample saved cards data
  const [savedCards] = useState([
    {
      id: 1,
      type: "VISA",
      last4: "4242",
      bank: "HDFC Bank",
      expiry: "12/25",
      default: true,
    },
    {
      id: 2,
      type: "MASTERCARD",
      last4: "5555",
      bank: "ICICI Bank",
      expiry: "06/24",
      default: false,
    },
  ]);

  const banks = [
    { id: 1, code: "HDFC", name: "HDFC Bank" },
    { id: 2, code: "ICICI", name: "ICICI Bank" },
    { id: 3, code: "SBI", name: "State Bank of India" },
    { id: 4, code: "AXIS", name: "Axis Bank" },
    { id: 5, code: "BOB", name: "Bank of Baroda" },
    { id: 6, code: "PNB", name: "Punjab National Bank" },
  ];

  const upiApps = [
    { id: 1, name: "Google Pay", icon: GPAY },
    { id: 2, name: "PhonePe", icon: PhonePay },
    { id: 3, name: "Paytm", icon: Paytm },
    { id: 4, name: "BHIM UPI", icon: UPI },
  ];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`
        );
        if (!response.ok) throw new Error("Failed to fetch order details");
        const data = await response.json();
        setAmount(data.test.totalCost);
        setTestDetails(data.test);
        setFormData({
          fullName: data.patient.fullName,
          email: data.patient.email,
          phone: data.patient.phone,
        });
      } catch (error) {
        toast.error(error.message);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (location.state) {
      setAmount(location.state.amount);
      setTestDetails(location.state.testDetails);
      setFormData(location.state.formData);
      setLoading(false);
    } else {
      fetchOrderDetails();
    }
  }, [orderId, location.state, navigate]);

  const handlePayment = async () => {
    if (
      (activeTab === "card" && (!cardNumber || !cardName || !expiry || !cvv)) ||
      (activeTab === "upi" && !upiId && !showUpiApps) ||
      (activeTab === "netbanking" && !selectedBank)
    ) {
      toast.error("Please fill all required payment details.");
      return;
    }

    setProcessingPayment(true);

    try {
      const paymentData = {
        paymentMethod: "online",
        paymentDetails: {
          ...(activeTab === "card" && {
            last4: cardNumber.slice(-4),
            cardName,
            expiry,
          }),
          ...(activeTab === "upi" && {
            upiId: showUpiApps ? "app_selected" : upiId,
          }),
          ...(activeTab === "netbanking" && {
            bank: selectedBank?.name,
            bankCode: selectedBank?.code,
          }),
        },
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/pay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment failed");
      }

      const result = await response.json();

      setPaymentDetails({
        paymentId: result.paymentId || `PAY-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        method:
          activeTab === "card"
            ? "Credit/Debit Card"
            : activeTab === "upi"
            ? "UPI Payment"
            : "Net Banking",
        amount,
      });

      setPaymentSuccess(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(" ");
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setExpiry(value);
  };

  const handleCvvChange = (e) => {
    setCvv(e.target.value.replace(/\D/g, "").substring(0, 3));
  };

  const selectCard = (card) => {
    setSelectedCard(card);
    setShowSavedCards(false);
    setCardNumber(`•••• •••• •••• ${card.last4}`);
    setExpiry(card.expiry);
  };

  const selectBank = (bank) => {
    setSelectedBank(bank);
    setShowBankList(false);
  };

  const resetPayment = () => {
    setPaymentSuccess(false);
    setCardNumber("");
    setCardName("");
    setExpiry("");
    setCvv("");
    setSelectedCard(null);
    setUpiId("");
    setSelectedBank(null);
    setPaymentDetails(null);
  };

  const isPayButtonDisabled = () => {
    if (processingPayment) return true;
    if (activeTab === "card")
      return !cardNumber || !cardName || !expiry || !cvv;
    if (activeTab === "upi") return !upiId && !showUpiApps;
    if (activeTab === "netbanking") return !selectedBank;
    return true;
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        Loading payment details...
      </div>
    );
  }
  return (
    <div className="payment-container">
      {!paymentSuccess ? (
        <>
          <div className="payment-header">
            <button className="back-button" onClick={handleBack}></button>
            <div className="logo-container">
              <img src={RazorLogo} alt="Razorpay" className="logo" />
              <div className="secure-badge">
                <FaLock className="lock-icon" /> 100% Secure Payments
              </div>
            </div>
          </div>

          <div className="payment-amount">
            <span>Amount to pay</span>
            <div className="amount">
              <FaRupeeSign className="rupee-icon" /> {amount.toFixed(2)}
            </div>
            {orderId && (
              <div className="order-reference">Order ID: {orderId}</div>
            )}
          </div>

          <div className="payment-tabs">
            <button
              className={`tab ${activeTab === "card" ? "active" : ""}`}
              onClick={() => setActiveTab("card")}
            >
              <BsCreditCard className="tab-icon" /> Card
            </button>
            <button
              className={`tab ${activeTab === "upi" ? "active" : ""}`}
              onClick={() => setActiveTab("upi")}
            >
              <img src={UPI} alt="UPI" className="upi-icon tab-icon" /> UPI
            </button>
            <button
              className={`tab ${activeTab === "netbanking" ? "active" : ""}`}
              onClick={() => setActiveTab("netbanking")}
            >
              <CiBank className="tab-icon" /> Net Banking
            </button>
          </div>

          <div className="payment-content">
            {activeTab === "card" && (
              <div className="card-form">
                {savedCards.length > 0 && (
                  <div className="saved-cards-section">
                    <div
                      className="saved-cards-header"
                      onClick={() => setShowSavedCards(!showSavedCards)}
                    >
                      <div className="header-left">
                        <BsCreditCard className="card-icon" />
                        <span>Saved Cards</span>
                      </div>
                      {showSavedCards ? <FaChevronUp /> : <FaChevronDown />}
                    </div>

                    <AnimatePresence>
                      {showSavedCards && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="saved-cards-list"
                        >
                          {savedCards.map((card) => (
                            <motion.div
                              key={card.id}
                              className={`saved-card ${
                                selectedCard?.id === card.id ? "selected" : ""
                              }`}
                              onClick={() => selectCard(card)}
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="card-brand">
                                {card.type === "VISA" ? (
                                  <RiVisaLine className="visa-icon" />
                                ) : (
                                  <RiMastercardLine className="mastercard-icon" />
                                )}
                              </div>
                              <div className="card-details">
                                <div className="card-number">
                                  •••• •••• •••• {card.last4}
                                </div>
                                <div className="card-bank">{card.bank}</div>
                              </div>
                              <div className="card-expiry">
                                Exp: {card.expiry}
                              </div>
                              {card.default && (
                                <div className="default-badge">Default</div>
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div className="form-group">
                  <label>Card Number</label>
                  <div className="input-with-icon">
                    <FaCreditCard className="input-icon" />
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                    />
                    {cardNumber && (
                      <div className="card-type-icon">
                        {cardNumber.startsWith("4") ? (
                          <RiVisaLine className="visa-icon" />
                        ) : cardNumber.startsWith("5") ? (
                          <RiMastercardLine className="mastercard-icon" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Name on card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>

                <div className="card-details-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        placeholder="000"
                        value={cvv}
                        onChange={handleCvvChange}
                        maxLength={3}
                      />
                      <FaShieldAlt className="cvv-icon" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "upi" && (
              <div className="upi-form">
                <div className="upi-options">
                  <button
                    className={`upi-option ${!showUpiApps ? "active" : ""}`}
                    onClick={() => setShowUpiApps(false)}
                  >
                    UPI ID
                  </button>
                  <button
                    className={`upi-option ${showUpiApps ? "active" : ""}`}
                    onClick={() => setShowUpiApps(true)}
                  >
                    UPI Apps
                  </button>
                </div>

                {!showUpiApps ? (
                  <div className="form-group">
                    <label>Enter your UPI ID</label>
                    <input
                      type="text"
                      placeholder="name@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <div className="upi-hint">
                      Example: name@ybl, name@oksbi, name@paytm
                    </div>
                  </div>
                ) : (
                  <div className="upi-apps-grid">
                    {upiApps.map((app) => (
                      <motion.div
                        key={app.id}
                        className="upi-app"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={app.icon}
                          alt={app.name}
                          className="upi-app-icon"
                        />
                        <span>{app.name}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "netbanking" && (
              <div className="netbanking-form">
                <div className="form-group">
                  <label>Select Bank</label>
                  <div
                    className="bank-selector"
                    onClick={() => setShowBankList(!showBankList)}
                  >
                    <div className="selected-bank">
                      {selectedBank ? (
                        <>
                          <div className="bank-logo">{selectedBank.code}</div>
                          <span>{selectedBank.name}</span>
                        </>
                      ) : (
                        <>
                          <CiBank className="bank-icon" />
                          <span>Select your bank</span>
                        </>
                      )}
                    </div>
                    {showBankList ? <FaChevronUp /> : <FaChevronDown />}
                  </div>

                  <AnimatePresence>
                    {showBankList && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bank-list"
                      >
                        {banks.map((bank) => (
                          <div
                            key={bank.id}
                            className={`bank-item ${
                              selectedBank?.id === bank.id ? "selected" : ""
                            }`}
                            onClick={() => selectBank(bank)}
                          >
                            <div className="bank-logo">{bank.code}</div>
                            <span>{bank.name}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {!showBankList && (
                  <div className="popular-banks">
                    <h4>Popular Banks</h4>
                    <div className="popular-banks-grid">
                      {banks.slice(0, 3).map((bank) => (
                        <motion.div
                          key={bank.id}
                          className={`popular-bank ${
                            selectedBank?.id === bank.id ? "selected" : ""
                          }`}
                          onClick={() => selectBank(bank)}
                          whileHover={{ scale: 1.03 }}
                        >
                          <div className="bank-logo">{bank.code}</div>
                          <span>{bank.name.split(" ")[0]}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <motion.button
            className={`pay-button ${processingPayment ? "processing" : ""} ${
              isPayButtonDisabled() ? "disabled" : ""
            }`}
            onClick={handlePayment}
            disabled={isPayButtonDisabled()}
            whileHover={!isPayButtonDisabled() ? { scale: 1.01 } : {}}
            whileTap={!isPayButtonDisabled() ? { scale: 0.99 } : {}}
          >
            {processingPayment ? (
              <div className="spinner"></div>
            ) : (
              <>
                Pay ₹{amount.toFixed(2)}
                <span className="secure-payment">
                  <FaLock /> Secure payment
                </span>
              </>
            )}
          </motion.button>

          <div className="payment-footer">
            <div className="security-features">
              <div className="security-item">
                <FaLock className="security-icon" />
                <span>Secure</span>
              </div>
              <div className="security-item">
                <FaShieldAlt className="security-icon" />
                <span>PCI DSS</span>
              </div>
              <div className="security-item">
                <BsCheckCircleFill className="security-icon" />
                <span>Verified</span>
              </div>
            </div>
            <div className="terms">
              By proceeding, you agree to our{" "}
              <a href="#" className="terms-link">
                Terms of Use
              </a>{" "}
              &{" "}
              <a href="#" className="terms-link">
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </>
      ) : (
        <div className="success-container">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="success-content"
          >
            <motion.div
              className="success-icon"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: 0 }}
            >
              <BsCheckCircleFill />
            </motion.div>
            <h2>Payment Successful!</h2>
            <p className="success-amount">₹{amount.toFixed(2)}</p>
            <p className="success-message">
              Your payment has been processed successfully.
            </p>
            <div className="success-details">
              {orderId && (
                <div className="detail-item">
                  <span>Order ID</span>
                  <span>{orderId}</span>
                </div>
              )}
              <div className="detail-item">
                <span>Payment ID</span>
                <span>{paymentDetails?.paymentId}</span>
              </div>
              <div className="detail-item">
                <span>Date</span>
                <span>{paymentDetails?.date}</span>
              </div>
              <div className="detail-item">
                <span>Time</span>
                <span>{paymentDetails?.time}</span>
              </div>
              <div className="detail-item">
                <span>Method</span>
                <span>{paymentDetails?.method}</span>
              </div>
            </div>
            <motion.button
              className="done-button"
              onClick={resetPayment}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Done
            </motion.button>
          </motion.div>
        </div>
      )}

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

        .payment-container {
          max-width: 440px;
          margin: 0 auto;
          padding: 28px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          color: #333;
          position: relative;
          overflow: hidden;
        }

        .payment-header {
          margin-bottom: 24px;
        }

        .logo-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          height: 50px;
        }

        .secure-badge {
          display: flex;
          align-items: center;
          background: #f8f5ff;
          color: #6c63ff;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(108, 99, 255, 0.1);
        }

        .lock-icon {
          margin-right: 6px;
          font-size: 12px;
        }

        .payment-amount {
          text-align: center;
          margin-bottom: 28px;
        }

        .payment-amount span {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .amount {
          font-size: 36px;
          font-weight: 700;
          margin-top: 8px;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rupee-icon {
          font-size: 28px;
          margin-right: 4px;
        }

        .payment-tabs {
          display: flex;
          background: #f8f5ff;
          border-radius: 12px;
          padding: 6px;
          margin-bottom: 28px;
        }

        .tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab.active {
          background: white;
          color: #6c63ff;
          box-shadow: 0 4px 12px rgba(108, 99, 255, 0.15);
        }

        .tab-icon {
          margin-right: 8px;
          font-size: 16px;
        }

        .upi-icon {
          width: 16px;
          height: 16px;
        }

        .payment-content {
          margin-bottom: 28px;
        }

        .form-group {
          margin-bottom: 18px;
          position: relative;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #555;
        }

        .form-group input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.2s ease;
          background: #fafafa;
        }

        .form-group input:focus {
          outline: none;
          border-color: #6c63ff;
          box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
          background: white;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          font-size: 16px;
        }

        .input-with-icon input {
          padding-left: 42px;
        }

        .card-type-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 24px;
        }

        .visa-icon {
          color: #1a1f71;
        }

        .mastercard-icon {
          color: #eb001b;
        }

        .cvv-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          font-size: 16px;
        }

        .card-details-row {
          display: flex;
          gap: 16px;
        }

        .card-details-row .form-group {
          flex: 1;
        }

        .saved-cards-section {
          margin-bottom: 20px;
          border: 1px solid #f0f0f0;
          border-radius: 12px;
          overflow: hidden;
          background: #fafafa;
        }

        .saved-cards-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          cursor: pointer;
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        .card-icon {
          margin-right: 10px;
          color: #6c63ff;
          font-size: 16px;
        }

        .saved-cards-list {
          border-top: 1px solid #f0f0f0;
          background: white;
        }

        .saved-card {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .saved-card:hover {
          background: #f9f9f9;
        }

        .saved-card.selected {
          background: #f5f3ff;
        }

        .card-brand {
          margin-right: 14px;
        }

        .visa-icon {
          color: #1a1f71;
          font-size: 28px;
        }

        .mastercard-icon {
          color: #eb001b;
          font-size: 28px;
        }

        .card-details {
          flex: 1;
        }

        .card-number {
          font-weight: 600;
          font-size: 15px;
        }

        .card-bank {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }

        .card-expiry {
          font-size: 12px;
          color: #666;
          margin-right: 14px;
          font-weight: 500;
        }

        .default-badge {
          background: #6c63ff;
          color: white;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 600;
        }

        .upi-form {
          margin-top: 8px;
        }

        .upi-options {
          display: flex;
          background: #f8f5ff;
          border-radius: 10px;
          padding: 6px;
          margin-bottom: 18px;
        }

        .upi-option {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .upi-option.active {
          background: white;
          color: #6c63ff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .upi-hint {
          font-size: 12px;
          color: #999;
          margin-top: 6px;
          font-style: italic;
        }

        .upi-apps-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 14px;
        }

        .upi-app {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 18px;
          border: 1px solid #f0f0f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
        }

        .upi-app:hover {
          border-color: #6c63ff;
          box-shadow: 0 4px 12px rgba(108, 99, 255, 0.1);
        }

        .upi-app-icon {
          width: 44px;
          height: 44px;
          margin-bottom: 10px;
          object-fit: contain;
        }

        .upi-app span {
          font-size: 13px;
          font-weight: 600;
        }

        .netbanking-form {
          margin-top: 8px;
        }

        .bank-selector {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          cursor: pointer;
          background: #fafafa;
          transition: all 0.2s ease;
        }

        .bank-selector:hover {
          border-color: #6c63ff;
        }

        .selected-bank {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bank-icon {
          font-size: 20px;
          color: #666;
        }

        .chevron-icon {
          color: #999;
        }

        .bank-list {
          margin-top: 8px;
          border: 1px solid #f0f0f0;
          border-radius: 10px;
          overflow: hidden;
          background: white;
        }

        .bank-item {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: all 0.2s ease;
          gap: 12px;
        }

        .bank-item:hover {
          background: #f9f9f9;
        }

        .bank-item.selected {
          background: #f5f3ff;
        }

        .popular-banks {
          margin-top: 20px;
        }

        .popular-banks h4 {
          font-size: 13px;
          color: #666;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .popular-banks-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .popular-bank {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 14px;
          border: 1px solid #f0f0f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
        }

        .popular-bank:hover {
          border-color: #6c63ff;
          box-shadow: 0 4px 12px rgba(108, 99, 255, 0.1);
        }

        .popular-bank.selected {
          background: #f5f3ff;
          border-color: #6c63ff;
        }

        .bank-logo {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f5ff;
          border-radius: 50%;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 700;
          color: #6c63ff;
        }

        .pay-button {
          width: 100%;
          padding: 16px;
          background: #6c63ff;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 56px;
          box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3);
        }

        .pay-button:hover:not(.disabled) {
          background: #5a52d8;
          box-shadow: 0 6px 16px rgba(108, 99, 255, 0.4);
        }

        .pay-button.processing {
          background: #6c63ff;
          opacity: 0.9;
        }

        .pay-button.disabled {
          background: #e0e0e0;
          cursor: not-allowed;
          box-shadow: none;
        }

        .secure-payment {
          font-size: 11px;
          font-weight: 500;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .spinner {
          width: 22px;
          height: 22px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .payment-footer {
          margin-top: 28px;
          text-align: center;
        }

        .security-features {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 18px;
        }

        .security-item {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        .security-icon {
          margin-right: 6px;
          font-size: 14px;
          color: #6c63ff;
        }

        .terms {
          font-size: 12px;
          color: #999;
          line-height: 1.6;
        }

        .terms-link {
          color: #6c63ff;
          text-decoration: none;
          font-weight: 500;
        }

        /* Success screen styles */
        .success-container {
          padding: 20px;
          text-align: center;
        }

        .success-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .success-icon {
          font-size: 80px;
          color: #4caf50;
          margin-bottom: 20px;
        }

        .success-container h2 {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #333;
        }

        .success-amount {
          font-size: 36px;
          font-weight: 700;
          margin: 20px 0;
          color: #333;
        }

        .success-message {
          color: #666;
          margin-bottom: 28px;
          font-size: 16px;
          line-height: 1.5;
        }

        .success-details {
          width: 100%;
          border-top: 1px solid #f0f0f0;
          padding-top: 20px;
          margin-bottom: 28px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
          font-size: 15px;
        }

        .detail-item span:first-child {
          color: #666;
        }

        .detail-item span:last-child {
          font-weight: 600;
        }

        .done-button {
          width: 100%;
          padding: 16px;
          background: #6c63ff;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
          box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3);
        }

        .done-button:hover {
          background: #5a52d8;
          box-shadow: 0 6px 16px rgba(108, 99, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Payment;
