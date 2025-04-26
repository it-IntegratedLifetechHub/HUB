import React, { useState } from "react";
import {
  FaCreditCard,
  FaRupeeSign,
  FaShieldAlt,
  FaLock,
  FaChevronDown,
  FaCheck,
  FaSearch,
} from "react-icons/fa";
import { CiBank } from "react-icons/ci";
import { BsCheckCircleFill, BsCreditCard } from "react-icons/bs";
import { RiVisaLine, RiMastercardLine } from "react-icons/ri";
import RazorLogo from "../assets/razorpay.png";
import UPI from "../assets/UPI.svg";
import PhonePay from "../assets/phonepay.png";
import Paytm from "../assets/Paytm.png";
import GPAY from "../assets/GPAY.webp";

const Payment = ({
  amount = 135.0,
  onPaymentSuccess,
  savedCards = [
    { id: 1, type: "VISA", last4: "3456", expiry: "05/25", bank: "HDFC Bank" },
    {
      id: 2,
      type: "MASTERCARD",
      last4: "7890",
      expiry: "12/24",
      bank: "ICICI Bank",
    },
  ],
  upiApps = [
    { id: 1, name: "Google Pay", icon: GPAY, color: "#5F30E2" },
    { id: 2, name: "PhonePe", icon: PhonePay, color: "#5F259F" },
    { id: 3, name: "Paytm", icon: Paytm, color: "#00BAF2" },
  ],
  banks = [
    { id: 1, name: "State Bank of India", code: "SBI", logo: "SBI" },
    { id: 2, name: "HDFC Bank", code: "HDFC", logo: "HDFC" },
    { id: 3, name: "ICICI Bank", code: "ICICI", logo: "ICICI" },
    { id: 4, name: "Axis Bank", code: "AXIS", logo: "AXIS" },
    { id: 5, name: "Kotak Mahindra Bank", code: "KOTAK", logo: "KOTAK" },
    { id: 6, name: "Punjab National Bank", code: "PNB", logo: "PNB" },
    { id: 7, name: "Bank of Baroda", code: "BOB", logo: "BOB" },
    { id: 8, name: "Canara Bank", code: "CANARA", logo: "CANARA" },
  ],
}) => {
  const [activeTab, setActiveTab] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [showSavedCards, setShowSavedCards] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardType, setCardType] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      // Detect card type
      const firstDigit = value.replace(/\s/g, "").charAt(0);
      if (firstDigit === "4") setCardType("visa");
      else if (firstDigit === "5") setCardType("mastercard");
      else if (firstDigit === "6") setCardType("rupay");
      else setCardType("");

      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      setCardDetails((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
      return;
    }

    if (name === "expiry") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
        .substring(0, 5);
      setCardDetails((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
      return;
    }

    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Prepare payment data based on active tab
      let paymentData = {};
      if (activeTab === "card") {
        paymentData = {
          method: "card",
          details: {
            ...cardDetails,
            type: cardType,
            selectedCard: selectedCard
              ? savedCards.find((card) => card.id === selectedCard)
              : null,
          },
        };
      } else if (activeTab === "upi") {
        paymentData = {
          method: "upi",
          details: { upiId },
        };
      } else if (activeTab === "netbanking") {
        paymentData = {
          method: "netbanking",
          details: { bankSearch },
        };
      }

      // Call the success callback with payment data
      if (onPaymentSuccess) {
        onPaymentSuccess({
          amount,
          transactionId: `RZP${Math.floor(Math.random() * 10000000000)}`,
          date: new Date().toISOString(),
          ...paymentData,
        });
      }
    }, 2000);
  };

  const resetPayment = () => {
    setPaymentSuccess(false);
    setCardDetails({
      number: "",
      name: "",
      expiry: "",
      cvv: "",
    });
    setUpiId("");
    setBankSearch("");
    setCardType("");
  };

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const toggleSavedCards = () => {
    setShowSavedCards(!showSavedCards);
  };

  const renderCardIcon = () => {
    switch (cardType) {
      case "visa":
        return <RiVisaLine className="card-type-icon visa" />;
      case "mastercard":
        return <RiMastercardLine className="card-type-icon mastercard" />;
      case "rupay":
        return <FaRupeeSign className="card-type-icon rupay" />;
      default:
        return <BsCreditCard className="card-type-icon default" />;
    }
  };

  const SuccessScreen = () => (
    <div className="success-screen">
      <div className="success-icon">
        <BsCheckCircleFill />
      </div>
      <h2>Payment Successful!</h2>
      <p className="success-message">
        Your payment of ₹{amount.toFixed(2)} has been processed successfully. A
        receipt has been sent to your email.
      </p>
      <div className="order-details">
        <div className="detail-item">
          <span>Transaction ID:</span>
          <span>RZP{Math.floor(Math.random() * 10000000000)}</span>
        </div>
        <div className="detail-item">
          <span>Date:</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div className="detail-item">
          <span>Payment Method:</span>
          <span>
            {activeTab === "card"
              ? "Credit/Debit Card"
              : activeTab === "upi"
              ? "UPI"
              : "Net Banking"}
          </span>
        </div>
      </div>
      <button className="continue-button" onClick={resetPayment}>
        Make Another Payment
      </button>
    </div>
  );

  const CardPaymentForm = () => (
    <form className="card-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Card Number</label>
        <div className="input-with-icon">
          {renderCardIcon()}
          <input
            type="text"
            name="number"
            value={cardDetails.number}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className="card-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Cardholder Name</label>
        <input
          type="text"
          name="name"
          value={cardDetails.name}
          onChange={handleInputChange}
          placeholder="Name as on card"
          className="name-input"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Expiry Date</label>
          <input
            type="text"
            name="expiry"
            value={cardDetails.expiry}
            onChange={handleInputChange}
            placeholder="MM/YY"
            maxLength="5"
            className="expiry-input"
          />
        </div>
        <div className="form-group">
          <label>CVV</label>
          <div className="input-with-icon">
            <input
              type="password"
              name="cvv"
              value={cardDetails.cvv}
              onChange={handleInputChange}
              placeholder="•••"
              maxLength="3"
              className="cvv-input"
            />
            <FaLock className="lock-icon" />
          </div>
        </div>
      </div>

      {savedCards.length > 0 && (
        <div className="saved-cards">
          <div className="saved-card-header" onClick={toggleSavedCards}>
            <div className="header-content">
              <span>Saved Cards</span>
              <span className="cards-count">{savedCards.length} cards</span>
            </div>
            <FaChevronDown
              className={`chevron ${showSavedCards ? "up" : "down"}`}
            />
          </div>
          {showSavedCards && (
            <div className="saved-cards-list">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  className={`saved-card-item ${
                    selectedCard === card.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedCard(card.id)}
                >
                  <div className="card-top">
                    <div
                      className={`card-type ${
                        card.type === "VISA" ? "visa" : "mastercard"
                      }`}
                    >
                      {card.type === "VISA" ? (
                        <RiVisaLine />
                      ) : (
                        <RiMastercardLine />
                      )}
                    </div>
                    <div className="card-bank">{card.bank}</div>
                  </div>
                  <div className="card-middle">
                    <div className="card-number">
                      •••• •••• •••• {card.last4}
                    </div>
                    <div className="card-expiry">Exp: {card.expiry}</div>
                  </div>
                  {selectedCard === card.id && (
                    <FaCheck className="check-icon" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        className={`pay-button ${isProcessing ? "processing" : ""}`}
        disabled={
          !cardDetails.number ||
          !cardDetails.name ||
          !cardDetails.expiry ||
          !cardDetails.cvv ||
          isProcessing
        }
      >
        {isProcessing ? (
          <>
            <div className="spinner"></div>
            Processing...
          </>
        ) : (
          <>
            <FaRupeeSign className="rupee-icon" />
            Pay ₹{amount.toFixed(2)}
          </>
        )}
      </button>
    </form>
  );

  const UPIPaymentForm = () => (
    <div className="upi-method">
      <div className="form-group">
        <label>Enter your UPI ID</label>
        <div className="upi-id-input">
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="name@upi"
            className="upi-input"
          />
          <button
            type="button"
            className="verify-button"
            disabled={!upiId.includes("@")}
          >
            Verify
          </button>
        </div>
      </div>

      <div className="section-title">Or pay directly via</div>

      <div className="upi-apps">
        {upiApps.map((app) => (
          <div
            key={app.id}
            className="upi-app"
            style={{
              backgroundColor: `${app.color}10`,
              borderColor: `${app.color}30`,
            }}
          >
            <div
              className="app-icon-container"
              style={{ backgroundColor: app.color }}
            >
              <img src={app.icon} alt={app.name} className="app-icon" />
            </div>
            <span className="app-name">{app.name}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="pay-button upi-pay-button"
        onClick={handleSubmit}
        disabled={!upiId}
      >
        Pay via UPI
      </button>
    </div>
  );

  const NetBankingForm = () => (
    <div className="netbanking-method">
      <div className="form-group">
        <label>Search for your bank</label>
        <div className="bank-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            value={bankSearch}
            onChange={(e) => setBankSearch(e.target.value)}
            placeholder="e.g. HDFC, SBI, ICICI"
            className="bank-search-input"
          />
        </div>
      </div>

      <div className="bank-list-container">
        <div className="bank-list">
          {filteredBanks.length > 0 ? (
            filteredBanks.map((bank) => (
              <div key={bank.id} className="bank-item">
                <div className="bank-logo">{bank.logo}</div>
                <div className="bank-details">
                  <div className="bank-name">{bank.name}</div>
                  <div className="bank-code">{bank.code}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-banks-found">
              <div className="no-results-icon">🔍</div>
              <div>No banks found matching your search</div>
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        className="pay-button"
        onClick={handleSubmit}
        disabled={!bankSearch}
      >
        Pay via Net Banking
      </button>
    </div>
  );

  return (
    <div className="payment-container">
      {paymentSuccess ? (
        <SuccessScreen />
      ) : (
        <>
          <div className="payment-header">
            <div className="logo-container">
              <img src={RazorLogo} alt="Razorpay" className="logo" />
              <div className="secure-badge">
                <FaShieldAlt className="shield-icon" />
                <span>100% Secure Payments</span>
              </div>
            </div>
            <div className="amount-display">
              <span>Amount to pay:</span>
              <div className="amount">
                <FaRupeeSign className="rupee-icon" />
                <span>{amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="payment-body">
            <div className="payment-methods">
              <button
                className={`method-tab ${activeTab === "card" ? "active" : ""}`}
                onClick={() => setActiveTab("card")}
              >
                <FaCreditCard className="tab-icon" />
                <span>Card</span>
              </button>
              <button
                className={`method-tab ${activeTab === "upi" ? "active" : ""}`}
                onClick={() => setActiveTab("upi")}
              >
                <img src={UPI} alt="UPI" className="tab-icon upi-icon" />
                <span>UPI</span>
              </button>
              <button
                className={`method-tab ${
                  activeTab === "netbanking" ? "active" : ""
                }`}
                onClick={() => setActiveTab("netbanking")}
              >
                <CiBank className="tab-icon" />
                <span>Net Banking</span>
              </button>
            </div>

            <div className="payment-content">
              {activeTab === "card" && <CardPaymentForm />}
              {activeTab === "upi" && <UPIPaymentForm />}
              {activeTab === "netbanking" && <NetBankingForm />}
            </div>

            <div className="payment-footer">
              <div className="security-assurance">
                <div className="security-item">
                  <FaLock className="security-icon" />
                  <span>Secure SSL Encryption</span>
                </div>
                <div className="security-item">
                  <FaShieldAlt className="security-icon" />
                  <span>PCI DSS Compliant</span>
                </div>
              </div>
              <div className="payment-terms">
                By continuing, you agree to our{" "}
                <a href="#" className="terms-link">
                  Terms of Use
                </a>{" "}
                &{" "}
                <a href="#" className="terms-link">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        :root {
          --primary-color: #1246cb;
          --primary-dark: #4c1d95;
          --primary-light: #c4b5fd;
          --primary-lighter: #ede9fe;
          --secondary-color: #64748b;
          --light-color: #f8fafc;
          --dark-color: #1e293b;
          --border-radius: 16px;
          --border-radius-sm: 12px;
          --border-radius-xs: 8px;
          --box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          --box-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);
          --success-color: #1246cb;
          --error-color: #ef4444;
          --warning-color: #f59e0b;
          --font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .payment-container {
          max-width: 480px;
          margin: 0 auto;
          font-family: var(--font-family);
          border-radius: var(--border-radius);
          overflow: hidden;
          box-shadow: var(--box-shadow-lg);
          background: white;
          border: 1px solid #e2e8f0;
          transform: translateY(0);
          transition: var(--transition);
        }

        .payment-container:hover {
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .payment-header {
          background: linear-gradient(
            135deg,
            var(--primary-dark),
            var(--primary-color)
          );
          color: white;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          position: relative;
          overflow: hidden;
        }

        .payment-header::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-light), #ec4899);
        }

        .logo-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-direction: column;
          gap: 1rem;
        }

        .logo {
          height: 50%;
          width: 90%;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .secure-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          background: rgba(255, 255, 255, 0.15);
          padding: 0.6rem 1rem;
          border-radius: 20px;
          font-weight: 500;
          backdrop-filter: blur(5px);
          transition: var(--transition);
        }

        .secure-badge:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        .shield-icon {
          font-size: 0.9rem;
        }

        .amount-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1rem;
          opacity: 0.9;
        }

        .amount {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .rupee-icon {
          font-size: 1.2rem;
        }

        .payment-body {
          padding: 1.75rem;
        }

        .payment-methods {
          display: flex;
          margin-bottom: 1.75rem;
          border-bottom: 1px solid #e2e8f0;
          gap: 0.5rem;
        }

        .method-tab {
          flex: 1;
          padding: 0.85rem 0.5rem;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--secondary-color);
          border-bottom: 2px solid transparent;
          transition: var(--transition);
          border-radius: var(--border-radius-xs);
          position: relative;
        }

        .method-tab:hover {
          background: #f8fafc;
          color: var(--primary-color);
        }

        .method-tab.active {
          color: var(--primary-color);
          border-bottom: 2px solid var(--primary-color);
          font-weight: 600;
          background: var(--primary-lighter);
        }

        .method-tab.active::after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .tab-icon {
          font-size: 1.3rem;
        }

        .upi-icon {
          width: 22px;
          height: 22px;
        }

        .payment-content {
          margin-top: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
          color: var(--dark-color);
          font-weight: 500;
        }

        input {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 1px solid #e2e8f0;
          border-radius: var(--border-radius-sm);
          font-size: 1rem;
          transition: var(--transition);
          font-family: var(--font-family);
          background: white;
        }

        input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(106, 13, 173, 0.1);
          outline: none;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .card-type-icon {
          position: absolute;
          left: 1rem;
          z-index: 1;
          font-size: 1.5rem;
        }

        .card-type-icon.visa {
          color: #1a1f71;
        }

        .card-type-icon.mastercard {
          color: #eb001b;
        }

        .card-type-icon.rupay {
          color: #003082;
        }

        .card-type-icon.default {
          color: var(--secondary-color);
          opacity: 0.7;
        }

        .card-input {
          padding-left: 3.5rem;
          letter-spacing: 1px;
          font-size: 0.95rem;
        }

        .name-input {
          font-size: 0.95rem;
        }

        .expiry-input,
        .cvv-input {
          font-size: 0.95rem;
          letter-spacing: 1px;
        }

        .lock-icon {
          position: absolute;
          right: 1rem;
          color: var(--secondary-color);
          font-size: 1rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-row .form-group {
          flex: 1;
          margin-bottom: 0;
        }

        .saved-cards {
          border: 1px solid #e2e8f0;
          border-radius: var(--border-radius-sm);
          margin: 2rem 0;
          overflow: hidden;
          background: white;
        }

        .saved-card-header {
          padding: 1.25rem;
          background: #f8fafc;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.95rem;
          color: var(--dark-color);
          cursor: pointer;
          transition: var(--transition);
        }

        .saved-card-header:hover {
          background: #f1f5f9;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .cards-count {
          font-size: 0.8rem;
          color: var(--secondary-color);
          background: rgba(0, 0, 0, 0.05);
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
        }

        .chevron {
          transition: var(--transition);
          color: var(--secondary-color);
          font-size: 0.9rem;
        }

        .chevron.up {
          transform: rotate(180deg);
        }

        .saved-cards-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .saved-card-item {
          padding: 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: relative;
          cursor: pointer;
          transition: var(--transition);
        }

        .saved-card-item:not(:last-child) {
          border-bottom: 1px solid #f1f5f9;
        }

        .saved-card-item:hover {
          background: #f8fafc;
        }

        .saved-card-item.selected {
          background: #f0f7ff;
          border-left: 3px solid var(--primary-color);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-type {
          font-size: 1.5rem;
        }

        .card-type.visa {
          color: #1a1f71;
        }

        .card-type.mastercard {
          color: #eb001b;
        }

        .card-bank {
          font-size: 0.85rem;
          color: var(--secondary-color);
        }

        .card-middle {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-number {
          flex: 1;
          font-family: monospace;
          letter-spacing: 1px;
          font-size: 0.95rem;
        }

        .card-expiry {
          color: var(--secondary-color);
          font-size: 0.85rem;
        }

        .check-icon {
          position: absolute;
          right: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--success-color);
          font-size: 1rem;
          background: white;
          border-radius: 50%;
          padding: 0.25rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .pay-button {
          width: 100%;
          padding: 1.25rem;
          background: linear-gradient(
            135deg,
            var(--primary-dark),
            var(--primary-color)
          );
          color: white;
          border: none;
          border-radius: var(--border-radius-sm);
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(106, 13, 173, 0.2);
        }

        .pay-button:hover:not(:disabled) {
          opacity: 0.95;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(106, 13, 173, 0.3);
        }

        .pay-button:disabled {
          background: #e2e8f0;
          color: #94a3b8;
          cursor: not-allowed;
          opacity: 0.8;
          box-shadow: none;
        }

        .pay-button.processing {
          cursor: not-allowed;
        }

        .rupee-icon {
          font-size: 1rem;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* UPI Styles */
        .upi-method {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .upi-id-input {
          display: flex;
          gap: 0.75rem;
        }

        .upi-input {
          flex: 1;
          font-size: 0.95rem;
        }

        .verify-button {
          padding: 0 1.5rem;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: var(--transition);
          white-space: nowrap;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .verify-button:hover:not(:disabled) {
          background: #e2e8f0;
        }

        .verify-button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .section-title {
          font-size: 0.9rem;
          color: var(--secondary-color);
          text-align: center;
          position: relative;
          margin: 1.5rem 0;
        }

        .section-title::before,
        .section-title::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid #e2e8f0;
          position: absolute;
          top: 50%;
          width: 30%;
        }

        .section-title::before {
          left: 0;
        }

        .section-title::after {
          right: 0;
        }

        .upi-apps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin: 1rem 0;
        }

        .upi-app {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }

        .upi-app:hover {
          transform: translateY(-2px);
          box-shadow: var(--box-shadow);
        }

        .app-icon-container {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          transition: var(--transition);
        }

        .app-icon {
          width: 26px;
          height: 26px;
          object-fit: contain;
        }

        .app-name {
          font-size: 0.85rem;
          text-align: center;
          font-weight: 500;
        }

        .upi-pay-button {
          margin-top: 0.5rem;
        }

        /* Net Banking Styles */
        .netbanking-method {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .bank-search {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--secondary-color);
          font-size: 1rem;
        }

        .bank-search-input {
          font-size: 0.95rem;
          padding-left: 2.75rem;
        }

        .bank-list-container {
          max-height: 300px;
          overflow-y: auto;
          margin-top: 0.5rem;
          border-radius: var(--border-radius-sm);
          border: 1px solid #e2e8f0;
        }

        .bank-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 0.75rem;
        }

        .bank-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: var(--transition);
          background: white;
        }

        .bank-item:hover {
          border-color: var(--primary-color);
          background: #f8fafc;
          transform: translateY(-2px);
          box-shadow: var(--box-shadow);
        }

        .bank-logo {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--primary-lighter);
          color: var(--primary-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .bank-details {
          flex: 1;
        }

        .bank-name {
          font-size: 0.95rem;
          font-weight: 500;
        }

        .bank-code {
          font-size: 0.8rem;
          color: var(--secondary-color);
          margin-top: 0.25rem;
        }

        .no-banks-found {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: var(--secondary-color);
          font-size: 0.9rem;
          gap: 0.75rem;
          text-align: center;
        }

        .no-results-icon {
          font-size: 1.5rem;
          opacity: 0.7;
        }

        /* Payment Footer */
        .payment-footer {
          margin-top: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .security-assurance {
          display: flex;
          justify-content: center;
          gap: 1.75rem;
          flex-wrap: wrap;
        }

        .security-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--secondary-color);
          padding: 0.5rem 0;
        }

        .security-icon {
          color: var(--success-color);
          font-size: 0.95rem;
        }

        .payment-terms {
          font-size: 0.8rem;
          color: var(--secondary-color);
          text-align: center;
          line-height: 1.5;
        }

        .terms-link {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
        }

        .terms-link:hover {
          text-decoration: underline;
        }

        /* Success Screen Styles */
        .success-screen {
          padding: 3rem 1.75rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 500px;
        }

        .success-icon {
          font-size: 5rem;
          color: var(--success-color);
          margin-bottom: 1.5rem;
          animation: bounce 0.6s ease;
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }

        .success-screen h2 {
          font-size: 1.8rem;
          color: var(--dark-color);
          margin-bottom: 1rem;
        }

        .success-message {
          color: var(--secondary-color);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 350px;
        }

        .order-details {
          width: 100%;
          max-width: 350px;
          margin: 1.5rem 0;
          border: 1px solid #e2e8f0;
          border-radius: var(--border-radius-sm);
          padding: 1.25rem;
          text-align: left;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }

        .detail-item:last-child {
          margin-bottom: 0;
        }

        .detail-item span:first-child {
          color: var(--secondary-color);
        }

        .detail-item span:last-child {
          font-weight: 500;
          color: var(--dark-color);
        }

        .continue-button {
          margin-top: 1.5rem;
          padding: 1rem 2rem;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius-sm);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .continue-button:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        /* Responsive Adjustments */
        @media (max-width: 480px) {
          .payment-container {
            border-radius: 0;
            border: none;
          }

          .payment-header {
            padding: 1.25rem;
          }

          .payment-body {
            padding: 1.25rem;
          }

          .method-tab {
            font-size: 0.8rem;
            padding: 0.5rem;
          }

          .form-group {
            margin-bottom: 1.25rem;
          }

          input {
            padding: 0.8rem 1rem;
          }

          .success-screen {
            padding: 2rem 1rem;
          }

          .success-icon {
            font-size: 4rem;
          }

          .success-screen h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Payment;
