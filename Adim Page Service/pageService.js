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

const getListClassSchedule = () => {
  let data = localStorage.getItem("ListClassSchedule");
  if (data) {
    listClassSchedule = JSON.parse(data);
  }
};
const setListClassSchedule = () => {
  localStorage.setItem("ListClassSchedule", JSON.stringify(listClassSchedule));
};

// Hàm render dịch vụ
let tbodyServices = document.getElementById("tbody-services");

const renderServices = () => {
  tbodyServices.innerHTML = "";
  if (listClassSchedule.length === 0) {
    tbodyServices.innerHTML = `<tr><td colspan="4" style="text-align:center">Chưa có dịch vụ nào</td></tr>`;
    return;
  }

  listClassSchedule.forEach((service) => {
    tbodyServices.innerHTML += `
        <tr>
            <td>${service.name}</td>
            <td>${service.description}</td>
            <td><img src="${service.image}" alt="${service.name}"></td>
            <td>
                <span class="edit-text" onclick="openEditModal(${service.id})">Sửa</span>
                <span class="delete-text" onclick="openDeleteModal(${service.id})">Xóa</span>
            </td>
        </tr>
    `;
  });
};

getListClassSchedule();
renderServices();

let modalAddService = document.getElementById("modalAddService");
let btnOpenAdd = document.getElementById("openAddServiceModal");
let btnCloseAdd = document.getElementById("closeAddServiceModal");

let inputName = document.getElementById("inputServiceName");
let inputDesc = document.getElementById("inputServiceDesc");
let inputImg = document.getElementById("inputServiceImg");

let alertName = document.getElementById("alertName");
let alertDesc = document.getElementById("alertDesc");
let alertImg = document.getElementById("alertImg");
let modalTitle = document.getElementById("modalTitle");

let editServiceId = null;

const resetForm = () => {
  inputName.value = "";
  inputDesc.value = "";
  inputImg.value = "";
  alertName.innerText = "";
  alertDesc.innerText = "";
  alertImg.innerText = "";
};

const openAddModal = () => {
  resetForm();
  editServiceId = null;
  modalTitle.innerText = "Thêm dịch vụ mới";
  modalAddService.style.display = "flex";
  btnSaveService.innerText = "Lưu";
};

const closeAddModal = () => {
  modalAddService.style.display = "none";
  btnSaveService.innerText = "";
};

// Mở modal Sửa
const openEditModal = (id) => {
  let service = listClassSchedule.find((service) => {
    return service.id === id;
  });
  if (service) {
    editServiceId = id;
    modalTitle.innerText = "Cập nhật dịch vụ";
    btnSaveService.innerText = "Cập nhật";
    inputName.value = service.name;
    inputDesc.value = service.description;
    inputImg.value = service.image;

    alertName.innerText = "";
    alertDesc.innerText = "";
    alertImg.innerText = "";

    modalAddService.style.display = "flex";
  }
};

btnOpenAdd.addEventListener("click", openAddModal);
btnCloseAdd.addEventListener("click", closeAddModal);

//  Hàm validate và thêm
let btnSaveService = document.getElementById("btnSaveService");

const validateAndSave = () => {
  let valName = inputName.value.trim();
  let valDesc = inputDesc.value.trim();
  let valImg = inputImg.value.trim();
  let isValid = true;

  alertName.innerText = "";
  alertDesc.innerText = "";
  alertImg.innerText = "";

  if (valName === "") {
    alertName.innerText = "Tên dịch vụ không được để trống";
    isValid = false;
  }
  if (valDesc === "") {
    alertDesc.innerText = "Mô tả không được để trống";
    isValid = false;
  }
  if (valImg === "") {
    alertImg.innerText = "Link hình ảnh không được để trống";
    isValid = false;
  }

  // 2. Validate trùng dịch vụ
  let isDuplicate = listClassSchedule.some((service) => {
    return service.name.toLowerCase() === valName.toLowerCase();
  });

  if (isDuplicate) {
    alertName.innerText = "Tên dịch vụ này đã tồn tại";
    isValid = false;
  }
  if (isValid) {
    let formattedName = valName.charAt(0).toUpperCase() + valName.slice(1);

    if (editServiceId !== null) {
      let index = listClassSchedule.findIndex((service) => {
        return service.id === editServiceId;
      });
      if (index !== -1) {
        listClassSchedule[index].name = formattedName;
        listClassSchedule[index].description = valDesc;
        listClassSchedule[index].image = valImg;
      }

      Swal.fire({
        title: "Cập nhật thành công!",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } else {
      let newService = {
        id: Date.now(),
        name: formattedName,
        description: valDesc,
        image: valImg,
      };
      listClassSchedule.push(newService);

      Swal.fire({
        title: "Thêm dịch vụ thành công",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    }
    setListClassSchedule();
    renderServices();
    closeAddModal();
  }
};

btnSaveService.addEventListener("click", validateAndSave);

let modalDelete = document.getElementById("modalDeleteConfirmation");
let btnCloseDelete = document.getElementById("closeDeleteConfirmationModal");
let btnConfirmDelete = document.getElementById("btnConfirmDelete");

let deleteServiceId = null;

const openDeleteModal = (id) => {
  deleteServiceId = id;
  modalDelete.style.display = "flex";
};

const closeDeleteModal = () => {
  modalDelete.style.display = "none";
  deleteServiceId = null;
};

btnCloseDelete.addEventListener("click", closeDeleteModal);

btnConfirmDelete.addEventListener("click", () => {
  if (deleteServiceId !== null) {
    listClassSchedule = listClassSchedule.filter((service) => {
      return service.id !== deleteServiceId;
    });

    setListClassSchedule();
    renderServices();
    closeDeleteModal();

    Swal.fire({
      title: "Xoá lịch thành công",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
    });
  }
});
