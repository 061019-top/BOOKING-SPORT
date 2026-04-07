let listUser = [
  {
    id: Date.now(),
    email: "adminv1@gmail.com",
    password: "adminv1",
    fullname: "admin v1",
    phone: "098456780",
    role: "admin",
    createdAt: "30-3-2026",
  },

];
// lấy giá trị các ô input
let nameRegister = document.getElementsByClassName("name-register")[0];
console.log(nameRegister);

let emailRegister = document.getElementsByClassName("email-register")[0];
let passRegister = document.getElementsByClassName("pass-register")[0];
let repassRegister = document.getElementsByClassName("repass-register")[0];
let submitRegister = document.getElementById("submit-register");

// lấy alert
let alertName = document.getElementsByClassName("alert-name")[0];

let alertMailNone = document.getElementsByClassName("alert-mail-none")[0];
let alertMail = document.getElementsByClassName("alert-mail")[0];
let alertIsmail = document.getElementsByClassName("alert-ismail")[0];

let alertPassNone = document.getElementsByClassName("alert-pass-none")[0];
let alertPass = document.getElementsByClassName("alert-pass")[0];

let alertRepassNone = document.getElementsByClassName("alert-repass-none")[0];
let alertRepass = document.getElementsByClassName("alert-repass")[0];

// Hàm lưu lên Local
const saveLocalUserRegister = () => {
  localStorage.setItem("ListUser", JSON.stringify(listUser));
};


// Hàm lấy dự liệu từ Local
const getLocalUserRegister = () => {
  const data = localStorage.getItem("ListUser");
  if (data) {
    listUser = JSON.parse(data);
  }
};

// Hàm và validate dữ liệu register
const validateRegister = () => {
  // validate tên
  let checkName = true;
  if (nameRegister.value.trim() == "") {
    alertName.style.display = "inline-block";
    checkName = false;
    nameRegister.focus();
  }

  // validate email check trùng
  let checkMail = true;
  getLocalUserRegister();

  const checkMaiUser = listUser.find(
    (user) => user.email == emailRegister.value.trim(),
  );
  console.log(checkMaiUser);

  if (emailRegister.value.trim() == "") {
    alertMailNone.style.display = "inline-block";
    checkMail = false;
    emailRegister.focus();
  } else if (!emailRegister.value.includes("@gmail.com")) {
    alertMail.style.display = "inline-block";
    checkMail = false;
    emailRegister.focus();
  } else if (checkMaiUser != undefined) {
    alertIsmail.style.display = "inline-block";
    checkMail = false;
  }

  // validate mật khẩu
  let checkPass = true;
  if (passRegister.value.trim() == "") {
    alertPassNone.style.display = "inline-block";
    checkPass = false;
    passRegister.focus();
  } else if (passRegister.value.trim().length < 8) {
    alertPass.style.display = "inline-block";
    checkPass = false;
    passRegister.focus();
  }

  // validate xác nhận mật khẩu
  let checkRepass = true;
  if (repassRegister.value.trim() == "") {
    alertRepassNone.style.display = "inline-block";
    checkRepass = false;
    repassRegister.focus();
  } else if (passRegister.value.trim() != repassRegister.value.trim()) {
    alertRepass.style.display = "inline-block";
    checkRepass = false;
    repassRegister.focus();
  }
  let date = new Date();

  if (
    checkName == true &&
    checkMail == true &&
    checkPass == true &&
    checkRepass == true
  ) {
    let newUser = {
      id: Date.now(),
      email: emailRegister.value.trim(),
      password: passRegister.value.trim(),
      fullname: nameRegister.value.trim(),
      phone: Date.now(),
      role: "user",
      createdAt: date.toLocaleDateString("vi-VN"),
    };
    listUser.push(newUser);
    console.log(listUser);
    
    saveLocalUserRegister();
    window.location.href = "../Login/login.html";
  }
};  
submitRegister.addEventListener("click", validateRegister);
