import TextField from "@/components/common/inputs/textField/TextField";

import {
  FormData,
  FormDataChangeHandler,
} from "../../../CreateProfileStepper.types";

interface ContactFormProps {
  onChange: FormDataChangeHandler;
  data: FormData;
  disabled?: boolean;
}

const ContactForm = ({ onChange, data, disabled }: ContactFormProps) => {
  return (
    <>
      <TextField value={data.phone} onChange={onChange} name="phone" />
      <TextField
        value={data.email}
        onChange={onChange}
        name="email"
        disabled={disabled}
      />
      <TextField value={data.website} onChange={onChange} name="website" />
    </>
  );
};

export default ContactForm;
