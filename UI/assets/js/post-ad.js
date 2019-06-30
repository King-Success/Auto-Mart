const state = document.getElementById('state');
const price = document.getElementById('price');
const manufacturer = document.getElementById('manufacturer');
const model = document.getElementById('model');
const type = document.getElementById('type');
const spinner = document.getElementById('spinner');
const error = document.getElementById('error');
const success = document.getElementById('success');
const uploadImage = document.getElementById('upload-image');
const uploadBtn = document.getElementById('upload-image-btn');
const preview = document.getElementById('preview');
const submitButton = document.getElementById('submit-btn');


uploadBtn.addEventListener('click', () => {
  uploadImage.click();
});

uploadImage.addEventListener('change', () => {
  const upload = uploadImage.files[0];
  const fileReader = new FileReader();

  fileReader.addEventListener("load", () => {
    preview.src = fileReader.result;
    uploadBtn.innerHTML = 'change image';
  });

  fileReader.readAsDataURL(upload);

});

const wipeAlert = () => {
  submitButton.innerHTML = 'submit';
  error.style.display = 'none';
  success.style.display = 'none';
}

wipeForm = () => {
  state.value = ''
  price.value = ''
  manufacturer.value = ''
  model.value = ''
  type.value = ''
  preview.src = ''
}


const createAd = (data) => {
  const url = 'https://andela-auto-mart.herokuapp.com/api/v1/car';
  const token = localStorage.getItem('token');
  const config = {
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,

    }
  };
  fetch(url, config)
    .then(res => res.json())
    .then((result) => {
      if (result.status !== 201) {
        wipeAlert()
        error.style.display = 'block'
        error.textContent = result.message ? result.message : result.error ? result.error : result.errors ? result.errors[0] : '';
        return false
      }
      wipeAlert();
      wipeForm();
      success.style.display = 'block';
      success.textContent = 'Advert created successfully';
      window.location = 'profile.html'
    })
    .catch((err) => {
      console.log(err)
    });

}

const cloudinaryUpload = (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('upload_preset', 'pw3cblme');

  const config = {
    method: 'POST',
    body: formData,
  };
  const url = 'https://api.cloudinary.com/v1_1/code4king/image/upload'
  const result = fetch(url, config)
    .then(res => res.json())
    .then(res => res.secure_url)
    .catch(err => console.log(err));
  return result
}
const validator = () => {
  if (state.value === '') {
    wipeAlert();
    error.style.display = 'block'
    error.textContent = 'State is required';
    state.focus();
    return false;
  }

  if (price.value === '') {
    wipeAlert();
    error.style.display = 'block'
    error.textContent = 'Price is required';
    price.focus();
    return false;
  }

  if (manufacturer.value === '') {
    wipeAlert();
    error.style.display = 'block'
    error.textContent = 'Manufacturer is required';
    manufacturer.focus();
    return false;
  }

  if (model.value === '') {
    wipeAlert();
    error.style.display = 'block'
    error.textContent = 'Model is required';
    model.focus();
    return false;
  }

  if (type.value === '') {
    wipeAlert();
    error.style.display = 'block'
    error.textContent = 'Type is required';
    type.focus();
    return false;
  }
  const file = uploadImage.files[0];
  if (!file) {
    wipeAlert();
    error.style.display = 'block'
    error.textContent = 'Image is required';
    return false;
  }

  if (file && file > 2097152) {
    wipeAlert();
    error.style.display = 'block'
    error.textContent = 'Image is too large';
    return false;
  }
  return true
}

const handler = (e) => {
  e.preventDefault();
  wipeAlert();
  submitButton.innerHTML = 'saving...';
  const valid = validator()
  if (!valid) return false
  let data = {
    state: state.value,
    price: price.value,
    manufacturer: manufacturer.value,
    model: model.value,
    bodyType: type.value,
    mainImageUrl: ''
  }
  const imageFile = uploadImage.files[0];
  cloudinaryUpload(imageFile)
    .then((secureUrl) => {
      data.mainImageUrl = secureUrl
      data = JSON.stringify(data)
      createAd(data)
    })
}

submitButton.addEventListener('click', handler);
