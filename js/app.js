// ==============
// Variables
// ==============

let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&nat=us&noinfo`;
const gridContainer = document.querySelector('.grid-container');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');
const modalBack = document.querySelector('.modal-back');
const modalForth = document.querySelector('.modal-forth');

// Search Variables
let search = document.querySelector('.search');

// ==============
// Functions
// ==============

// General function for fetch
function useFetch(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .catch(error => console.log('Looks like there is a problem', error))
}

// Error messaging
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

// Displaying Employees on site
function dispayEmployees(employeeData) {
    employees = employeeData;
    let employeeHTML = '';
    employees.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;

        employeeHTML += `
            <div class="card" data-index="${index}">
                <img class="avatar" src="${picture.large}" alt="image of random person">
                <div class="text-container">
                    <h2 class="name">${name.first} ${name.last}</h2>
                    <p class="email">${email}</p>
                    <p class="address">${city}</p>
                </div>
            </div>
        `
    });
    gridContainer.innerHTML = employeeHTML;
}

// Displaying the Modal
function displayModal(index) {
    let {
        name,
        dob,
        phone,
        email,
        location: {
            city,
            street,
            state,
            postcode
        },
        picture
    } = employees[index];
    let date = new Date(dob.date);

    const modalHTML = `
        <img class="avatar" src="${picture.large}" alt="random image of person" data-index="${index}">
        <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
            <hr>
            <p class="phone">${phone}</p>
            <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
            <p class="birthday">Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
    `;

    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;
}

useFetch(urlAPI)
    .then(res => res.results)
    .then(dispayEmployees)

// =================
// Event Listeners
// =================

// Opening Modal
gridContainer.addEventListener('click', e => {
    if (e.target !== gridContainer) {
        const card = e.target.closest(".card");
        const index = card.getAttribute('data-index');

        displayModal(index);
    }
});

// Closing Modal
modalClose.addEventListener('click', () => {
    overlay.classList.add("hidden");
});

// Modal go back
modalBack.addEventListener('click', e => {
    const img = e.target.parentNode.lastElementChild.firstElementChild;
    const currentIndex = img.getAttribute('data-index');    
    const newIndex = parseInt(currentIndex) - 1;
    overlay.classList.add("hidden");
    displayModal(newIndex);
});

// Modal go forth
modalForth.addEventListener('click', e => {
    const img = e.target.parentNode.lastElementChild.firstElementChild;
    const currentIndex = img.getAttribute('data-index');    
    const newIndex = parseInt(currentIndex) + 1;
    overlay.classList.add("hidden");
    displayModal(newIndex);
});

// Search functionality
search.addEventListener('keyup', event => {
    const searchTerm = event.target.value.toLowerCase();
    const names = document.querySelectorAll(".text-container>.name");
    console.log(names);
    names.forEach(name => {
      const text = name.innerHTML.toLowerCase();
      console.log(text);
      const box = name.parentNode.parentNode;
      if(text.includes(searchTerm)) {
        box.style.display = "";
      } else {
        box.style.display = "none";  
      }
    });
});