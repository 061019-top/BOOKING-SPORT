let currentUser = [];

let helloUser = document.getElementById("helloUser");
let logoutUser = document.getElementById("logout");
let loginUser = document.getElementById("login");
let adService = document.getElementById("service");

// Hàm lấy dự liệu từ Local của CurrentUser
const getLocalUserLogin = () => {
  const data = localStorage.getItem("CurrentUser");
  if (data) {
    currentUser = JSON.parse(data);
  }
};
getLocalUserLogin();

helloUser.innerText = `Xin chào, ${currentUser.fullname}`;
console.log(currentUser);
if (currentUser == "") {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Bạn chưa đăng nhập",
  });
}
if (currentUser != "") {
  loginUser.style.display = "none";
  logoutUser.style.display = "inline-block";
} else {
  loginUser.style.display = "inline-block";
  logoutUser.style.display = "none";
}

if (currentUser.role === "admin") {
  adService.style.display = "inline-block";
} else {
  adService.style.display = "none";
}

// Hàm lấy classSchedule
let listClassSchedule;
const getListClassSchedule = () => {
  let data = localStorage.getItem("ListClassSchedule");
  if (data) {
    listClassSchedule = JSON.parse(data);
  }
  listClassSchedule.sort((a,b)=>{
    return a.name.localeCompare(b.name, 'VN-vi')
  })

};

// Hàm render lớp học
let cardsContainer = document.getElementsByClassName("cards-container")[0];
const renderListClassSchedule = () => {
  cardsContainer.innerHTML=""
  getListClassSchedule();
  listClassSchedule.forEach((classSchedule) => {
    cardsContainer.innerHTML += `
     <div class="class-card">
          <img
            src="${classSchedule.image}"
            alt="${classSchedule.name}"
            class="card-image"
          />
          <div class="card-content">
            <h3 class="card-title">${classSchedule.name}</h3>
            <p class="card-description">${classSchedule.description}</p>
            <a class="btn-primary" href="../Booking Page/bookingPage.html">Đặt lịch</a>
          </div>
        </div> 
    `;
  });
};
renderListClassSchedule();
