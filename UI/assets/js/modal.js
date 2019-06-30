let clickModalEvent;
let toggleModal;

const installModal = () => {
    const modal = document.querySelector(".modal");
    const closeButton = document.querySelector(".close-button");

    toggleModal = (e) => {
        clickModalEvent = e;
        modal.classList.toggle("show-modal");
    }

    function windowOnClick(event) {
        if (event.target === modal) {
            toggleModal();
        }
    }
    if (modal && closeButton) {
        closeButton.addEventListener("click", toggleModal);
        window.addEventListener("click", windowOnClick);
    }

}
