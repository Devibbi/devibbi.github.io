// src/components/IQTest.js
import React from 'react';
import IQTestGame from './IQTestGame';

const IQTest = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
                    Close
                </button>
                <IQTestGame />
            </div>
        </div>
    );
};

export default IQTest;