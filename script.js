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

    // Save new user
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
        // logged in (simple flag)
        localStorage.setItem('mybrand_auth', JSON.stringify({ username: user.username, fullname: user.fullname }));
        msg.textContent = 'Login successful! Redirecting to your resume...';
        msg.className = 'text-success';
        setTimeout(() => { window.location.href = 'resume.html'; }, 700);
      } else {
        msg.textContent = 'Invalid username or password.';
        msg.className = 'text-danger';
      }
    });
  }

  // Guard resume page - check auth flag
  const resumeContent = document.getElementById('resumeContent');
  if (resumeContent) {
    const auth = localStorage.getItem('mybrand_auth');
    if (!auth) {
      alert('You must be signed in to view the resume.');
      window.location.href = 'index.html';
    }
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
});