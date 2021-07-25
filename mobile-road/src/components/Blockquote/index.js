import React from 'react';
import './Blockquote.css';

export default ({ children }) => {
  return (
    <blockquote className="Blockquote">{children}</blockquote>
  );
};