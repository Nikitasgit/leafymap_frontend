import React from "react";

type TextProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  children: React.ReactNode;
  className?: string;
};

const Text = ({ as: Component = "p", children, className = "" }: TextProps) => {
  return <Component className={className}>{children}</Component>;
};

export default Text;
