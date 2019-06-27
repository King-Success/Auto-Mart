const email = document.getElementById('email');
const password = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const spinner = document.getElementById('spinner');
const error = document.getElementById('error');
const success = document.getElementById('success');

const wipeAlert = () => {
  spinner.style.display = 'none';
  error.style.display = 'none';
  success.style.display = 'none';
}

const login = (data) => {
  const config = {
    method: 'POST',
    body: data,
    headers: { 'Content-Type': 'application/json' }
  };
  const url = 'https://andela-auto-mart.herokuapp.com/api/v1/auth/login';
  fetch(url, config)
    .then(res => res.json())
    .then((result) => {
      if (result.error || !result.data) {
        console.log(result)
        wipeAlert()
        error.style.display = 'block'
        error.textContent = result.message ? result.message : result.error ? result.error : result.errors ? result.errors[0] : '';
        return false
      }
      const { data } = result;
      const { token, user } = data[0];
      wipeAlert()
      success.style.display = 'block'
      success.textContent = 'Login successful';
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (user.isadmin) {
        localStorage.setItem('admin', user.isadmin);
        window.location.replace('all-cars.html');
      } else {
        window.location.replace('profile.html');
      }

    })
    .catch((err) => {
      console.log(err)
    });

}

const validator = () => {
  if (email.value === '') {
    wipeAlert();
    error.style.display = 'block'
    error.textContent = 'Email is required';
    email.focus();
    return false;
  }

  if (password.value === '') {
    wipeAlert();
    error.style.display = 'block'
    error.textContent = 'Password is required';
    password.focus();
    return false;
  }
}

const handler = (e) => {
  e.preventDefault();
  wipeAlert();
  spinner.style.display = 'inline-block';
  validator()
  let data = {
    email: email.value,
    password: password.value
  }
  data = JSON.stringify(data)
  login(data)
}

loginButton.addEventListener('click', handler);
