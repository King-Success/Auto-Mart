(function logout() {
  const logoutButton = document.getElementById("logout");

  const logout = e => {
    e.preventDefault();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    if (localStorage.getItem("admin")) {
      localStorage.removeItem("admin");
    }
    const location = window.location.pathname;
    const file = location.substring(location.lastIndexOf("/"));
    window.location = file === "/index.html" ? "index.html" : "../index.html";
  };
  if (logoutButton) logoutButton.addEventListener("click", logout);
})();
