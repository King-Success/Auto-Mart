(function profile() {
    const carsGrid = document.getElementById('cars-grid');
    const avatar = document.getElementById('avater');
    const user = document.getElementById('user-name');
    const priceField = document.getElementById('update-price');
    const updateButton = document.getElementById('submit-btn');
    const modalError = document.querySelector('.modal-error');
    const spinner = document.getElementById('spinner');

    spinner.style.display = 'inline-block';

    const nodes = [modalError]
    const fields = [priceField]
    const activeUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    avatar.style.background = user.passporturl || 'url(assets/img/avatar.png)';
    avatar.style.backgroundSize = 'cover'
    user.textContent = `${activeUser.firstname} ${activeUser.lastname}`;
    const url = 'https://andela-auto-mart.herokuapp.com/api/v1/car/history';
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    };
    fetch(url, config)
        .then(res => res.json())
        .then((res) => {
            carsGrid.innerHTML = ''
            if (res.status === 200) {
                const { data } = res;
                if (data.length) {
                    let grid;
                    data.sort((a, b) => a.id - b.id).forEach((car) => {
                        grid = `<div class="grid">
                    <div class="grid__image">
                        <img src="${car.mainimageurl}" alt="car image" data-image="${car.id}">
                    </div>
                    <div class="grid__description">
                        <div class="text">
                            <h1 class="title">${car.model.toUpperCase()}</h1>
                            <ul class="f-15">
                                <li><strong>body type</strong>: ${car.bodytype}</li>
                                <li><strong>state</strong>: ${car.state.toLowerCase()}</li>
                                <li><strong>manufacturer</strong>: ${car.manufacturer}</li>
                                <li><strong>posted on</strong>: ${formatDate(car.createdon)}</li>
                                <li><strong>price</strong>: <em class="price">N ${car.price}</em></li>
                            </ul>
                        </div>
                        <div class="actions">
                            <a href=""><i class="far fa-eye"> 0</i></a>
                            <a href=""><i class="fas fa-users"> ${car.status}</i></a>
                            <a onclick="toggleModal(event)" style="text-decoration: underline; cursor: pointer;"><i class="fas fa-edit" data-id="${car.id}"> update price</i></a>
                            <a class="sold" href=""data-mark="${car.id}><i class="fas fa-shopping-cart"> mark as sold</i></a>
                        </div>
                    </div>
                </div>`;
                        carsGrid.insertAdjacentHTML('beforeend', grid);

                    });
                    installModal()
                    updateButton.addEventListener('click', updatePrice);
                    return false
                } else {
                    carsGrid.insertAdjacentHTML('beforeend', '<p style="text-align: center;" >You currently have no advertisement to display</p>');
                    return false
                }
            } else {
                carsGrid.insertAdjacentHTML('beforeend', '<p style="text-align: center;" >You haven\'t posted an advert yet')
            }
        })
        .catch((err) => {
            console.log(err);
            carsGrid.innerHTML = ''
            carsGrid.insertAdjacentHTML('beforeend', '<p style="text-align: center;">Oops, something happend, couldn\'t load your adverts, check your internet and refresh page to reload')
        });


    const updatePrice = () => {
        wipeAlert(nodes, updateButton, 'update')
        const carId = clickModalEvent.target.getAttribute('data-id');
        updateButton.textContent = 'saving...'
        if (priceField.value === '') {
            wipeAlert(nodes);
            modalError.style.display = 'block'
            modalError.textContent = 'Price is required';
            priceField.focus();
            updateButton.textContent = 'update'
            return false;
        }
        const url = `https://andela-auto-mart.herokuapp.com/api/v1/car/${carId}/price`;
        const token = localStorage.getItem('token');
        const config = {
            method: 'PATCH',
            body: JSON.stringify({ price: priceField.value }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,

            }
        };
        fetch(url, config)
            .then(res => res.json())
            .then((result) => {
                if (result.status !== 200) {
                    wipeAlert(nodes, updateButton, 'update')
                    modalError.style.display = 'block'
                    modalError.textContent = result.message ? result.message : result.error ? result.error : result.errors ? result.errors[0] : '';
                    return false
                }
                wipeAlert(nodes, updateButton, 'update')
                wipeForm(fields);
                success.style.display = 'block';
                success.textContent = 'Price updated successfully';
                setTimeout(() => window.location.reload(true), 1000)
            })
            .catch((err) => {
                console.log(err)
            });
    }
})()