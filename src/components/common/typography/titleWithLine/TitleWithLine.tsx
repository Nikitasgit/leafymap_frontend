import React from "react";
import styles from "./TitleWithLine.module.scss";

type TitleWithLineProps = {
  children: React.ReactNode;
  className?: string;
};

const TitleWithLine = ({ children, className = "" }: TitleWithLineProps) => {
  return (
    <div className={styles.container}>
      <h3 className={className || styles.title}>{children}</h3>
      <div className={styles.line}></div>
    </div>
  );
};

export default TitleWithLine;
