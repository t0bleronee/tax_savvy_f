
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import "../../css/fintips.css"; 
import Navbar from "../../Components/Navbar"; // Import the Navbar component
const FinancialTipsForm = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setError("Please enter an email address.");
            return;
        }
        setError("");
        navigate(`/financial-tips/${email}`);
    };

    return (
        <div>
            <Navbar /> {/* Include the Navbar component here */}
       
        <div className="financial-tips-container">
            <div className="financial-tips-wrapper">
                <h2 className="financial-tips-title">Financial Tips  </h2>
    
                <form onSubmit={handleSubmit}>
                    <div className="financial-tips-group">
                        <label htmlFor="email" className="financial-tips-label">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="financial-tips-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
    
                    {error && <p className="financial-tips-error">{error}</p>}
    
                    <button type="submit" className="financial-tips-button">
                        <FaPaperPlane /> Get Tips
                    </button>
                </form>
            </div>
        </div> </div>
    );
};

export default FinancialTipsForm;