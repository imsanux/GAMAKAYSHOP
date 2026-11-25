'use client';

import React from 'react';
import { CustomAmountConfig } from '@/lib/supabase';

interface CustomAmountSelectorProps {
  config: CustomAmountConfig;
  isActive: boolean;
  rawValue: string;
  isValid: boolean;
  calculatedPrice: number;
  error: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onActivate: () => void;
  onChangeValue: (digitsOnly: string) => void;
}

export default function CustomAmountSelector({
  config,
  isActive,
  rawValue,
  isValid,
  calculatedPrice,
  error,
  inputRef,
  onActivate,
  onChangeValue,
}: CustomAmountSelectorProps) {
  const showInvalid = Boolean(error) || (isActive && rawValue !== '' && !isValid);

  return (
    <div
      id="custom-amount"
      className="pdp-custom-card"
      data-active={isActive}
      onClick={() => {
        if (!isActive) {
          onActivate();
          inputRef.current?.focus();
        }
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          marginBottom: '10px',
          flexWrap: 'wrap',
        }}
      >
        <label
          htmlFor="pdp-custom-amount-input"
          style={{ fontSize: '0.84rem', fontWeight: 600, color: '#181818', cursor: 'pointer' }}
        >
          {config.label || `Custom ${config.currency_label} amount`}
        </label>
        <span className="tabular-nums" style={{ fontSize: '0.76rem', fontWeight: 500, color: '#635D57' }}>
          {config.currency_symbol}{config.min.toLocaleString()} – {config.currency_symbol}{config.max.toLocaleString()}
        </span>
      </div>

      <div className="pdp-custom-input-wrap" data-invalid={showInvalid}>
        <span className="pdp-custom-prefix" aria-hidden="true">
          {config.currency_symbol}
        </span>
        <input
          ref={inputRef}
          id="pdp-custom-amount-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={rawValue}
          onFocus={onActivate}
          onChange={(e) => {
            const digitsOnly = e.target.value.replace(/[^\d]/g, '').slice(0, 5);
            onChangeValue(digitsOnly);
          }}
          placeholder={`${config.min} – ${config.max}`}
          aria-invalid={showInvalid}
          aria-describedby="pdp-custom-amount-help"
          className="pdp-custom-input tabular-nums"
        />
        <span className="pdp-custom-preview tabular-nums">
          {isValid ? `Rs. ${calculatedPrice.toLocaleString()}` : config.currency_label}
        </span>
      </div>

      {showInvalid ? (
        <p
          id="pdp-custom-amount-help"
          role="alert"
          style={{ fontSize: '0.78rem', color: '#B91C1C', fontWeight: 500, margin: '8px 0 0' }}
        >
          {error || `Enter an amount between ${config.currency_symbol}${config.min.toLocaleString()} and ${config.currency_symbol}${config.max.toLocaleString()}.`}
        </p>
      ) : (
        <p id="pdp-custom-amount-help" style={{ fontSize: '0.76rem', color: '#635D57', margin: '8px 0 0' }}>
          Type any whole {config.currency_label} amount and your NPR price calculates automatically.
        </p>
      )}
    </div>
  );
}
