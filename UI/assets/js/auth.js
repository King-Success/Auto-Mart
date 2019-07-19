/* eslint-disable no-console */
(function auth() {
  const userToken = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("admin");

  if (isAdmin) {
    const profile = document.getElementById("profile");
    if (profile) profile.style.display = "none";
  }

  const validateToken = token => {
    if (!token) window.location = "login.html";
    if (token) {
      const data = {
        token
      };
      const config = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
      const url =
        "https://andela-auto-mart-staging.herokuapp.com/api/v1/auth/validateToken";
      fetch(url, config)
        .then(res => res.json())
        .then(result => {
          if (result.status === 200) {
            return true;
          }
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          if (localStorage.getItem("admin")) {
            localStorage.removeItem("admin");
          }
          window.location = "login.html";
          return false;
        })
        .catch(err => {
          console.log(err);
          return false;
        });
    }
  };

  validateToken(userToken);
})();
