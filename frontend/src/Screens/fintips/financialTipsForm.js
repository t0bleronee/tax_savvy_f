import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-blue-500">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Get Your Personalized Financial Tips 💡
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <button
                        type="submit"
                        className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 transition-all"
                    >
                        <FaPaperPlane />
                        <span>Get Tips</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FinancialTipsForm;