const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const signupButton = document.getElementById("signup-button");
const spinner = document.getElementById("spinner");
const error = document.getElementById("error");
const success = document.getElementById("success");

const wipeAlert = () => {
  spinner.style.display = "none";
  error.style.display = "none";
  success.style.display = "none";
};

const createAccount = data => {
  const config = {
    method: "POST",
    body: data,
    headers: { "Content-Type": "application/json" }
  };
  const url = "https://andela-auto-mart.herokuapp.com/api/v1/auth/signup";
  fetch(url, config)
    .then(res => res.json())
    .then(result => {
      if (result.status !== 201) {
        wipeAlert();
        error.style.display = "block";
        /* eslint-disable indent */
        error.textContent = result.message
          ? result.message
          : result.error
          ? result.error
          : result.errors
          ? result.errors[0]
          : "";
        return false;
      }
      const { data } = result;
      const { token, user } = data[0];
      wipeAlert();
      success.style.display = "block";
      success.textContent = "Account created successfully";
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.isadmin) {
        localStorage.setItem("admin", user.isadmin);
        window.location.replace("all-cars.html");
      } else {
        window.location.replace("all-cars.html");
      }
      return false;
    })
    .catch(err => {
      /* eslint-disable no-console */
      console.log(err);
    });
};

const validator = () => {
  if (firstname.value === "") {
    wipeAlert();
    error.style.display = "block";
    error.textContent = "First name is required";
    firstname.focus();
    return false;
  }

  if (lastname.value === "") {
    wipeAlert();
    error.style.display = "block";
    error.textContent = "Last name is required";
    lastname.focus();
    return false;
  }

  if (email.value === "") {
    wipeAlert();
    error.style.display = "block";
    error.textContent = "Email is required";
    email.focus();
    return false;
  }

  if (phone.value === "") {
    wipeAlert();
    error.style.display = "block";
    error.textContent = "Phone is required";
    phone.focus();
    return false;
  }

  if (address.value === "") {
    wipeAlert();
    error.style.display = "block";
    error.textContent = "Address is required";
    address.focus();
    return false;
  }

  if (password.value === "") {
    wipeAlert();
    error.style.display = "block";
    error.textContent = "Password is required";
    password.focus();
    return false;
  }

  if (confirmPassword.value === "") {
    wipeAlert();
    error.style.display = "block";
    error.textContent = "Confirm password is required";
    confirmPassword.focus();
    return false;
  }

  if (password.value !== confirmPassword.value) {
    wipeAlert();
    error.style.display = "block";
    error.textContent = "Confirm password must be the same as password";
    confirmPassword.focus();
    return false;
  }
  return false;
};

const handler = e => {
  e.preventDefault();
  wipeAlert();
  spinner.style.display = "inline-block";
  validator();
  let data = {
    firstname: firstname.value,
    lastname: lastname.value,
    email: email.value,
    phone: phone.value,
    address: address.value,
    password: password.value
  };
  data = JSON.stringify(data);
  createAccount(data);
};

signupButton.addEventListener("click", handler);
