import React from 'react';

const ComposeMessage = ({ 
  recipient, 
  message, 
  activeInput, 
  onSetActiveInput, 
  setRecipient,
  setMessage 
}) => {
  return (
    <div className="p-4 text-white h-full flex flex-col">
      <h1 className="text-base font-bold mb-2">Compose Message</h1>
      <div className="mb-2">
        <label htmlFor="recipient" className="block text-sm font-medium text-gray-400">To:</label>
        <input
          type="text"
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          onFocus={() => onSetActiveInput('recipient')}
          className={`w-full bg-gray-800 border border-gray-600 rounded-md p-2 mt-1 text-white focus:outline-none focus:ring-2 ${activeInput === 'recipient' ? 'ring-blue-500' : 'ring-transparent'}`}
          placeholder="Enter number..."
        />
      </div>
      <div className="flex-grow flex flex-col">
        <label htmlFor="message" className="block text-sm font-medium text-gray-400">Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => onSetActiveInput('message')}
          className={`w-full flex-grow bg-gray-800 border border-gray-600 rounded-md p-2 mt-1 text-white focus:outline-none focus:ring-2 ${activeInput === 'message' ? 'ring-blue-500' : 'ring-transparent'}`}
          placeholder="Type your message..."
        ></textarea>
      </div>
      <div className="mt-4">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          Send
        </button>
      </div>
    </div>
  );
};

export default ComposeMessage;
