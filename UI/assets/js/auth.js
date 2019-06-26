const userToken = localStorage.getItem('token');

const validateToken = (token) => {
  if (!token) window.location = 'login.html';
  if (token) {
    const data = {
       token 
      };
    const config = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    const url = 'https://andela-auto-mart.herokuapp.com/api/v1/auth/validateToken';
    fetch(url, config)
      .then(res => res.json())
      .then((result) => {
        if (result.status === 200) {
          return true;
        }
        window.location = 'login.html';
      })
      .catch((err) => { 
        console.log(err)
        if (err) return false; 
      });
  }
};

validateToken(userToken);
