import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import faq from '../css/faq.css';

const faqs = [
  { question: "Why should I use TaxSavvy?", answer: "TaxSavvy helps simplify tax filing with automated calculations and budget insights." },
  { question: "How do I calculate my tax?", answer: "Enter your income details, and TaxSavvy will estimate your tax liability after deductions." },
  { question: "What is the difference between the new and old tax regimes?", answer: "Our platform provides a side-by-side comparison to help you choose the best option." },
  { question: "Can I save money using TaxSavvy?", answer: "Yes! TaxSavvy suggests deductions and exemptions to optimize your tax savings." },
  { question: "How do I access budget insights?", answer: "Budget insights are personalized and available on your dashboard based on your profile." },
  { question: "Is there an AI chatbot for assistance?", answer: "Yes, our AI chatbot can help with tax-related queries in real-time." },
  { question: "Is TaxSavvy free to use?", answer: "Yes, the basic features are free, but premium financial insights may require a subscription." },
  { question: "How do I check my eligibility for government schemes?", answer: "Use the Government Schemes Finder on the platform to check your eligibility." },
  { question: "Can I file my taxes directly through TaxSavvy?", answer: "Currently, we provide guidance and calculations, but direct filing is not yet supported." },
  { question: "Is my data secure on TaxSavvy?", answer: "Yes, we use encryption and secure protocols to protect user data." },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-heading">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item" onClick={() => toggleFAQ(index)}>
            <div className="faq-question">
              <span>{faq.question}</span>
              {openIndex === index ? <FaMinus className="faq-icon" /> : <FaPlus className="faq-icon" />}
            </div>
            {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
