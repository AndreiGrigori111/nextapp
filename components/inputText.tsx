import { Menubar } from 'primereact/menubar';
import { InputSwitch } from 'primereact/inputswitch';
import { PrimeReactContext } from 'primereact/api';
import { InputTextarea } from 'primereact/inputtextarea';
import { useContext, useState } from 'react';

export default function InputText({ text, id, field,  handleEdit }) {
    const [inputText, setInputText] = useState(text)
    
  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleBlur = () => {
    handleEdit(id, field, inputText);
  };

  return (
    <InputTextarea
      value={inputText}
      onChange={handleChange}
      onBlur={handleBlur}
      autoResize
    />
  );
}
    
