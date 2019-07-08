const isAdmin = localStorage.getItem("admin");
if (!isAdmin) window.location.replace("unsold-cars.html");
(function allCars() {
  const carsGrid = document.getElementById("cars_grid");
  const alertBox = document.querySelector(".alert");
  const filterButton = document.getElementById("filter");
  const stateField = document.getElementById("state");
  const manufacturerField = document.getElementById("make");
  const bodyField = document.getElementById("body");
  const maxField = document.getElementById("max-price");
  const minField = document.getElementById("min-price");
  let isDisabled;
  const nodes = [
    {
      name: "State",
      target: stateField
    },
    {
      name: "Manufacturer",
      target: manufacturerField
    },
    {
      name: "Body",
      target: bodyField
    },
    {
      name: "MaxPrice",
      target: maxField
    },
    {
      name: "MinPrice",
      target: minField
    }
  ];

  alertBox.style.display = "block";

  const displayData = data => {
    let grid;
    data
      .sort((a, b) => a.id - b.id)
      .forEach(car => {
        /* eslint-disable no-undef, indent */
        grid = `<div class="grid">
              <div class="post">
              <a href="car.html?carId=${car.id}"style="height: 70%">
                  <img src="${car.mainimageurl}" alt="${
          car.model
        }" style="height: 100%">
          </a>
                  <div class="details">
                      <a href="">
                          <h2 class="title">${car.model.toUpperCase()} </h2>
                          <em style="color: green">&#8358; ${formatMoney(
                            car.price
                          )}</em>                                </a>
                  </div>
                  <div class="actions">
                      <a href=""><i class="fas fa-trash f-15" style="color: red"></i></a>
                      <a href=""><i class="far fa-eye f-15"><span class="f-13">10</span></i></a>
                      <a href=""><i class="far fa-user-circle f-15"></i></a>
                  </div>
              </div>`;
        /* eslint-disable  */

        carsGrid.insertAdjacentHTML("beforeend", grid);
      });
  };

  const token = localStorage.getItem("token");
  const url = "https://andela-auto-mart.herokuapp.com/api/v1/car";
  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };

  fetch(url, config)
    .then(res => res.json())
    .then(res => {
      alertBox.style.display = "none";
      carsGrid.innerHTML = "";
      if (res.status === 200) {
        const { data } = res;
        if (data.length) {
          displayData(data[0]);
          return false;
        }
        carsGrid.insertAdjacentHTML(
          "beforeend",
          '<p style="text-align: center;" >There currently isn\'t any advertisement to display</p>'
        );
        return false;
      }
      carsGrid.insertAdjacentHTML(
        "beforeend",
        '<p style="text-align: center;" >There currently isn\'t any advertisement to display</p>'
      );
      return false;
    })
    .catch(err => {
      console.log(err);
      alertBox.style.display = "none";
      carsGrid.innerHTML = "";
      carsGrid.insertAdjacentHTML(
        "beforeend",
        '<p style="text-align: center;">Oops, something happend, couldn\'t load adverts, check your internet and refresh page to reload'
      );
    });

  const getFilter = nodeList => {
    for (let i = 0; i < nodeList.length; i += 1) {
      const node = nodeList[i];
      let max;
      let min;
      if (node.target.value.length > 1) {
        switch (node.name) {
          case "MinPrice":
            max = nodeList.find(nde => nde.name === "MaxPrice");
            return {
              name: "Price",
              min: node.target.value,
              max: max.target.value
            };
          case "MaxPrice":
            min = nodeList.find(nde => nde.name === "MinPrice");
            return {
              name: "Price",
              max: node.target.value,
              min: min.target.value
            };
          default:
            return {
              name: node.name,
              value: node.target.value
            };
        }
      }
    }
    return false;
  };

  const filter = () => {
    carsGrid.innerHTML = "";
    alertBox.style.display = "block";
    const filterRes = getFilter(nodes);
    /* eslint-disable indent */
    const queryString =
      filterRes.name === "Price"
        ? `minPrice=${filterRes.min}&maxPrice=${filterRes.max}`
        : filterRes.name === "Body"
        ? `bodyType=${filterRes.value}`
        : `${filterRes.name.toLowerCase()}=${filterRes.value}`;
    const url = `https://andela-auto-mart.herokuapp.com/api/v1/car/getBy${
      filterRes.name === "Body" ? "bodyType" : filterRes.name
    }?status=Available&${queryString}`;
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    };
    /* eslint-disable */
    fetch(url, config)
      .then(res => res.json())
      .then(res => {
        alertBox.style.display = "none";
        if (res.status === 200) {
          const { data } = res;
          if (data.length) {
            displayData(data[0]);
            return false;
          }
          carsGrid.insertAdjacentHTML(
            "beforeend",
            '<p style="text-align: center;" >There currently isn\'t any advertisement to display</p>'
          );
          return false;
        }
        carsGrid.insertAdjacentHTML(
          "beforeend",
          '<p style="text-align: center;" >There currently isn\'t any advertisement that matches the filter you provided</p>'
        );
        return false;
      })
      .catch(err => {
        console.log(err);
        alertBox.style.display = "block";
        carsGrid.innerHTML = "";
        carsGrid.insertAdjacentHTML(
          "beforeend",
          '<p style="text-align: center;">Oops, something happend, couldn\'t load adverts, check your internet and refresh page to reload'
        );
      });
  };

  const disable = (event, nodes, except = "") => {
    /* eslint-disable no-param-reassign */
    nodes.forEach(node => {
      if (node.name != except && node.target !== event.target) {
        node.target.disabled = true;
        node.target.value = "";
        node.target.style.opacity = 0.4;
      }
    });
    isDisabled = true;
  };

  const unDisable = nodes => {
    if (isDisabled) {
      nodes.forEach(node => {
        node.target.disabled = false;
        node.target.style.opacity = 1;
      });
    }
  };

  stateField.addEventListener("change", e => disable(e, nodes));
  manufacturerField.addEventListener("change", e => disable(e, nodes));
  bodyField.addEventListener("change", e => disable(e, nodes));
  maxField.addEventListener("keydown", e => disable(e, nodes, "MinPrice"));
  minField.addEventListener("keydown", e => disable(e, nodes, "MaxPrice"));
  document.addEventListener("click", () => unDisable(nodes));
  filterButton.addEventListener("click", filter);
})();
