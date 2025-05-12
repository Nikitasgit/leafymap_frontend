import React from "react";

type RadioProps = {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Radio: React.FC<RadioProps> = ({
  label,
  name,
  value,
  checked,
  onChange,
}) => {
  const id = `${name}-${value}`;

  return (
    <div>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default Radio;
