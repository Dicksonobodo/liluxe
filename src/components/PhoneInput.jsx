import React, { useState } from 'react';

const PhoneInput = ({ value, onChange, error, label = "Phone Number" }) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (e) => {
    let input = e.target.value;

    // Remove all non-digits
    input = input.replace(/\D/g, '');

    // Remove leading 234 or 0 if user types it
    if (input.startsWith('234')) {
      input = input.substring(3);
    } else if (input.startsWith('0')) {
      input = input.substring(1);
    }

    // Limit to 10 digits
    input = input.substring(0, 10);

    onChange(input);
  };

  const displayValue = value ? `+234 ${value}` : '';

  return (
    <div className="w-full">
      <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          type="tel"
          value={focused ? value : displayValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="8012345678"
          className={`w-full px-4 py-3 border ${
            error ? 'border-red-500' : 'border-stone-300'
          } focus:outline-none focus:border-stone-900 transition-colors duration-200 bg-white`}
        />
        {!focused && !value && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
            +234
          </span>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-1 text-xs text-stone-500">
        Enter your number without the leading 0
      </p>
    </div>
  );
};

export default PhoneInput;