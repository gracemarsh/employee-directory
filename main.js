// global variables
let employees = []
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`
const gridContainer = document.querySelector(".grid-container")
const overlay = document.querySelector(".overlay")
const modalContainer = document.querySelector(".modal-content")
const modalClose = document.querySelector(".modal-close")
const modal = document.querySelector(".modal")

function displayEmployees(employeeData) {
  employees = employeeData
  // store the employee HTML as we create it
  let employeeHTML = ""
  // loop through each employee and create HTML markup
  employees.forEach((employee, index) => {
    let name = employee.name
    let email = employee.email
    let city = employee.location.city
    let picture = employee.picture
    // template literals make this so much cleaner!
    employeeHTML += `
        <div class="card pointer" tabindex="0" role="button" data-index="${index}">
          <img class="avatar" src="${picture.large}" />
          <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email overflow ellipsis" abbr title="${email}">${email}</p>
            <p class="address">${city}</p>
          </div>
        </div>
  `
  })

  // deletes anything inside container and replaces it with new things
  gridContainer.innerHTML = employeeHTML
}

// fetch data from API
fetch(urlAPI)
  .then((res) => res.json())
  .then((res) => res.results)
  .then(displayEmployees)
  .catch((err) => console.log(err))

function displayModal(index) {
  // use object destructuring make our template literal cleaner
  let {
    name,
    dob,
    phone,
    email,
    location: { city, street, state, postcode },
    picture,
  } = employees[index]
  let date = new Date(dob.date)
  const modalHTML = `
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
      <h2 class="name">${name.first} ${name.last}</h2>
      <p class="email">${email}</p>
      <p class="address">${city}</p>
      <hr />
      <p>${phone}</p>
      <p class="address">${street.number} ${
    street.name
  }, ${state} ${postcode}</p>
      <p>Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
`
  overlay.classList.remove("hidden")

  // deletes anything inside container and replaces it with new things
  modalContainer.innerHTML = modalHTML
  modalClose.focus()
}

// DRY. MAKE THE REPEATED CODE A FUNCTION!

gridContainer.addEventListener("click", (e) => {
  // make sure the click is not on the gridContainer itself!!
  if (e.target !== gridContainer) {
    // select card closest to actual element clicked
    const card = e.target.closest(".card")
    const index = card.getAttribute("data-index")
    displayModal(index)
  }
})

// enter and space open the modal if selected via tabbing
gridContainer.addEventListener("keypress", (e) => {
  if (e.code === "Enter" || e.code === "Space") {
    const card = e.target.closest(".card")
    const index = card.getAttribute("data-index")
    displayModal(index)
  }
})

//escape key closes modal
document.onkeydown = (e) => {
  console.log(e)
  if (e.code === "Escape") {
    overlay.classList.add("hidden")
  }
}

// function so that cross becomes focus automatically
modalClose.focus()

//cross closes modal
modalClose.addEventListener("click", () => {
  overlay.classList.add("hidden")
})

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.add("hidden")
  }
})
