import { useState } from 'react';
import * as CryptoJS from 'crypto-js';

function App() {
  const [textoPlano, setTextoPlano] = useState("");
  const [textoCifrado, setTextoCifrado] = useState("");
  const [textoDescifrado, setTextoDescifrado] = useState("");
  const [clave, setClave] = useState("12345678");
  const [error, setError] = useState("");

  const cifrar = () => {
    if (!textoPlano) {
      setError("Escribe un texto");
      return;
    }

    const resultado = CryptoJS.AES.encrypt(textoPlano, clave).toString();
    setTextoCifrado(resultado);
    setTextoDescifrado("");
    setError("");
  };

  const descifrar = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(textoCifrado, clave);
      const resultado = bytes.toString(CryptoJS.enc.Utf8);

      if (!resultado) {
        throw new Error();
      }

      setTextoDescifrado(resultado);
      setError("");
    } catch {
      setTextoDescifrado("");
      setError("Error al descifrar (clave o texto incorrecto)");
    }
  };

  return (
    <div>
      <h2>Cifrado AES</h2>

      <input
        type="text"
        placeholder="Clave"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Texto a cifrar"
        value={textoPlano}
        onChange={(e) => setTextoPlano(e.target.value)}
      />

      <br />

      <button onClick={cifrar}>Cifrar</button>

      <h4>Texto cifrado:</h4>

      <textarea
        placeholder="Texto cifrado"
        value={textoCifrado}
        onChange={(e) => setTextoCifrado(e.target.value)}
      />

      <br />

      <button onClick={descifrar}>Descifrar</button>

      <h4>Texto descifrado:</h4>
      <p>{textoDescifrado}</p>

      {error && <p>{error}</p>}
    </div>
  );
}

export default App;