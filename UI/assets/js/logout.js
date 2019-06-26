const logoutButton = document.getElementById('logout');

const logout = (e) => {
    console.log('yaaa')
    e.preventDefault()
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    if (localStorage.getItem('admin')) {
        localStorage.removeItem('admin');
    }
    window.location = '../index.html';
}
logoutButton.addEventListener('click', logout);
