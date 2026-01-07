import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Modal({ isOpen, title, onClose, children }) {
  const { isDark } = useContext(ThemeContext);

  console.log("Modal render - isOpen:", isOpen, "title:", title);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg shadow-lg p-6 w-96 max-h-screen overflow-y-auto ${
        isDark ? "bg-gray-800 text-white" : "bg-white"
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{title}</h2>
          <button
            onClick={onClose}
            className={`text-2xl ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
