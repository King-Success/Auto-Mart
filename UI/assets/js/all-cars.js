(function allCars() {
    const carsGrid = document.getElementById('cars_grid');
    const alertBox = document.querySelector('.alert')
    const filterButton = document.getElementById('filter');
    const stateField = document.getElementById('state');
    const manufacturerField = document.getElementById('make');
    const bodyField = document.getElementById('body');
    const maxField = document.getElementById('max-price');
    const minField = document.getElementById('min-price');
    let isDisabled
    const nodes = [
        {
            name: 'State',
            target: stateField
        },
        {
            name: 'Manufacturer',
            target: manufacturerField
        },
        {
            name: 'Body',
            target: bodyField
        },
        {
            name: 'MaxPrice',
            target: maxField
        },
        {
            name: 'MinPrice',
            target: minField
        }
    ];

    alertBox.style.display = 'block';

    const token = localStorage.getItem('token');
    const url = 'https://andela-auto-mart.herokuapp.com/api/v1/car/getByStatus?status=Available';
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
            alertBox.style.display = 'none';
            carsGrid.innerHTML = ''
            if (res.status === 200) {
                const { data } = res;
                if (data.length) {
                    displayData(data[0])
                    return false
                } else {
                    carsGrid.insertAdjacentHTML('beforeend', '<p style="text-align: center;" >There currently isn\'t any advertisement to display</p>');
                    return false
                }
            } else {
                carsGrid.insertAdjacentHTML('beforeend', '<p style="text-align: center;" >There currently isn\'t any advertisement to display</p>');
            }
        })
        .catch((err) => {
            console.log(err);
            alertBox.style.display = 'none';
            carsGrid.innerHTML = ''
            carsGrid.insertAdjacentHTML('beforeend', '<p style="text-align: center;">Oops, something happend, couldn\'t load adverts, check your internet and refresh page to reload')
        });

    const getFilter = (nodes) => {
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i]
            if (node.target.value.length > 1) {
                console.dir(node.target)
                switch (node.name) {
                    case 'MinPrice':
                        const max = nodes.find(node => node.name === 'MaxPrice')
                        return {
                            name: 'Price',
                            min: node.target.value,
                            max: max.target.value

                        }
                    case 'MaxPrice':
                        const min = nodes.find(node => node.name === 'MinPrice')
                        return {
                            name: 'Price',
                            max: node.target.value,
                            min: min.target.value
                        }
                    default:
                        return {
                            name: node.name,
                            value: node.target.value
                        }
                }
            }
        }
    }

    const filter = () => {
        carsGrid.innerHTML = ''
        alertBox.style.display = 'block';
        const filter = getFilter(nodes)
        const queryString = filter.name === 'Price' ? `minPrice=${filter.min}&maxPrice=${filter.max}` : filter.name === 'Body' ? `bodyType=${filter.value}` : `${filter.name.toLowerCase()}=${filter.value}`
        const url = `https://andela-auto-mart.herokuapp.com/api/v1/car/getBy${filter.name === 'Body' ? 'bodyType' : filter.name}?status=Available&${queryString}`;
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
                alertBox.style.display = 'none';
                if (res.status === 200) {
                    const { data } = res;
                    if (data.length) {
                        displayData(data[0])
                        return false
                    } else {
                        carsGrid.insertAdjacentHTML('beforeend', '<p style="text-align: center;" >There currently isn\'t any advertisement to display</p>');
                        return false
                    }
                } else {
                    carsGrid.insertAdjacentHTML('beforeend', '<p style="text-align: center;" >There currently isn\'t any advertisement that matches the filter you provided</p>');
                }
            })
            .catch((err) => {
                console.log(err);
                alertBox.style.display = 'block';
                carsGrid.innerHTML = ''
                carsGrid.insertAdjacentHTML('beforeend', '<p style="text-align: center;">Oops, something happend, couldn\'t load adverts, check your internet and refresh page to reload')
            });
    }

    const disable = (event, nodes, except = '') => {
        nodes.forEach((node) => {
            if (node.name != except && node.target !== event.target) {
                node.target.disabled = true;
                node.target.value = '';
                node.target.style.opacity = 0.4;
            }
        })
        isDisabled = true;
    }

    const unDisable = (nodes) => {
        if (isDisabled) {
            nodes.forEach((node) => {
                node.target.disabled = false;
                node.target.style.opacity = 1;
            })
        }
    }

    const displayData = (data) => {
        let grid;
        data.sort((a, b) => a.id - b.id).forEach((car) => {
            grid = `<div class="grid">
            <div class="post">
                <img src="${car.mainimageurl}" alt="${car.model}">
                <div class="details">
                    <a href="">
                        <h2 class="title">${car.model.toUpperCase()} </h2>
                        <em style="color: green">&#8358; ${formatMoney(car.price)}</em>                                </a>
                </div>
                <div class="actions">
                    <a href=""><i class="fas fa-trash f-15" style="color: red"></i></a>
                    <a href=""><i class="far fa-eye f-15"><span class="f-13">10</span></i></a>
                    <a href=""><i class="far fa-user-circle f-15"></i></a>
                </div>
            </div>`;
            carsGrid.insertAdjacentHTML('beforeend', grid);
        });
    }

    stateField.addEventListener('change', (e) => disable(e, nodes))
    manufacturerField.addEventListener('change', (e) => disable(e, nodes))
    bodyField.addEventListener('change', (e) => disable(e, nodes))
    maxField.addEventListener('keydown', (e) => disable(e, nodes, 'MinPrice'))
    minField.addEventListener('keydown', (e) => disable(e, nodes, 'MaxPrice'))
    document.addEventListener('click', () => unDisable(nodes))
    filterButton.addEventListener('click', filter)
})()