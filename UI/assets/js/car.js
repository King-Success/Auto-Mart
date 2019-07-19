const token = localStorage.getItem("token");

const disableOrder = () => {
  const reportButton = document.querySelector("#order");
  reportButton.disabled = true;
  reportButton.classList.remove('opacity');
  reportButton.style.opacity = 0.4;
  return false;
};

const flagAd = carId => { // eslint-disable-line no-unused-vars
  const reportButton = document.querySelector(".report");
  reportButton.textContent = "Reporting...";
  const urlFlag = `https://andela-auto-mart-staging.herokuapp.com/api/v1/flag`;
  const body = JSON.stringify({
    carId,
    reason: "Default",
    description: "Default"
  });
  const configFlag = {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  fetch(urlFlag, configFlag)
    .then(res => res.json())
    .then(flagPayload => {
      if (flagPayload.status === 201) {
        reportButton.innerHTML = 'Reported <i class="fas fa-check"></i>';
        disableOrder();
        setTimeout(() => {
          reportButton.innerHTML = 'Report this ad <i class="far fa-flag"></i>';
          return false;
        }, 2000);
        return false;
      }
      reportButton.innerHTML = 'Failed <i class="fas fa-times"></i>';
      setTimeout(() => {
        reportButton.innerHTML = 'Report this ad <i class="far fa-flag"></i>';
        return false;
      }, 2000);
      return false;
    })
    .catch(err => {
      console.log(err); // eslint-disable-line no-console
      reportButton.innerHTML = 'Failed <i class="fas fa-times"></i>';
      setTimeout(() => {
        reportButton.innerHTML = 'Report this ad <i class="far fa-flag"></i>';
        return false;
      }, 2000);
    });
};

(function allCars() {
  const carDetail = document.querySelector(".car");
  const alertBox = document.querySelector(".alert");

  alertBox.style.display = "block";

  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get("carId");
  const urlCar = `https://andela-auto-mart-staging.herokuapp.com/api/v1/car/${carId}`;
  const configCar = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };

  fetch(urlCar, configCar)
    .then(res => res.json())
    .then(carPayload => {
      if (carPayload.status === 200) {
        let { data: car } = carPayload;
        [car] = car;
        const urlUser = `https://andela-auto-mart-staging.herokuapp.com/api/v1/user/${
          car.owner
        }`;
        const configUser = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        };
        return fetch(urlUser, configUser)
          .then(res => res.json())
          .then(userPayload => {
            if (userPayload.data) {
              let { data: owner } = userPayload;
              [owner] = owner;
              return { car, owner };
            }
            return { car };
          });
      }
      return false;
    })
    .then(carAndOwner => {
      alertBox.style.display = "none";
      carDetail.innerHTML = "";
      if (carAndOwner) {
        const { car, owner } = carAndOwner;
        if (car && owner) {
          /* eslint-disable no-undef, indent */
          const html = ` <div class="car__details">
                  <div class="main__image">
                      <img src="${car.mainimageurl}" alt="${car.model}">
                  </div>
                  <hr>
                  <div class="car__detail">
                      <div class="header">
                          <h1>${car.model.toUpperCase()}</h1>
                          <i class="far fa-clock"> Posted on: ${formatDate(
                            car.createdon
                          )}</i> 
                      </div>
                      <div class="specs">
                          <ul class="f-14">
                          <li><strong>body type</strong>: ${car.bodytype}</li>
                                <li><strong>state</strong>: ${car.state.toLowerCase()}</li>
                                <li><strong>manufacturer</strong>: ${
                                  car.manufacturer
                                }</li>
                                <li><strong>price</strong>: <em class="" style="color: green">&#8358; ${formatMoney(
                                  car.price
                                )}</em></li>
                          </ul>
                      </div>
                      <div class="actions">
                          <div class="buy">
                              <button id="order" class="f-20 opacity">Add to cart <i
                                      class="fas fa-shopping-cart"></i></button>
                          </div>
                          <div class="others">
                              <button onclick="flagAd(${
                                car.id
                              })" class="report opacity">Report this ad <i class="far fa-flag"></i></button>
                          </div>
                      </div>
                  </div>
                  <hr>
                  </div>
                  <div class="seller__details">
                  <div class="details__card">
                      <div class="price">
                          <h1>&#8358; ${formatMoney(car.price)}</h1>
                      </div>
                      <hr>
                      <div class="avater__card">
                          <div class="avater" style="background: ${owner.passporturl ||
                            "url(assets/img/avatar.png)"}; 
                          background-size: cover;">
                          </div>
                          <div class="name">
                              <h2>${owner.firstname.toUpperCase()} ${owner.lastname.toUpperCase()}</h2>
                          </div>
                      </div>
                      <hr>
                      <div class="actions">
                          <button class="show__contact f-16">Show Contact</button>
                          <button class="start__chat f-16">Start Chat</button>
                          <a href="" class="leave__feedback">Leave Feedback</a>
                      </div>
                  </div>
                  </div>`;
          /*eslint-disable */
          carDetail.style.justifyContent = "";
          carDetail.innerHTML = html;
          return false;
        }
        carDetail.insertAdjacentHTML(
          "beforeend",
          '<h1 style="text-align: center; font-size: 2rem" >404 Car not found</h1>'
        );
        return false;
      }
      carDetail.insertAdjacentHTML(
        "beforeend",
        '<h1 style="text-align: center; font-size: 2rem" >404 Car not found</h1>'
      );
      return false;
    })
    .catch(err => {
      console.log(err);
      alertBox.style.display = "none";
      carDetail.innerHTML = "";
      carDetail.insertAdjacentHTML(
        "beforeend",
        '<p style="text-align: center;">Oops, something happend, couldn\'t load adverts, check your internet and refresh page to reload'
      );
    });
})();
