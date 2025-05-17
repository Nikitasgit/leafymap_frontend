import TextField from "@/components/common/inputs/textField/TextField";
import { FormDataChangeHandler } from "../../../CreateProfileStepper";
import { FormData } from "../../../CreateProfileStepper.types";

interface ContactFormProps {
  onChange: FormDataChangeHandler;
  data: FormData;
}

const ContactForm = ({ onChange, data }: ContactFormProps) => {
  return (
    <>
      <TextField value={data.phone} onChange={onChange} name="phone" />
      <TextField value={data.email} onChange={onChange} name="email" />
      <TextField value={data.website} onChange={onChange} name="website" />
    </>
  );
};

export default ContactForm;
