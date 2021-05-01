// ==============
// Variables
// ==============

let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&nat=us&noinfo`;
const gridContainer = document.querySelector('.grid-container');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');

// Search Variables
const search = document.querySelector('#searchbar');

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
        <img class="avatar" src="${picture.large}" alt="random image of person">
        <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
            <hr>
            <p class="phone">${phone}</p>
            <p class="address">${street}, ${state} ${postcode}</p>
            <p class="birthday">Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
    `;

    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;
}

// Search Functionality
const handleSearch = event => {
    const searchTerm = event.target.value.toLowerCase();
    const boxTexts = document.querySelectorAll("a");
    boxTexts.forEach(boxText => {
      //get the value text of the attribute for the a elements (const boxTexts = document.querySelectorAll("a");)
      const text = boxText.getAttribute('data-caption');
      //variable that holds the a element that has data-caption text that is in the search 
      const box = boxText;
  
  
     // if(text.indexOf(searchTerm) > -1) {
      if(text.includes(searchTerm)) {
        box.style.display = "block";
      } else {
        box.style.display = "none";  
      }
    });
};

// ==============
// APIs
// ==============

// fetch('https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&nat=us&noinfo')
//     .then(res => res.json)
//     .then(res => console.log(res.results))
//     .catch(err => console.log(err))

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

search.addEventListener('keyup', handleSearch);