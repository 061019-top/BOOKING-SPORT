let listScheduleUser = [];
let listClass = [];
let listUser = [];

// Hàm lấy danh sách lớp học
const getListClassLocal = () => {
  let data = localStorage.getItem("ListClassSchedule");
  if (data) {
    listClass = JSON.parse(data);
  }
};

// Hàm lấy listScheduleUser từ Local
const getScheduleUserLocal = () => {
  let data = localStorage.getItem("ListScheduleUser");
  if (data) {
    listScheduleUser = JSON.parse(data);
  }
};

//  Hàm lưu listScheduleUser lên Local
const setScheduleUserLocal = () => {
  localStorage.setItem("ListScheduleUser", JSON.stringify(listScheduleUser));
};

// Hàm tạo ngày cập nhật
const createdDate = () => {
  let date = new Date();
  return date.toLocaleDateString("vi-VN");
};

// Hàm lấy dự liệu từ Local của RegisterUser
const getLocalUserRegister = () => {
  let data = localStorage.getItem("ListUser");
  if (data) {
    listUser = JSON.parse(data);
  }
};

getListClassLocal();
let filterClass = document.getElementById("filterClass");
let filterDate = document.getElementById("filterDate");
let filterEmail = document.getElementById("filterEmail");
let dataScheduleUser = document.getElementById("lists-schedule");

const renderFilterOptions = () => {
  filterClass.innerHTML = `<option value="all">Tất cả</option>`;
  listClass.forEach((service) => {
    filterClass.innerHTML += `<option value="${service.id}">${service.name}</option>`;
  });
};

// Hàm Render dữ liệu ra màn hình
const renderlistScheduleUser = () => {
  dataScheduleUser.innerHTML = "";

  if (listScheduleUser.length === 0) {
    dataScheduleUser.innerHTML = `<tr><td colspan="7" style="text-align:center">Không tìm thấy lịch tập nào</td></tr>`;
    return;
  }

  listScheduleUser.forEach((scheduleUser) => {
    getLocalUserRegister();

    let nameClass = "Chưa xác định";
    listClass.forEach((service) => {
      if (scheduleUser.classId == service.id) {
        nameClass = service.name;
      }
    });

    let nameUser = "Không xác định";
    let emailUser = "Không xác định";
    listUser.forEach((user) => {
      if (scheduleUser.userId == user.id) {
        nameUser = user.fullname;
        emailUser = user.email;
      }
    });

    dataScheduleUser.innerHTML += `
        <tr>
            <td>${nameClass}</td> 
            <td>${scheduleUser.date}</td>
            <td>${scheduleUser.time}</td>
            <td>${nameUser}</td>
            <td>${emailUser}</td>
            <td class="action-links">
                <a href="javascript:void(0)" class="btn-edit" onclick="openUpdateModal('${scheduleUser.id}')">Sửa</a>
                <a href="javascript:void(0)" class="btn-delete" onclick="deleteScheduleUser('${scheduleUser.id}')">Xóa</a>
            </td>
        </tr>`;
  });
};
renderlistScheduleUser();

const handleFilterSchedule = () => {
  getScheduleUserLocal();
  getLocalUserRegister();

  let valClass = filterClass.value;
  let valDate = filterDate.value;
  let valEmail = filterEmail.value.trim().toLowerCase();

  // Lọc theo lớp học
  if (valClass !== "all" && valClass !== "") {
    listScheduleUser = listScheduleUser.filter((schedule) => {
      return schedule.classId == valClass;
    });
  }

  // Lọc theo ngày
  if (valDate !== "") {
    listScheduleUser = listScheduleUser.filter((schedule) => {
      return schedule.date === valDate;
    });
  }

  // Lọc theo email
  if (valEmail !== "") {
    listScheduleUser = listScheduleUser.filter((schedule) => {
      let foundUser = listUser.find((user) => user.id == schedule.userId);
      return foundUser && foundUser.email.toLowerCase().includes(valEmail);
    });
  }

  renderlistScheduleUser();
};

filterClass.addEventListener("change", handleFilterSchedule);
filterDate.addEventListener("change", handleFilterSchedule);
filterEmail.addEventListener("keyup", handleFilterSchedule);

let modalAdd = document.getElementById("modalAdd");
let btnCloseAddModal = document.getElementById("closeAddModal");
let classSchedule = document.getElementById("classSchedule");
let dateSchedule = document.getElementById("dateSchedule");
let timeSchedule = document.getElementById("timeSchedule");
let btnAddSchedule = document.getElementById("saveSchedule");

