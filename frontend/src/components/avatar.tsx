import React from 'react';

// Utility function to generate initials
const getInitials = (name: string) => {
  const names = name.split(' ');
  return names.map(name => name.charAt(0)).join('').toUpperCase();
};

// Utility function to generate random background color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Avatar Component
const AvatarInitials = ({ userName = 'Unknown User', size = 50, textColor = '#fff' }) => {
  // Generate initials
  const initials = getInitials(userName);

  // Generate random background color
  const backgroundColor = getRandomColor();

  // Inline style for avatar
  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor,
    color: textColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${size / 2}px`,
    fontWeight: 'bold',
  };

  return (
    <div style={avatarStyle}>
      {initials}
    </div>
  );
};

export default AvatarInitials;
