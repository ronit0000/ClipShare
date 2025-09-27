// Password strength indicator component
import React from 'react';

const PasswordStrengthIndicator = ({ password, className = '' }) => {
  const getStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'No password', color: 'gray' };
    
    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      numbers: /\d/.test(pwd),
      symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    const strengthLevels = {
      0: { label: 'No password', color: 'gray' },
      1: { label: 'Very weak', color: 'red' },
      2: { label: 'Weak', color: 'orange' },
      3: { label: 'Fair', color: 'yellow' },
      4: { label: 'Good', color: 'blue' },
      5: { label: 'Strong', color: 'green' }
    };
    
    return { score, ...strengthLevels[score], checks };
  };
  
  const strength = getStrength(password);
  
  const getColorClasses = (color) => {
    const colors = {
      gray: 'bg-gray-400 text-gray-700',
      red: 'bg-red-400 text-red-700',
      orange: 'bg-orange-400 text-orange-700',
      yellow: 'bg-yellow-400 text-yellow-700',
      blue: 'bg-blue-400 text-blue-700',
      green: 'bg-green-400 text-green-700'
    };
    return colors[color] || colors.gray;
  };
  
  if (!password) return null;
  
  return (
    <div className={`text-xs ${className}`}>
      {/* Strength bar */}
      <div className="flex space-x-1 mb-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${
              level <= strength.score 
                ? getColorClasses(strength.color).split(' ')[0]
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
      
      {/* Strength label */}
      <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getColorClasses(strength.color)}`}>
        {strength.label}
      </div>
      
      {/* Requirements checklist for weak passwords */}
      {strength.score < 3 && password.length > 0 && (
        <div className="mt-2 text-xs text-gray-400 space-y-0.5">
          <div className="text-gray-300 font-medium">Requirements:</div>
          <div className={strength.checks.length ? 'text-green-400' : 'text-gray-400'}>
            ✓ At least 8 characters
          </div>
          <div className={strength.checks.lowercase ? 'text-green-400' : 'text-gray-400'}>
            ✓ Lowercase letter
          </div>
          <div className={strength.checks.uppercase ? 'text-green-400' : 'text-gray-400'}>
            ✓ Uppercase letter
          </div>
          <div className={strength.checks.numbers ? 'text-green-400' : 'text-gray-400'}>
            ✓ Number
          </div>
          <div className={strength.checks.symbols ? 'text-green-400' : 'text-gray-400'}>
            ✓ Special character
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;