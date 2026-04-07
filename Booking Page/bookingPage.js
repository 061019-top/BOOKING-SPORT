let currentUser = {};
let listScheduleUser = [];

// Hàm đưa listScheduleUser lên Local
const setScheduleUserLocal = () => {
  localStorage.setItem("ListScheduleUser", JSON.stringify(listScheduleUser));
};

// Hàm lấy listScheduleUser từ Local
const getScheduleUserLocal = () => {
  let data = localStorage.getItem("ListScheduleUser");
  if (data) {
    listScheduleUser = JSON.parse(data);
  }
};

// Hàm lấy dự liệu từ Local của CurrentUser
const getLocalUserLogin = () => {
  const data = localStorage.getItem("CurrentUser");
  if (data) {
    currentUser = JSON.parse(data);
  }
};

// Hàm tạo ngày tạo tài khoản
const createdDate = () => {
  let date = new Date();
  return date.toLocaleDateString("vi-VN");
};

// Hàm lấy data Class từ localStorage
let listClass = [];
const getDataClass = () => {
  let data = localStorage.getItem("ListClassSchedule");
  if (data) {
    listClass = JSON.parse(data);
  }
};
// Hàm reder option
let classSchedule = document.getElementById("classSchedule");
const addInputNameClass = () => {
  getDataClass();
  classSchedule.innerHTML = `<option value="">Chọn lớp học</option>`;
  listClass.forEach((service) => {
    classSchedule.innerHTML += `
      <option value="${service.id}">${service.name}</option>
    `;
  });
};

// Hàm render scheduleUser
let tbodySchedule = document.getElementById("tbody-schedule");

let userSchedule;

const renderScheduleUser = () => {
  getScheduleUserLocal();
  getLocalUserLogin();

  userSchedule = listScheduleUser.filter((schedule) => {
    return (
      currentUser.id === schedule.userId && schedule.status !== "cancelled"
    );
  });

  if (userSchedule.length == 0) {
    tbodySchedule.innerHTML = `<tr><td colspan="6" style="text-align:center">Danh sách lịch tập trống</td></tr>`;
    return;
  }

  tbodySchedule.innerHTML = "";

  userSchedule.forEach((schedule) => {
    let trSchedule = document.createElement("tr");

    let nameClass = "Chưa xác định";
    listClass.forEach((service) => {
      if (schedule.classId == service.id) {
        nameClass = service.name;
      }
    });

    trSchedule.innerHTML = `
      <td>${nameClass}</td>
      <td>${schedule.date}</td>
      <td>${schedule.time}</td>
      <td>${currentUser.fullname}</td> 
      <td>${currentUser.email}</td>
      <td>
        <span class="edit-text" onclick="openUpdateModal('${schedule.id}')">Sửa</span>
        <span class="delete-text" onclick="deleteScheduleUser('${schedule.id}')">Xóa</span>
      </td>`;
    tbodySchedule.appendChild(trSchedule);
  });
};

addInputNameClass();
renderScheduleUser();

// Modal thêm
let modalAdd = document.getElementById("modalAdd");
let btnOpenAddModal = document.getElementById("openAddModal");
let btnCloseAddModal = document.getElementById("closeAddModal");

let editScheduleId = null;

// Hàm reset modal
const resetInputValidate = () => {
  alertClass.innerText = "";
  alertDate.innerText = "";
  alertTime.innerText = "";
  alertCheckDate.innerText = "";
  alertCheckTime.innerText = "";

  classSchedule.value = "";
  dateSchedule.value = "";
  timeSchedule.value = "";
};

// Hàm hiện openAddModal
const openAddModal = () => {
  modalAdd.style.display = "flex";
};

// Hàm ẩn openAddModal
const closeAddModal = () => {
  modalAdd.style.display = "none";
  btnAddSchedule.innerText = "Lưu";
  editScheduleId = null;
  resetInputValidate();
};
btnOpenAddModal.addEventListener("click", openAddModal);
btnCloseAddModal.addEventListener("click", closeAddModal);

// Modal xóa
let modalDelete = document.getElementById("modalDelete");
let btnCloseDeleteModal = document.getElementById("closeDeleteModal");

// Hàm hiện DeleteModal
const openDeleteModal = () => {
  modalDelete.style.display = "flex";
};

// Hàm ẩn DeleteModal
const closeDeleteModal = () => {
  modalDelete.style.display = "none";
};

