import React from "react";
import styles from "./EmptyState.module.scss";
import Text from "../../typography/Text";

const EmptyState = ({
  title,
  icon,
  description,
  button,
}: {
  title: string;
  icon?: React.ReactNode;
  description?: string;
  button?: React.ReactNode;
}) => {
  return (
    <div className={styles.emptyState}>
      {icon && icon}
      <Text className={styles.title} as="p">
        {title}
      </Text>
      {description && (
        <Text className={styles.description} as="p">
          {description}
        </Text>
      )}
      {button && button}
    </div>
  );
};

export default EmptyState;
