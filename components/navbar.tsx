import { Menubar } from 'primereact/menubar';
import { InputSwitch } from 'primereact/inputswitch';
import { PrimeReactContext } from 'primereact/api';
import { useContext, useState } from 'react';

export default function Navbar() {
    const { changeTheme } = useContext(PrimeReactContext);
    const [checked, setChecked] = useState(true);

    const Theme = (theme: boolean) => {
        if (theme) {
          setChecked(theme)
          changeTheme?.('mdc-light-deeppurple', 'mdc-dark-deeppurple', 'app-theme', () => {console.log('orange')})
        }
        else {
          setChecked(theme)
          changeTheme?.('mdc-dark-deeppurple', 'mdc-light-deeppurple', 'app-theme', () => {console.log('green')})
        }
      };

    const start = (
        <img alt="logo" src="https://pics.craiyon.com/2023-06-06/b77cf7c857694ea1be2d402893587358.webp" height="100px" className="mr-4"></img>
      );
    
      const end = (
        <div className="flex justify-content-center align-items-center">
          <i className="pi pi-sun mx-2"></i>
            <InputSwitch checked={checked} onChange={(e) => Theme(e.value)} />
          <i className="pi pi-moon mx-2"></i>
        </div>
      );
    
      return <Menubar start={start} end={end} />;
}