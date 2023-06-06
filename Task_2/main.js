let avatar_img = document.getElementById("avatar");
let temp_avatar_img = document.getElementById("temp-avatar");
let avatar_src = avatar_img.src;
temp_avatar_img.src = avatar_src;
// Xử lý đổi ảnh
document.getElementById("avatar-input").onchange = function (evt) {
    let tgt = evt.target;
    let files = tgt.files;
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            temp_avatar_img.src = fr.result;
        }
        fr.readAsDataURL(files[0])
        avatar_img.style.display = "none";
        temp_avatar_img.style.display = "inline";
        avatar_src = temp_avatar_img.src;
    }
}

function reset_avatar() {
    temp_avatar_img.src = avatar_img.src;
    avatar_img.style.display = "inline";
    temp_avatar_img.style.display = "none";
}

let is_editing = false;

let edit_button = document.getElementById("edit-button");
let ok_button = document.getElementById("ok-button");
let cancel_button = document.getElementById("cancel-button");
let reset_button = document.getElementById("reset-button");
let mainform = document.forms[0];

function set_edit_mode() {
    is_editing = true;
    mainform.elements['avatar'].style.display = "block";
    document.getElementById("edit_mode_buttons").style.display = "block";
    document.getElementById("view_mode_buttons").style.display = "none";
    for (ele of mainform.querySelectorAll(".editable-field")) {
        ele.style.display = "inline";
    }
    for (raw of mainform.querySelectorAll(".raw-data")) {
        raw.style.display = "none";
    }
}

function set_view_mode() {
    is_editing = false;
    mainform.elements['avatar'].style.display = "none";
    document.getElementById("view_mode_buttons").style.display = "block";
    document.getElementById("edit_mode_buttons").style.display = "none";
    for (ele of mainform.querySelectorAll(".editable-field")) {
        ele.style.display = "none";
    }
    for (raw of mainform.querySelectorAll(".raw-data")) {
        raw.style.display = "inline";
    }
}

set_view_mode();
////////////////// Form Fields 
let TTSV = {
    "ho_ten": "Vũ Xuân Bắc",
    "nam_vao_truong": 2019,
    "lop": "Kỹ thuật máy tính 02-K64",
    "bac_dao_tao": "Đại học đại trà",
    "chuong_trinh": "Kỹ thuật máy tính",
    "khoa_vien": "Trường Công nghệ thông tin và Truyền thông",
    "trang_thai": "Học",
    "email": "bac.vx194586@sis.hust.edu.vn",
    "khoa_hoc": 64,
    "gioi_tinh": "Nam"
};

function populate_data(TTSV) {
    mainform.reset();
    Object.keys(TTSV).forEach(key => {
        if (key == "gioi_tinh") {
            document.getElementById("edit-gender").previousElementSibling.innerHTML = TTSV[key];
            mainform.querySelector(`input[name=${key}][value=${TTSV[key]}]`).setAttribute("checked", true);
            return;
        }
        edit_field = mainform.elements[key];
        if ((edit_field.tagName == "INPUT") || (edit_field.tagName == "SELECT")) {
            edit_field.value = TTSV[key];
        }
        edit_field.previousElementSibling.innerHTML = TTSV[key];
    })
}

function change_data() {
    Object.keys(TTSV).forEach(key => {
        if (key == "gioi_tinh") {
            TTSV[key] = mainform.querySelector(`input[name=${key}]:checked`).value;
            document.getElementById("edit-gender").previousElementSibling.innerHTML = TTSV[key];
            return;
        }
        edit_field = mainform.elements[key];
        if ((edit_field.tagName == "INPUT") || (edit_field.tagName == "SELECT")) {
            TTSV[key] = edit_field.value;
        }
        edit_field.previousElementSibling.innerHTML = TTSV[key];
    })
}

edit_button.addEventListener("click", function () {
    populate_data(TTSV);
    set_edit_mode();
})

ok_button.addEventListener("click", function () {
    if (mainform.reportValidity()) {
        avatar_img.src = temp_avatar_img.src;
        mainform.elements['avatar'].value = "";
        reset_avatar();
        change_data();
        set_view_mode();
        console.log('After OK', TTSV);
    }
})

cancel_button.addEventListener("click", function () {
    reset_avatar();
    set_view_mode();
    console.log('After Cancel', TTSV);
})

reset_button.addEventListener("click", function () {
    populate_data(TTSV);
    reset_avatar();
    console.log('After Reset', TTSV);
})

window.onload = () => {
    populate_data(TTSV);
};