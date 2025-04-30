import api from './api';

export default {
  // Sisselogimine: POST /login, tagastab objekti, milles peab olema token
  login: async (email, password) => {
    const res = await api.post('/login', { email, password });
    console.log('login response.data:', res.data);
    const data = res.data;
    if (!data.token) {
      // Kui tokenit pole, viskame vea
      throw new Error(data.message || 'Vigased sisselogimise andmed');
    }
    return data;
  },

  // Registreerimine: POST /User/register, saadab e-posti ja parooli
  register: async (email, password) => {
    console.log('→ kutsume /User/register', { email, password });
    const res = await api.post('/User/register', { email, password });
    console.log('← /User/register vastus', res.data);
    return res.data;
  },

  // Tokeni uuendamine: GET /User/refresh, tagastab uue access ja refresh tokeni
  refresh: () =>
    api.get('/User/refresh')
       .then(res => res.data)
};
