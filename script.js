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
        // Create auth object with expiration (30 minutes)
        const authObj = {
          username: user.username,
          fullname: user.fullname,
          expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutes from now
        };
        localStorage.setItem('mybrand_auth', JSON.stringify(authObj));
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
      localStorage.removeItem('mybrand_auth');
      alert('You have been logged out successfully.');
      window.location.href = 'index.html';
    });
  }
  
  // Check auth status on resume page
  if (window.location.pathname.includes('resume.html')) {
    const authData = localStorage.getItem('mybrand_auth');
    if (!authData) {
      window.location.href = 'login.html';
      return;
    }
    
    try {
      const authObj = JSON.parse(authData);
      // Check if token has expired
      if (Date.now() > authObj.expiresAt) {
        localStorage.removeItem('mybrand_auth');
        window.location.href = 'login.html';
        return;
      }
    } catch (e) {
      localStorage.removeItem('mybrand_auth');
      window.location.href = 'login.html';
    }
  }
});
