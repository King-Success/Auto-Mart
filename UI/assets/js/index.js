(function index() {
  const mainNav = document.getElementById("main__nav__menu");
  const navBarToggle = document.getElementById("navbar__toggle__btn");
  let user = localStorage.getItem("user");
  const isAdmin = localStorage.getItem("admin");

  if (user) {
    user = JSON.parse(user);
    const login = document.getElementById("login");
    const signin = document.getElementById("signup");
    if (login) {
      const location = window.location.pathname;
      const file = location.substring(location.lastIndexOf("/"));
      login.textContent = `Welcome, ${user.firstname}`;
      /* eslint-disable indent */
      login.href = isAdmin
        ? "#"
        : file === "/index.html"
        ? "UI/profile.html"
        : file === "/Auto-Mart"
        ? "UI/profile.html"
        : "profile.html";
    }
    if (signin) {
      signin.textContent = "Logout";
      signin.href = "#";
      signin.id = "logout";
    }
  }

  navBarToggle.addEventListener("click", () => {
    mainNav.classList.toggle("show");
  });
})();
