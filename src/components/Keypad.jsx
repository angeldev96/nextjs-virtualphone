import React from 'react';

// Keypad button component
const KeypadButton = ({ children, className = "", onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center h-12 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 shadow-md text-white font-medium transition-all duration-150 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
};

// Keypad component
const Keypad = ({ onMsgClick, onEndClick, onKeyPress, onDelete }) => {
  return (
    <div className="px-4 py-5 bg-gray-900 rounded-b-3xl">
      <div className="grid grid-cols-4 gap-2 mb-4">
        {/* Action Buttons */}
        <KeypadButton>
            <span className='text-green-500'>CALL</span>
        </KeypadButton>
        <KeypadButton onClick={onMsgClick}>
            <span>MSG</span>
        </KeypadButton>
        <KeypadButton onClick={onDelete}>
          <span>DEL</span>
        </KeypadButton>
        <KeypadButton onClick={onEndClick}>
            <span className='text-red-500'>END</span>
        </KeypadButton>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Row 1 */}
        <KeypadButton onClick={() => onKeyPress('1')}>
          <div className="text-center">
            <div className="text-lg font-bold leading-none">1</div>
            <div className="text-[10px] text-gray-400"> </div>
          </div>
        </KeypadButton>
        <KeypadButton onClick={() => onKeyPress('2')}>
          <div className="text-center">
            <div className="text-lg font-bold leading-none">2</div>
            <div className="text-[10px] text-gray-400">ABC</div>
          </div>
        </KeypadButton>
        <KeypadButton onClick={() => onKeyPress('3')}>
          <div className="text-center">
            <div className="text-lg font-bold leading-none">3</div>
            <div className="text-[10px] text-gray-400">DEF</div>
          </div>
        </KeypadButton>

        {/* Row 2 */}
        <KeypadButton onClick={() => onKeyPress('4')}>
          <div className="text-center">
            <div className="text-lg font-bold leading-none">4</div>
            <div className="text-[10px] text-gray-400">GHI</div>
          </div>
        </KeypadButton>
        <KeypadButton onClick={() => onKeyPress('5')}>
          <div className="text-center">
            <div className="text-lg font-bold leading-none">5</div>
            <div className="text-[10px] text-gray-400">JKL</div>
          </div>
        </KeypadButton>
        <KeypadButton onClick={() => onKeyPress('6')}>
          <div className="text-center">
            <div className="text-lg font-bold leading-none">6</div>
            <div className="text-[10px] text-gray-400">MNO</div>
          </div>
        </KeypadButton>

        {/* Row 3 */}
        <KeypadButton onClick={() => onKeyPress('7')}>
          <div className="text-center">
            <div className="text-lg font-bold leading-none">7</div>
            <div className="text-[10px] text-gray-400">PQRS</div>
          </div>
        </KeypadButton>
        <KeypadButton onClick={() => onKeyPress('8')}>
          <div className="text-center">
            <div className="text-lg font-bold leading-none">8</div>
            <div className="text-[10px] text-gray-400">TUV</div>
          </div>
        </KeypadButton>
        <KeypadButton onClick={() => onKeyPress('9')}>
          <div className="text-center">
            <div className="text-lg font-bold leading-none">9</div>
            <div className="text-[10px] text-gray-400">WXYZ</div>
          </div>
        </KeypadButton>

        {/* Row 4 */}
        <KeypadButton onClick={() => onKeyPress('*')}>
          <div className="text-center">
            <div className="text-lg font-bold leading-none">*</div>
          </div>
        </KeypadButton>
        <KeypadButton onClick={() => onKeyPress('0')}>
          <div className="text-center">
            <div className="text-lg font-bold leading-none">0</div>
            <div className="text-[10px] text-gray-400">SPACE</div>
          </div>
        </KeypadButton>
        <KeypadButton onClick={() => onKeyPress('#')}>
          <div className="text-center">
            <div className="text-lg font-bold leading-none">#</div>
          </div>
        </KeypadButton>
        
      </div>
    </div>
  );
};

export default Keypad;
