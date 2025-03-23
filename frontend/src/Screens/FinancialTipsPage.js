import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFinancialTips } from "../api";
import { FaArrowLeft, FaLeaf } from "react-icons/fa";
import { motion } from "framer-motion";

const FinancialTipsPage = () => {
    const { email } = useParams();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTips = async () => {
            try {
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
    }, [email]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#A8D8D3] font-ebgaramond">
                <div className="text-2xl font-semibold text-[#217A5D] animate-pulse">
                    Loading your tips...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#4FD1A5] to-[#A8D8D3] p-6 font-ebgaramond">
            {/* Container */}
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                {/* Header & Go Back */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-4xl font-bold text-[#217A5D]">
                        Your Financial Tips
                    </h2>

                    {/* Go Back Button */}
                    <Link
                        to="/"
                        className="bg-[#4FD1A5] hover:bg-[#217A5D] text-white font-semibold px-5 py-2 rounded-full transition-all flex items-center space-x-2 shadow-md"
                    >
                        <FaArrowLeft />
                        <span>Go Back</span>
                    </Link>
                </div>

                {/* Show error if any */}
                {error && (
                    <p className="text-red-500 text-center text-lg">{error}</p>
                )}

                {/* Tips List */}
                {userData && (
                    <div className="space-y-2"> {/* Reduced space between tips */}
                        {userData.tips.map((tip, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start bg-gradient-to-r from-[#A8D8D3] to-[#4FD1A5] rounded-xl p-4 shadow hover:shadow-lg transition-all space-x-3"
                            >
                                <FaLeaf className="text-[#217A5D] text-2xl mt-1" />
                                <p className="text-[#1C6C52] font-medium text-xl">{tip}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Custom font class & import */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&display=swap');

                    .font-ebgaramond {
                        font-family: 'EB Garamond', serif;
                    }
                `}
            </style>
        </div>
    );
};

export default FinancialTipsPage;
