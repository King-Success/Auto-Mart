const logoutButton = document.getElementById('logout');

const logout = (e) => {
    e.preventDefault()
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    if (localStorage.getItem('admin')) {
        localStorage.removeItem('admin');
    }
    window.location = '../index.html';
}
logoutButton.addEventListener('click', logout);
