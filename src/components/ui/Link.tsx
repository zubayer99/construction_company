import React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  onClick?: () => void;
}

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className = '',
  target,
  rel,
  onClick,
  ...props
}) => {
  const isExternal = href.startsWith('http');
  
  return (
    <a
      href={href}
      className={className}
      target={isExternal ? '_blank' : target}
      rel={isExternal ? 'noopener noreferrer' : rel}
      onClick={onClick}
      {...props}
    >
      {children}
    </a>
  );
};