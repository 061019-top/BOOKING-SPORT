// tạo mảng listUser
let listUser = [];
let currentUser = [];
let listClassSchedule = [
  {
    id: 1,
    name: "Gym",
    description: "Tập luyện với các thiết bị hiện đại",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Yoga",
    description: "Thư giãn và cân bằng tâm trí",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Zumba",
    description: "Đốt cháy calories với những điệu nhảy sôi động",
    image:
      "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=300&auto=format&fit=crop",
  },
];
const setListClassSchedule = () => {
  localStorage.setItem("ListClassSchedule", JSON.stringify(listClassSchedule));
};
setListClassSchedule()

// Lấy thẻ html
let emailLogin = document.getElementsByClassName("email-login")[0];
let passLogin = document.getElementsByClassName("pass-login")[0];
let submitLogin = document.getElementById("submit-login");

// Lấy alert
let emailNone = document.getElementsByClassName("email-none")[0];
let alertMail = document.getElementsByClassName("alert-email")[0];

let passNone = document.getElementsByClassName("pass-none")[0];
let alertPass = document.getElementsByClassName("alert-pass")[0];

// Hàm lưu lên Local của CurrentUser
const saveLocalUserLogin = () => {
  localStorage.setItem("CurrentUser", JSON.stringify(currentUser));
};

// Hàm lấy dự liệu từ Local của CurrentUser
const getLocalUserLogin = () => {
  const data = localStorage.getItem("CurrentUser");
  if (data) {
    currentUser = JSON.parse(data);
  }
};

// Hàm lấy dự liệu từ Local của RegisterUser
const getLocalUserRegister = () => {
  let data = localStorage.getItem("ListUser");
  if (data) {
    listUser = JSON.parse(data);
  }
};

// Hàm validate Login
const checkUserLogin = () => {
  // lấy lấy dữ liệu của RegisterUser
  getLocalUserRegister();
  console.log(listUser);

  const checkAccount = listUser.find((user) => {
    return user.email == emailLogin.value.trim();
  });
  currentUser = checkAccount;
  // mail rỗng
  if (emailLogin.value.trim() === "" && passLogin.value.trim() != "") {
    emailNone.style.display = "block";
    passNone.style.display = "none";

    return;
  }
  // pass rỗng
  if (passLogin.value.trim() === "") {
    passNone.style.display = "block";
    alertPass.style.display = "none";
    emailNone.style.display = "none";

    return;
  }
  // check mật khẩu
  if (checkAccount == undefined) {
    alertMail.style.display = "block";
  } else {
    if (checkAccount.password !== passLogin.value.trim()) {
      alertPass.style.display = "block";
      alertMail.style.display = "none";
    } else {
      alertPass.style.display = "none";
      if (checkAccount.role === "user") {
        saveLocalUserLogin();
        window.location.href = "../Home Page/homePage.html";
      } else if (checkAccount.role === "admin") {
        saveLocalUserLogin();
        window.location.href = "../Admin Page TK/pageTK.html";
      }
    }
  }
};
submitLogin.addEventListener("click", checkUserLogin);
