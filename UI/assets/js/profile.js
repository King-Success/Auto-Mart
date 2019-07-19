/* eslint-disable no-undef, no-unused-vars */
const updateStatus = e => {
  const carId = e.target.getAttribute("data-id");
  const status = e.target.getAttribute("data-status");
  const updateStatusLink = document.getElementById(`change-status-${carId}`);
  const newStatus = status === "Sold" ? "Available" : "Sold";
  const url = `https://andela-auto-mart-staging.herokuapp.com/api/v1/car/${carId}/status`;
  const token = localStorage.getItem("token");
  const config = {
    method: "PATCH",
    body: JSON.stringify({ status: newStatus }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  updateStatusLink.textContent = " updating...";
  fetch(url, config)
    .then(res => res.json())
    .then(result => {
      if (result.status === 200) {
        const statusDisplay = document.getElementById(
          `status-display-${carId}`
        );
        updateStatusLink.textContent = ` mark as ${status.toLowerCase()}`;
        statusDisplay.textContent = ` ${newStatus}`;
        e.target.setAttribute("data-status", newStatus);
        return false;
      }
      updateStatusLink.textContent = ` mark as ${
        status === "Sold" ? "available" : "sold"
      }`;
      return false;
    })
    .catch(err => {
      /* eslint-disable no-console */
      console.log(err);
      updateStatusLink.textContent = ` mark as ${
        status === "Sold" ? "available" : "sold"
      }`;
    });
};

(function profile() {
  const carsGrid = document.getElementById("cars-grid");
  const avatar = document.getElementById("avater");
  const user = document.getElementById("user-name");
  const priceField = document.getElementById("update-price");
  const updateButton = document.getElementById("submit-btn");
  const modalError = document.querySelector(".modal-error");
  const spinner = document.getElementById("spinner");

  spinner.style.display = "inline-block";

  const nodes = [modalError];
  const fields = [priceField];
  const activeUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  avatar.style.background = user.passporturl || "url(assets/img/avatar.png)";
  avatar.style.backgroundSize = "cover";
  user.textContent = `${activeUser.firstname} ${activeUser.lastname}`;

  const updatePrice = () => {
    wipeAlert(nodes, updateButton, "update");
    const carId = clickModalEvent.target.getAttribute("data-id");
    updateButton.textContent = "saving...";
    if (priceField.value === "") {
      wipeAlert(nodes);
      modalError.style.display = "block";
      modalError.textContent = "Price is required";
      priceField.focus();
      updateButton.textContent = "update";
      return false;
    }
    const url = `https://andela-auto-mart-staging.herokuapp.com/api/v1/car/${carId}/price`;
    const token = localStorage.getItem("token");
    const config = {
      method: "PATCH",
      body: JSON.stringify({ price: priceField.value }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    };
    fetch(url, config)
      .then(res => res.json())
      .then(result => {
        if (result.status !== 200) {
          wipeAlert(nodes, updateButton, "update");
          modalError.style.display = "block";
          /* eslint-disable indent */
          modalError.textContent = result.message
            ? result.message
            : result.error
            ? result.error
            : result.errors
            ? result.errors[0]
            : "";
          return false;
        }
        wipeAlert(nodes, updateButton, "update");
        wipeForm(fields);
        success.style.display = "block";
        success.textContent = "Price updated successfully";
        setTimeout(() => window.location.reload(true), 1000);
        return false;
      })
      .catch(err => {
        console.log(err);
      });
    return false;
  };

  const url = "https://andela-auto-mart-staging.herokuapp.com/api/v1/car/history";
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
      carsGrid.innerHTML = "";
      if (res.status === 200) {
        const { data } = res;
        if (data.length) {
          let grid;
          data
            .sort((a, b) => a.id - b.id)
            .forEach(car => {
              grid = `<div class="grid">
                    <div class="grid__image">
                        <img src="${
                          car.mainimageurl
                        }" alt="car image" data-image="${car.id}">
                    </div>
                    <div class="grid__description">
                        <div class="text">
                            <h1 class="title">${car.model.toUpperCase()}</h1>
                            <ul class="f-15">
                                <li><strong>body type</strong>: ${
                                  car.bodytype
                                }</li>
                                <li><strong>state</strong>: ${car.state.toLowerCase()}</li>
                                <li><strong>manufacturer</strong>: ${
                                  car.manufacturer
                                }</li>
                                <li><strong>posted on</strong>: ${formatDate(
                                  car.createdon
                                )}</li>
                                <li><strong>price</strong>: <em class="" style="color: green">&#8358; ${formatMoney(
                                  car.price
                                )}</em></li>
                            </ul>
                        </div>
                        <div class="actions">
                            <a><i class="far fa-eye"> 0</i></a>
                            <a><i class="fas fa-shopping-cart" id="status-display-${
                              car.id
                            }"> ${car.status}</i></a>
                            <a onclick="toggleModal(event)" style="text-decoration: underline; cursor: pointer;"><i class="fas fa-edit" data-id="${
                              car.id
                            }"> price</i></a>
                            <a onclick="updateStatus(event)" style="text-decoration: underline; cursor: pointer;" class="sold"><i class="fas fa-toggle-on" id="change-status-${
                              car.id
                            }" data-id="${car.id}" data-status="${
                car.status
              }"> mark as ${
                car.status === "Sold" ? "available" : "sold"
              }</i></a>
                        </div>
                    </div>
                </div>`;
              carsGrid.insertAdjacentHTML("beforeend", grid);
            });
          installModal();
          updateButton.addEventListener("click", updatePrice);
          return false;
        }
        carsGrid.insertAdjacentHTML(
          "beforeend",
          '<p style="text-align: center;" >You currently have no advertisement to display</p>'
        );
        return false;
      }
      carsGrid.insertAdjacentHTML(
        "beforeend",
        '<p style="text-align: center;" >You haven\'t posted an advert yet'
      );

      return false;
    })
    .catch(err => {
      console.log(err);
      carsGrid.innerHTML = "";
      carsGrid.insertAdjacentHTML(
        "beforeend",
        '<p style="text-align: center;">Oops, something happend, couldn\'t load your adverts, check your internet and refresh page to reload'
      );
    });
})();
