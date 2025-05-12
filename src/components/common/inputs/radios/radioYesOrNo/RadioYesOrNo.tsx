import React from "react";

type RadioYesOrNoProps = {
  name: string;
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  yesLabel?: string;
  noLabel?: string;
};

const RadioYesOrNo: React.FC<RadioYesOrNoProps> = ({
  name,
  label,
  value,
  onChange,
  yesLabel = "Oui",
  noLabel = "Non",
}) => {
  return (
    <fieldset>
      {label && <legend>{label}</legend>}
      <div>
        <label>
          <input
            type="radio"
            name={name}
            value="yes"
            checked={value === "yes"}
            onChange={onChange}
          />
          {yesLabel}
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            name={name}
            value="no"
            checked={value === "no"}
            onChange={onChange}
          />
          {noLabel}
        </label>
      </div>
    </fieldset>
  );
};

export default RadioYesOrNo;
