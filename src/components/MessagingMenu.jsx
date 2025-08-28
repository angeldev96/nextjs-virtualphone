import React from 'react';

const MessagingMenu = ({ onComposeClick }) => {
  return (
    <div className="p-4 text-white">
      <h1 className="text-base font-bold mb-4">Messaging</h1>
      <ul>
        <li className="py-2 border-b border-gray-700">
          <button onClick={onComposeClick} className="w-full text-left focus:outline-none focus:bg-gray-700 p-2 rounded">
            Compose Message
          </button>
        </li>
        {/* Add more messaging options here if needed */}
      </ul>
    </div>
  );
};

export default MessagingMenu;
