import React from "react";
import Text from "../Text";
import styles from "./TitleWithLine.module.scss";

type TitleWithLineProps = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
};

const TitleWithLine = ({
  children,
  as = "h2",
  className = "",
}: TitleWithLineProps) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <Text as={as} className={styles.title}>
        {children}
      </Text>
      <div className={styles.line}></div>
    </div>
  );
};

export default TitleWithLine;
