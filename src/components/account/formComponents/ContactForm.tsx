import TextField from "@/components/common/inputs/textField/TextField";

import {
  NewProfileFormData,
  FormDataChangeHandler,
} from "../createProfileStepper/CreateProfileStepper.types";

interface ContactFormProps {
  onChange: FormDataChangeHandler;
  data: NewProfileFormData;
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
