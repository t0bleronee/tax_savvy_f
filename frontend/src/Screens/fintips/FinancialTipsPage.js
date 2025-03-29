import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFinancialTips } from "./api";
import { FaArrowLeft, FaLeaf } from "react-icons/fa";
import { motion } from "framer-motion";
import "../../css/tips.css"; 
import Navbar from "../../Components/Navbar";
 // Import the external CSS file

const FinancialTipsPage = () => {
    //const { email } = useParams();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTips = async () => {
            try {
                const email=localStorage.getItem("userEmail");
                const data = await getFinancialTips(email);
                setUserData(data);
                setError("");
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTips();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-text">Loading your tips...</div>
            </div>
        );
    }

    return (
        <div>
            <Navbar /> {/* Include the Navbar component here */}
     
        <div className="page-container">
            <div className="content-box">
                <div className="header">
                    <h2 className="title">Your Financial Tips</h2>
                   <Link to="/financial-tips" className="back-button">
                        <FaArrowLeft />
                        <span>Go Back</span>
                    </Link>
                </div>

                {error && <p className="error-text">{error}</p>}

                {userData && (
                    <div className="tips-list">
                        {userData.tips.map((tip, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="tip-card"
                            >
                                <FaLeaf className="icon" />
                                <p className="tip-text">{tip}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>   </div>
    );
};

export default FinancialTipsPage;