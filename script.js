document.addEventListener('DOMContentLoaded', function () {

  // Register form
const reg = document.getElementById('registerForm');
if (reg) {
  reg.addEventListener('submit', function (ev) {
    ev.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm_password').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || '';
    const dob = document.getElementById('dob').value;

    const msg = document.getElementById('regMsg');

    if (!fullname || !username || !password) {
      msg.textContent = 'Please fill required fields.';
      msg.className = 'text-danger';
      return;
    }
    if (password !== confirm) {
      msg.textContent = 'Passwords do not match.';
      msg.className = 'text-danger';
      return;
    }

    // Check if user already exists
    const existingUser = JSON.parse(localStorage.getItem('mybrand_user'));
    if (existingUser && existingUser.username === username) {
      msg.textContent = 'User already registered. Redirecting to login...';
      msg.className = 'text-danger';
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1200);
      return;
    }

    // Save new user (with password)
    const user = { fullname, username, password, gender, dob };
    localStorage.setItem('mybrand_user', JSON.stringify(user));

    msg.textContent = 'Registered successfully! Redirecting to sign in...';
    msg.className = 'text-success';
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  });
}


  // Login
  const login = document.getElementById('loginForm');
  if (login) {
    login.addEventListener('submit', function (ev) {
      ev.preventDefault();
      const loginU = document.getElementById('loginUsername').value.trim().toLowerCase();
      const loginP = document.getElementById('loginPassword').value;
      const msg = document.getElementById('loginMsg');

      const stored = localStorage.getItem('mybrand_user');
      if (!stored) {
        msg.textContent = 'No registered user found. Please register first.';
        msg.className = 'text-danger';
        return;
      }
      const user = JSON.parse(stored);
      if (user.username === loginU && user.password === loginP) {
        // Generate a simple token (insecure but demonstrates server-side concept)
        const token = btoa(JSON.stringify({ username: user.username, fullname: user.fullname, exp: Date.now() + 3600000 })); // 1 hour expiry
        // Store token in sessionStorage instead of localStorage for better security
        sessionStorage.setItem('mybrand_token', token);
        msg.textContent = 'Login successful! Redirecting to your resume...';
        msg.className = 'text-success';
        setTimeout(() => { window.location.href = 'resume.html'; }, 700);
      } else {
        msg.textContent = 'Invalid username or password.';
        msg.className = 'text-danger';
      }
    });
  }

  // Logout logic (button lives on resume page header)
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      sessionStorage.removeItem('mybrand_token');
      alert('You have been logged out successfully.');
      window.location.href = 'index.html';
    });
  }
  
  // Protect resume.html by checking for valid token
  if (window.location.pathname.includes('resume.html')) {
    const token = sessionStorage.getItem('mybrand_token');
    if (!token) {
      alert('Unauthorized access. Please log in.');
      window.location.href = 'login.html';
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[0])); // Simple decode (not production safe)
      if (payload.exp < Date.now()) {
        throw new Error('Token expired');
      }
    } catch (e) {
      alert('Session expired or invalid. Please log in again.');
      sessionStorage.removeItem('mybrand_token');
      window.location.href = 'login.html';
      return;
    }
  }
});
