import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface ButtonProps {
  label: string;
  onClick: () => void;
  icon?: IconDefinition;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {label}
    </button>
  );
};

export default Button; 