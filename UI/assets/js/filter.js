
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