btnCloseDeleteModal.addEventListener("click", closeDeleteModal);

// Hàm validate Schedule
let btnAddSchedule = document.getElementById("saveSchedule");
let dateSchedule = document.getElementById("dateSchedule");
let timeSchedule = document.getElementById("timeSchedule");

let alertClass = document.getElementById("alertClass");
let alertDate = document.getElementById("alertDate");
let alertTime = document.getElementById("alertTime");
let alertCheckDate = document.getElementById("alertCheckDate");
let alertCheckTime = document.getElementById("alertCheckTime");

const validateSchedule = () => {
  let isValidate = true;
  let valClass = classSchedule.value.trim();
  let valDate = dateSchedule.value.trim();
  let valTime = timeSchedule.value.trim();

  alertClass.innerText = "";
  alertDate.innerText = "";
  alertTime.innerText = "";
  alertCheckDate.innerText = "";
  alertCheckTime.innerText = "";

  if (valClass === "") {
    alertClass.innerText = "Lớp học không được để trống";
    isValidate = false;
  }
  if (valDate === "") {
    alertDate.innerText = "Ngày tập không được để trống";
    isValidate = false;
  }
  if (valTime === "") {
    alertTime.innerText = "Thời gian tập không được để trống";
    isValidate = false;
  }
  //  Check lịch trùng
  let checkSchedule = userSchedule.some((schedule) => {
    return schedule.date === valDate && schedule.time === valTime;
  });
  if (checkSchedule) {
    alertCheckDate.innerText = "Bạn đã có lịch tập vào khung giờ này rồi";
    alertCheckTime.innerText = "Bạn đã có lịch tập vào khung giờ này rồi";
    isValidate = false;
  }

  if (isValidate) {
    let classIdNumber = valClass;

    if (editScheduleId) {
      let scheduleIndex = listScheduleUser.findIndex((schedule) => {
        return schedule.id === editScheduleId;
      });
      if (scheduleIndex !== -1) {
        listScheduleUser[scheduleIndex].classId = classIdNumber;
        listScheduleUser[scheduleIndex].date = valDate;
        listScheduleUser[scheduleIndex].time = valTime;
        listScheduleUser[scheduleIndex].updatedAt = createdDate();
      }
      Swal.fire({
        title: "Cập nhật thành công",
        icon: "success",
        draggable: false,
      });
    } else {
      let newSchedule = {
        id: `${Date.now()}`,
        userId: currentUser.id,
        classId: classIdNumber,
        date: valDate,
        time: valTime,
        status: "pending",
        createdAt: createdDate(),
        updatedAt: createdDate(),
      };
      Swal.fire({
        title: "Thêm thành công",
        icon: "success",
        draggable: false,
      });
      listScheduleUser.push(newSchedule);
    }

    setScheduleUserLocal();
    renderScheduleUser();
    closeAddModal();
  }
};

btnAddSchedule.addEventListener("click", validateSchedule);

// Hàm sửa Schedule
const openUpdateModal = (scheduleId) => {
  // Tìm ra User cần sửa
  let findScheduleUserUpdate = listScheduleUser.find(
    (schedule) => schedule.id === scheduleId,
  );

  if (findScheduleUserUpdate) {
    editScheduleId = scheduleId;
  }

  classSchedule.value = findScheduleUserUpdate.classId;
  dateSchedule.value = findScheduleUserUpdate.date;
  timeSchedule.value = findScheduleUserUpdate.time;
  btnAddSchedule.innerText = "Cập nhật";
  openAddModal();
};

// Hàm xoá Schedule
let yesDelete = document.getElementById("yesDelete");
let deleteScheduleId = null;

const deleteScheduleUser = (scheduleId) => {
  deleteScheduleId = scheduleId;
  openDeleteModal();
};
console.log(deleteScheduleId);

yesDelete.addEventListener("click", () => {
  if (deleteScheduleId) {
    let findScheduleUserDelete = listScheduleUser.find((schedule) => {
      return schedule.id === deleteScheduleId;
    });
    if (findScheduleUserDelete) {
      findScheduleUserDelete.status = "cancelled";
      findScheduleUserDelete.updatedAt = createdDate();
      setScheduleUserLocal();
      renderScheduleUser();
      Swal.fire({
        title: "Xoá thành công",
        icon: "success",
        draggable: false,
      });
    }
  }
  closeDeleteModal();
});
