"use client";

import React, { useState, useEffect, useRef } from 'react';
import Screen from '../components/Screen';
import Keypad from '../components/Keypad';
import MessagingMenu from '../components/MessagingMenu';
import ComposeMessage from '../components/ComposeMessage';

const T9_MAP = {
  '2': 'ABC',
  '3': 'DEF',
  '4': 'GHI',
  '5': 'JKL',
  '6': 'MNO',
  '7': 'PQRS',
  '8': 'TUV',
  '9': 'WXYZ',
  '0': ' ',
  '1': '1',
  '*': '*',
  '#': '#',
};

// Main FlipPhone component
const FlipPhone = () => {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'messaging', 'compose'
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [activeInput, setActiveInput] = useState('recipient'); // 'recipient', 'message'
  const [t9Timeout, setT9Timeout] = useState(null);
  const [lastKey, setLastKey] = useState(null);
  const [charIndex, setCharIndex] = useState(0);

  const handleMsgClick = () => {
    setCurrentScreen('messaging');
  };

  const handleKeyPress = (key) => {
    if (activeInput === 'recipient') {
      if (/\d/.test(key) || key === '*' || key === '#') {
        setRecipient(prev => prev + key);
      }
      return;
    }

    const updater = setMessage;
    const currentValue = message;

    if (t9Timeout) {
      clearTimeout(t9Timeout);
    }

    if (key === lastKey) {
      const chars = T9_MAP[key];
      const nextIndex = (charIndex + 1) % chars.length;
      setCharIndex(nextIndex);
      updater(currentValue.slice(0, -1) + chars[nextIndex]);
    } else {
      setCharIndex(0);
      const chars = T9_MAP[key];
      if (chars) {
        updater(currentValue + chars[0]);
      }
    }

    setLastKey(key);
    setT9Timeout(setTimeout(() => {
      setLastKey(null);
      setCharIndex(0);
    }, 1000));
  };

  const handleDelete = () => {
    const updater = activeInput === 'recipient' ? setRecipient : setMessage;
    updater(prev => prev.slice(0, -1));
  };

  const handleEndClick = () => {
    setCurrentScreen('home');
  };

  const handleComposeClick = () => {
    setCurrentScreen('compose');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'compose':
        return <ComposeMessage
                  recipient={recipient}
                  message={message}
                  activeInput={activeInput}
                  onSetActiveInput={setActiveInput}
                  setRecipient={setRecipient}
                  setMessage={setMessage}
                />;
      case 'messaging':
        return <MessagingMenu onComposeClick={handleComposeClick} />;
      case 'home':
      default:
        return <Screen onMsgClick={handleMsgClick} />;
    }
  };

  // Responsive scaling so the whole phone fits the viewport
  const phoneRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [phoneHeight, setPhoneHeight] = useState(null);

  const updateScale = () => {
    if (!phoneRef.current) return;
    const rect = phoneRef.current.getBoundingClientRect();
    const naturalHeight = rect.height;
    if (!phoneHeight) setPhoneHeight(naturalHeight);
    const available = window.innerHeight - 32; // small padding
    const newScale = Math.min(1, available / naturalHeight);
    setScale(newScale);
  };

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      {/* Container that reserves the scaled height to avoid cropping */}
      <div
        className="relative"
        style={{ height: phoneHeight ? phoneHeight * scale : 'auto' }}
      >
        {/* Scaled phone */}
        <div
          ref={phoneRef}
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
          className="relative w-80 bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-700"
        >

          {/* Top screen frame */}
          <div className="p-2">
            <div className="relative">
              {/* Earpiece */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gray-700 rounded-full"></div>

              {/* Camera */}
              <div className="absolute top-2 left-4 w-2 h-2 bg-gray-700 rounded-full"></div>

              {/* Screen */}
              <div className="mt-5 h-[25rem] bg-black rounded-2xl p-1 shadow-inner">
                {renderScreen()}
              </div>
            </div>
          </div>

          {/* Hinge */}
          <div className="h-2 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 border-t border-b border-gray-600"></div>

          {/* Bottom keypad */}
          <Keypad
            onMsgClick={handleMsgClick}
            onEndClick={handleEndClick}
            onKeyPress={handleKeyPress}
            onDelete={handleDelete}
          />

          {/* Shadow and depth effects (moved inside scaled element so they scale together) */}
          <div className="absolute -inset-1 bg-gradient-to-b from-gray-900 to-black rounded-3xl -z-10 opacity-60"></div>
          <div className="absolute -inset-2 bg-gradient-to-b from-black to-gray-900 rounded-3xl -z-20 opacity-40"></div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-800 via-gray-900 to-black">
      <div className="absolute top-4 left-4">
        <p className="text-white text-sm">
          <strong>Pro Tip:</strong> You can use your computer&apos;s keyboard to type in the message fields.
        </p>
      </div>
      <FlipPhone />
    </div>
  );
}
