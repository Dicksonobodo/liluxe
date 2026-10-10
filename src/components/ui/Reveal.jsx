import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from './motion';

// Fades content up once it scrolls into view
const Reveal = ({ as = 'div', delay, className, children, ...props }) => {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      custom={delay}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Reveal;
