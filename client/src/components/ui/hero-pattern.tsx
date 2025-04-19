import { ReactNode } from "react";

interface HeroPatternProps {
  children: ReactNode;
  className?: string;
}

const HeroPattern = ({ children, className = "" }: HeroPatternProps) => {
  return (
    <div className={`hero-pattern py-12 sm:py-16 ${className}`}>
      {children}
    </div>
  );
};

export default HeroPattern;
