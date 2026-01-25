import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CheckOutPage.css";

const STEPS = [
  { key: "contact", label: "Kapcsolat" },
  { key: "shipping", label: "Szállítás" },
  { key: "payment", label: "Fizetés" },
];

// --- helpers ---
const onlyDigits = (s) => (s || "").replace(/\D/g, "");
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((email || "").trim());
const isValidPhoneHU = (phone) => {
  const d = onlyDigits(phone);
  // engedjük: 9-12 számjegy (HU +36 esetén több is lehet)
  return d.length >= 9 && d.length <= 12;
};
const isValidZipHU = (zip) => /^\d{4}$/.test((zip || "").trim());

function formatCardNumber(value) {
  const digits = onlyDigits(value).slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(value) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}
function isValidExpiry(mmYY) {
  const v = (mmYY || "").trim();
  if (!/^\d{2}\/\d{2}$/.test(v)) return false;
  const [mmStr, yyStr] = v.split("/");
  const mm = Number(mmStr);
  const yy = Number(yyStr);
  if (mm < 1 || mm > 12) return false;

  const now = new Date();
  const curYY = now.getFullYear() % 100;
  const curMM = now.getMonth() + 1;

  if (yy < curYY) return false;
  if (yy === curYY && mm < curMM) return false;
  return true;
}
function luhnCheck(cardDigits) {
  // egyszerű Luhn ellenőrzés
  const s = (cardDigits || "").replace(/\D/g, "");
  if (s.length < 13 || s.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let n = parseInt(s[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  const total = subtotal;

  const [step, setStep] = useState(0);

  // touched: akkor mutasson piros hibát, ha már próbált továbblépni / hozzányúlt
  const [touched, setTouched] = useState({});

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    zip: "",
    address: "",
    note: "",
    paymentMethod: "card", // card | applepay
    cardType: "visa",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const setField = (name, value) => setForm((p) => ({ ...p, [name]: value }));
  const touch = (name) => setTouched((p) => ({ ...p, [name]: true }));

  const onCardNumberChange = (e) => setField("cardNumber", formatCardNumber(e.target.value));
  const onExpiryChange = (e) => setField("expiry", formatExpiry(e.target.value));
  const onCvcChange = (e) => setField("cvc", onlyDigits(e.target.value).slice(0, 4));

  // --- VALIDÁCIÓK mezőszinten ---
  const errors = useMemo(() => {
    const e = {};

    // contact
    if (!form.fullName.trim() || form.fullName.trim().length < 2) e.fullName = "Add meg a teljes neved.";
    if (!isValidEmail(form.email)) e.email = "Adj meg egy érvényes e-mail címet.";
    if (form.phone.trim() && !isValidPhoneHU(form.phone)) e.phone = "Adj meg érvényes telefonszámot.";

    // shipping
    if (!form.city.trim()) e.city = "Add meg a várost.";
    if (!isValidZipHU(form.zip)) e.zip = "Az irányítószám 4 számjegy.";
    if (!form.address.trim() || form.address.trim().length < 3) e.address = "Add meg a címet (utca, házszám).";

    // payment
    if (form.paymentMethod === "card") {
      if (!form.cardName.trim() || form.cardName.trim().length < 2) e.cardName = "Add meg a kártyán szereplő nevet.";
      const digits = onlyDigits(form.cardNumber);
      if (!luhnCheck(digits)) e.cardNumber = "Érvénytelen kártyaszám.";
      if (!isValidExpiry(form.expiry)) e.expiry = "Érvénytelen lejárat (MM/YY).";
      if (!(form.cvc.trim().length === 3 || form.cvc.trim().length === 4)) e.cvc = "CVC 3-4 számjegy.";
    }

    return e;
  }, [form]);

  const stepValid = useMemo(() => {
    if (step === 0) return !errors.fullName && !errors.email && !errors.phone;
    if (step === 1) return !errors.city && !errors.zip && !errors.address;
    if (step === 2) {
      if (form.paymentMethod === "applepay") return true;
      return !errors.cardName && !errors.cardNumber && !errors.expiry && !errors.cvc;
    }
    return false;
  }, [step, errors, form.paymentMethod]);

  const canPay = useMemo(() => {
    const contactOK = !errors.fullName && !errors.email && !errors.phone;
    const shipOK = !errors.city && !errors.zip && !errors.address;
    const payOK =
      form.paymentMethod === "applepay"
        ? true
        : !errors.cardName && !errors.cardNumber && !errors.expiry && !errors.cvc;
    return contactOK && shipOK && payOK;
  }, [errors, form.paymentMethod]);

  const next = () => {
    // jelöljük touched-nek a step mezőit, hogy látszódjanak a hibák
    if (step === 0) setTouched((p) => ({ ...p, fullName: true, email: true, phone: true }));
    if (step === 1) setTouched((p) => ({ ...p, city: true, zip: true, address: true }));
    if (step === 2) setTouched((p) => ({ ...p, cardName: true, cardNumber: true, expiry: true, cvc: true }));

    if (!stepValid) return;
    setStep((s) => Math.min(s + 1, 2));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handlePay = () => {
    // touch all payment fields
    setTouched((p) => ({ ...p, cardName: true, cardNumber: true, expiry: true, cvc: true }));
    if (!canPay) return;

    alert("Fizetés (demo). Valódi fizetés backend + szolgáltató után.");
  };

  if (cartItems.length === 0) {
    return (
      <main className="checkout">
        <div className="checkoutShell">
          <div className="checkoutGrid">
            <section className="checkoutPanel">
              <h1 className="checkoutTitle">Pénztár</h1>
              <p className="muted">A kosarad üres.</p>
              <button className="btnPrimary" onClick={() => navigate("/")}>
                Vissza a termékekhez
              </button>
            </section>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout">
      <div className="checkoutShell">
        <div className="checkoutGrid">
          {/* BAL */}
          <section className="checkoutPanel">
            <div className="checkoutTop">
              <h1 className="checkoutTitle">Pénztár</h1>
              <Link className="linkBack" to="/">
                ← Vásárlás folytatása
              </Link>
            </div>

            {/* Step jelző (NEM kattintható) */}
            <div className="stepHeader" aria-label="Lépések">
              {STEPS.map((s, idx) => (
                <div
                  key={s.key}
                  className={`stepItem ${idx === step ? "active" : ""} ${idx < step ? "done" : ""}`}
                >
                  <div className="stepDot">{idx + 1}</div>
                  <div className="stepLabel">{s.label}</div>
                </div>
              ))}
            </div>

            {/* 1) Kapcsolat */}
            {step === 0 && (
              <div className="card">
                <div className="cardHead">
                  <div className="cardBadge">1</div>
                  <div>
                    <div className="cardTitle">Kapcsolat</div>
                    <div className="cardSub">Név, e-mail, telefon</div>
                  </div>
                </div>

                <div className="cardBody">
                  <div className="field">
                    <label>Név*</label>
                    <input
                      value={form.fullName}
                      onChange={(e) => setField("fullName", e.target.value)}
                      onBlur={() => touch("fullName")}
                      placeholder="Teljes név"
                      className={touched.fullName && errors.fullName ? "invalid" : ""}
                    />
                    {touched.fullName && errors.fullName && <div className="err">{errors.fullName}</div>}
                  </div>

                  <div className="grid2">
                    <div className="field">
                      <label>Email*</label>
                      <input
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        onBlur={() => touch("email")}
                        placeholder="email@domain.hu"
                        className={touched.email && errors.email ? "invalid" : ""}
                      />
                      {touched.email && errors.email && <div className="err">{errors.email}</div>}
                    </div>

                    <div className="field">
                      <label>Telefon</label>
                      <input
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        onBlur={() => touch("phone")}
                        placeholder="+36..."
                        className={touched.phone && errors.phone ? "invalid" : ""}
                      />
                      {touched.phone && errors.phone && <div className="err">{errors.phone}</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2) Szállítás */}
            {step === 1 && (
              <div className="card">
                <div className="cardHead">
                  <div className="cardBadge">2</div>
                  <div>
                    <div className="cardTitle">Szállítás</div>
                    <div className="cardSub">Cím adatok</div>
                  </div>
                </div>

                <div className="cardBody">
                  <div className="grid2">
                    <div className="field">
                      <label>Város*</label>
                      <input
                        value={form.city}
                        onChange={(e) => setField("city", e.target.value)}
                        onBlur={() => touch("city")}
                        placeholder="Budapest"
                        className={touched.city && errors.city ? "invalid" : ""}
                      />
                      {touched.city && errors.city && <div className="err">{errors.city}</div>}
                    </div>

                    <div className="field">
                      <label>Irányítószám*</label>
                      <input
                        value={form.zip}
                        onChange={(e) => setField("zip", onlyDigits(e.target.value).slice(0, 4))}
                        onBlur={() => touch("zip")}
                        placeholder="1011"
                        inputMode="numeric"
                        className={touched.zip && errors.zip ? "invalid" : ""}
                      />
                      {touched.zip && errors.zip && <div className="err">{errors.zip}</div>}
                    </div>
                  </div>

                  <div className="field">
                    <label>Cím (utca, házszám)*</label>
                    <input
                      value={form.address}
                      onChange={(e) => setField("address", e.target.value)}
                      onBlur={() => touch("address")}
                      placeholder="Utca, házszám, emelet..."
                      className={touched.address && errors.address ? "invalid" : ""}
                    />
                    {touched.address && errors.address && <div className="err">{errors.address}</div>}
                  </div>

                  <div className="field">
                    <label>Megjegyzés</label>
                    <textarea
                      value={form.note}
                      onChange={(e) => setField("note", e.target.value)}
                      placeholder="Pl. kapukód, egyéb..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3) Fizetés */}
            {step === 2 && (
              <div className="card">
                <div className="cardHead">
                  <div className="cardBadge">3</div>
                  <div>
                    <div className="cardTitle">Fizetés</div>
                    <div className="cardSub">Bankkártya vagy Apple Pay</div>
                  </div>
                </div>

                <div className="cardBody">
                  <div className="pillRow">
                    <button
                      type="button"
                      className={`pill ${form.paymentMethod === "card" ? "active" : ""}`}
                      onClick={() => setField("paymentMethod", "card")}
                    >
                      Bankkártya
                    </button>
                    <button
                      type="button"
                      className={`pill ${form.paymentMethod === "applepay" ? "active" : ""}`}
                      onClick={() => setField("paymentMethod", "applepay")}
                    >
                      Apple Pay
                    </button>
                  </div>

                  {form.paymentMethod === "applepay" && (
                    <div className="infoBox">
                      Apple Pay később backend + szolgáltató után lesz éles. (Most UI.)
                    </div>
                  )}

                  {form.paymentMethod === "card" && (
                    <div className="payBox">
                      <div className="grid2">
                        <div className="field">
                          <label>Kártyatípus*</label>
                          <select
                            className="select"
                            value={form.cardType}
                            onChange={(e) => setField("cardType", e.target.value)}
                          >
                            <option value="visa">Visa</option>
                            <option value="mastercard">Mastercard</option>
                            <option value="amex">American Express</option>
                          </select>
                        </div>

                        <div className="field">
                          <label>Kártyára írt név*</label>
                          <input
                            value={form.cardName}
                            onChange={(e) => setField("cardName", e.target.value)}
                            onBlur={() => touch("cardName")}
                            placeholder="Pl. Kiss János"
                            className={touched.cardName && errors.cardName ? "invalid" : ""}
                          />
                          {touched.cardName && errors.cardName && <div className="err">{errors.cardName}</div>}
                        </div>
                      </div>

                      <div className="field">
                        <label>Kártyaszám*</label>
                        <input
                          value={form.cardNumber}
                          onChange={onCardNumberChange}
                          onBlur={() => touch("cardNumber")}
                          placeholder="1234 5678 9012 3456"
                          inputMode="numeric"
                          className={touched.cardNumber && errors.cardNumber ? "invalid" : ""}
                        />
                        {touched.cardNumber && errors.cardNumber && <div className="err">{errors.cardNumber}</div>}
                      </div>

                      <div className="grid2">
                        <div className="field">
                          <label>Lejárat (MM/YY)*</label>
                          <input
                            value={form.expiry}
                            onChange={onExpiryChange}
                            onBlur={() => touch("expiry")}
                            placeholder="MM/YY"
                            inputMode="numeric"
                            className={touched.expiry && errors.expiry ? "invalid" : ""}
                          />
                          {touched.expiry && errors.expiry && <div className="err">{errors.expiry}</div>}
                        </div>

                        <div className="field">
                          <label>CVC*</label>
                          <input
                            value={form.cvc}
                            onChange={onCvcChange}
                            onBlur={() => touch("cvc")}
                            placeholder="123"
                            inputMode="numeric"
                            className={touched.cvc && errors.cvc ? "invalid" : ""}
                          />
                          {touched.cvc && errors.cvc && <div className="err">{errors.cvc}</div>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigáció (csak gombbal, nincs ugrálás) */}
            <div className="wizardNav">
              <button className="btnGhost" type="button" onClick={back} disabled={step === 0}>
                Vissza
              </button>

              {step < 2 ? (
                <button className="btnPrimary" type="button" onClick={next} disabled={!stepValid}>
                  Tovább
                </button>
              ) : (
                <button className="btnPrimary" type="button" onClick={handlePay} disabled={!canPay}>
                  Fizetés
                </button>
              )}
            </div>
          </section>

          {/* JOBB */}
          <aside className="summaryPanel">
            <div className="summaryCard">
              <div className="summaryHead">
                <div className="summaryTitle">Összegzés</div>
                <Link className="tinyLink" to="/">
                  Vissza
                </Link>
              </div>

              <div className="summaryList">
                {cartItems.map((item, idx) => (
                  <div key={item.id} className="summaryItem">
                    {idx !== 0 && <div className="divider" />}
                    <div className="sumRow">
                      <div className="sumImg">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="sumInfo">
                        <div className="sumName">{item.name}</div>
                        <div className="sumMeta">{item.quantity} db</div>
                      </div>
                      <div className="sumPrice">
                        {(item.price * item.quantity).toLocaleString("hu-HU")} Ft
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="totals">
                <div className="totRow">
                  <span>Részösszeg</span>
                  <span>{subtotal.toLocaleString("hu-HU")} Ft</span>
                </div>
                <div className="totRow total">
                  <span>Végösszeg</span>
                  <span>{total.toLocaleString("hu-HU")} Ft</span>
                </div>
                <div className="muted small">(Szállítási díj később jön.)</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
