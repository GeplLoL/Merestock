import { store } from '../redux/store';

// API baasaadress toodete teenusele
const API_BASE = 'http://localhost:7023/api/Product';

// Laeb kõik tooted, saadab kaasa küpsised (näiteks refresh-tokeni)
export async function fetchProducts() {
  const res = await fetch(API_BASE, {
    credentials: 'include' // lubame saatma ja vastu võtma küpsiseid
  });
  if (!res.ok) 
    throw new Error(`Toodete laadimine ebaõnnestus: ${res.status}`);
  return res.json(); // tagastame JSON-objekti kujul toodete nimekirja
}

// Loob uue toote, kasutades CreateProductDto struktuuri
export async function createProduct(dto) {
  // Võtame salvestatud JWT-tokeni Reduxi olekust
  const token = store.getState().user.token;
  if (!token) 
    throw new Error('Pole tokenit – kasutaja pole sisselogitud');

  // POST-päring uue toote loomiseks
  const res = await fetch(API_BASE, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',    // saadame JSON-vormingus
      'Authorization': `Bearer ${token}`       // lisame päisesse Bearer-tokeni
    },
    body:    JSON.stringify(dto)               // muundame DTO stringiks
  });

  if (!res.ok) {
    // Kui vastus pole OK, loeme vea teksti ja viskame erandi
    const err = await res.text();
    throw new Error(`Toote loomine ebaõnnestus: ${res.status} – ${err}`);
  }
  return res.json(); // tagastame loodud toote andmed JSON-ina
}
