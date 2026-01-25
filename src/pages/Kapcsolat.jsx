// CSS import

import './Kapcsolat.css';

function Kapcsolat() {
  return (
    <main className="container my-5">
      <h1 className="contacth1">Kapcsolat</h1>
      <div className="contact-info">
        <div className="contact-row">
          <span className="label">Név:</span>
          <span className="value">Sipos Julianna</span>
        </div>
        <div className="contact-row">
          <span className="label">Email:</span>
          <span className="value">info@lunara.hu</span>
        </div>
        <div className="contact-row">
          <span className="label">Telefon:</span>
          <span className="value">+36 30 123 4567</span>
        </div>
      </div>
    </main>
  )
}

export default Kapcsolat;