let alertClass = document.getElementById("alertClass");
let alertDate = document.getElementById("alertDate");
let alertTime = document.getElementById("alertTime");
let alertCheckDate = document.getElementById("alertCheckDate");
let alertCheckTime = document.getElementById("alertCheckTime");

let editScheduleId = null;

//  Hàm reset text span
const resetInputValidate = () => {
  alertClass.innerText = "";
  alertDate.innerText = "";
  alertTime.innerText = "";
  alertCheckDate.innerText = "";
  alertCheckTime.innerText = "";
};

// Hàm mở Modal Sửa
const openUpdateModal = (scheduleId) => {
  let findSchedule = listScheduleUser.find((schedule) => {
    return schedule.id == scheduleId;
  });
  if (findSchedule) {
    editScheduleId = scheduleId;
    resetInputValidate();

    // Render dữ liệu Lớp học
    classSchedule.innerHTML = `<option value="">Chọn lớp học</option>`;
    listClass.forEach((service) => {
      classSchedule.innerHTML += `<option value="${service.id}">${service.name}</option>`;
    });

    classSchedule.value = findSchedule.classId;
    dateSchedule.value = findSchedule.date;
    timeSchedule.value = findSchedule.time;

    btnAddSchedule.innerText = "Cập nhật";
    modalAdd.style.display = "flex";
  }
};

// Đóng Modal Sửa
if (btnCloseAddModal) {
  btnCloseAddModal.addEventListener("click", () => {
    modalAdd.style.display = "none";
    editScheduleId = null;
    resetInputValidate();
  });
}

// Hàm cập nhật 
if (btnAddSchedule) {
  btnAddSchedule.addEventListener("click", () => {
    let isValidate = true;
    let valClass = classSchedule.value.trim();
    let valDate = dateSchedule.value.trim();
    let valTime = timeSchedule.value.trim();

    resetInputValidate();

    if (valClass === "") {
      if (alertClass) alertClass.innerText = "Lớp học không được để trống";
      isValidate = false;
    }
    if (valDate === "") {
      if (alertDate) alertDate.innerText = "Ngày tập không được để trống";
      isValidate = false;
    }
    if (valTime === "") {
      if (alertTime) alertTime.innerText = "Thời gian tập không được để trống";
      isValidate = false;
    }

    // validate trùng lịch của User
    if (editScheduleId) {
      let currentSchedule = listScheduleUser.find((schedule) => {
        return schedule.id == editScheduleId;
      });

      if (currentSchedule) {
        let checkSchedule = listScheduleUser.some((schedule) => {
          return schedule.date === valDate && schedule.time === valTime;
        });

        if (checkSchedule) {
          if (alertCheckDate)
            alertCheckDate.innerText =
              "Người dùng đã có lịch tập vào khung giờ này";
          if (alertCheckTime)
            alertCheckTime.innerText =
              "Người dùng đã có lịch tập vào khung giờ này";
          isValidate = false;
        }
      }
    }

    if (isValidate && editScheduleId) {
      let index = listScheduleUser.findIndex((schedule) => {
        return schedule.id == editScheduleId;
      });
      if (index !== -1) {
        listScheduleUser[index].classId = Number(valClass);
        listScheduleUser[index].date = valDate;
        listScheduleUser[index].time = valTime;
        listScheduleUser[index].updatedAt = createdDate();
        setScheduleUserLocal();
        handleFilterSchedule();
        modalAdd.style.display = "none";
        Swal.fire({
          title: "Cập nhật thành công",
          icon: "success",
          draggable: false,
        });
      }
    }
  });
}

// Hàm xoá
let modalDelete = document.getElementById("modalDelete");
let btnCloseDeleteModal = document.getElementById("closeDeleteModal");
let yesDelete = document.getElementById("yesDelete");
let deleteScheduleId = null;

const deleteScheduleUser = (scheduleId) => {
  deleteScheduleId = scheduleId;
  if (modalDelete) modalDelete.style.display = "flex";
};

  btnCloseDeleteModal.addEventListener("click", () => {
    modalDelete.style.display = "none";
  });


 yesDelete.addEventListener("click", () => {
  if (deleteScheduleId) {
    listScheduleUser = listScheduleUser.filter((schedule) => {
      return schedule.id != deleteScheduleId; 
    });
    setScheduleUserLocal();
    handleFilterSchedule();
    modalDelete.style.display = "none";
    Swal.fire({
      title: "Xoá thành công",
      icon: "success",
      draggable: false,
    });
  }
});


// --- CHẠY KHỞI TẠO LÚC LOAD TRANG ---
getListClassLocal();
getScheduleUserLocal();
getLocalUserRegister();
renderFilterOptions();
renderlistScheduleUser();
