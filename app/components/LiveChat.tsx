import React, { useState } from 'react';
import { IoChatbubblesOutline } from 'react-icons/io5';

const LiveChat = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-white text-black shadow-lg rounded-full p-4 flex items-center justify-center hover:bg-gray-100 transition-all duration-200 focus:outline-none border border-gray-200 md:mb-0 mb-4"
        aria-label="Open live chat"
        style={{ zIndex: 100 }}
      >
        <IoChatbubblesOutline size={28} />
      </button>
      {/* Chat Window */}
      {open && (
        <div
          className="fixed md:absolute inset-0 md:inset-auto md:bottom-0 md:right-0 w-full h-full md:w-80 md:max-w-xs md:rounded-2xl bg-white text-black shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up transition-all duration-300"
          style={{ zIndex: 1000 }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 md:rounded-t-2xl">
            <span className="font-bold text-lg">Live Chat</span>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-black p-2 rounded-full focus:outline-none text-2xl md:text-base absolute md:static top-4 right-4 md:top-auto md:right-auto bg-white md:bg-transparent shadow md:shadow-none">
              <span className="sr-only">Close chat</span>
              ×
            </button>
          </div>
          <div className="flex-1 px-4 py-3 text-sm overflow-y-auto" style={{ minHeight: 120 }}>
            <div className="text-gray-600 text-center my-4">Chat with us about construction document management!</div>
            {/* Chat messages would go here */}
          </div>
          <form className="flex items-center border-t border-gray-100 bg-white px-2 py-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/10 bg-gray-50 text-black"
              placeholder="Type your message..."
              disabled
            />
            <button type="submit" className="ml-2 px-4 py-2 rounded-full bg-black text-white font-semibold hover:bg-black/90 transition-all duration-200" disabled>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LiveChat; 