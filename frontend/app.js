const API_URL = 'http://127.0.0.1:8000/';

const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
  return data;
};

const displayProfile = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) return;
  try {
    const data = await apiFetch('profile/', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    document.getElementById('profile-username').innerText = `Username: ${data.username}`;
    document.getElementById('profile-email').innerText = `Email: ${data.email}`;
    document.getElementById('profile-section').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

const register = async () => {
  const email = document.getElementById('register-email').value;
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  if (!email || !username || !password) {
    console.log('All fields are required!');
    return;
  }
  try {
    await apiFetch('register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    console.log('Registration successful!');
    await login(username, password);
  } catch (error) {
    console.log('Registration failed: ' + error.message);
  }
};

const login = async (user, pass) => {
  // Якщо параметри не передані, беремо значення з форми
  if (!user || !pass) {
    user = document.getElementById('login-username').value;
    pass = document.getElementById('login-password').value;
  }
  if (!user || !pass) {
    console.log('Please enter both username and password!');
    return;
  }
  try {
    const data = await apiFetch('login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
    });
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    console.log('Login successful!');
    displayProfile();
  } catch (error) {
    console.error('Login failed: ' + error.message);
  }
};

const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  console.log('Logged out');
  location.reload();
};

document.getElementById('register-button').onclick = register;
document.getElementById('login-button').onclick = login;
document.getElementById('logout-button').onclick = logout;

if (localStorage.getItem('access_token')) displayProfile();