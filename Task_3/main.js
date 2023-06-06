
let GROUP_ITEM = ` 
<div class="group-item">
    <div class="item-title togglable">
        <span>Item Info Name</span>
        <input type="text" name="" id="" value="Item Info Name">
    </div>
    <div class="item-data togglable">
        <span>Item Info Value</span>
        <input type="text" name="" id="" value="Item Info Value">
    </div>
    <span class="img-button delete-button" data-html2canvas-ignore="true">
        <img src="./images/delete-icon.png" alt="" title="Delete Item" style="width: 20px;">
    </span>
</div>
`
let GROUP = `
<div class="group-card">
    <div class="group-title">
        <span class="title-text togglable">
            <span>Group Item</span>
            <input type="text" name="" id="" value="Group Item">
        </span>
        <span class="img-button delete-button" data-html2canvas-ignore="true">
            <img src="./images/delete-icon.png" alt="delete-icon" title="Delete Group">
        </span>
        <span class="splitter"></span>
        <span class="img-button add-item-button" data-html2canvas-ignore="true">
            <img src="./images/add-icon.png" alt="add-item-icon" title="New Item">
        </span>
        <span class="img-button add-group-button" data-html2canvas-ignore="true">
            <img src="./images/duplicate-icon.png" alt="new-group-icon" title="New Group">
        </span>
    </div>
    <div class="group-content">
    </div>
</div>
`

function dblclickHandler(event) {
    let target = event.target;
    let parentClassList = target.parentNode.classList;
    if (parentClassList.contains("togglable")) {
        parentClassList.toggle("editable");
        target.parentNode.lastElementChild.select(); // input
    }
}

function keydownHandler(event) {
    if (event.keyCode == 13) { // ENTER
        let target = event.target;
        let parentClassList = target.parentNode.classList;
        if (parentClassList.contains("togglable")) {
            parentClassList.toggle("editable");
            target.previousElementSibling.innerText = target.value;
        }
    }
}

function clickHandler(event) {
    let target = event.target;
    let title = target.title;
    if (title == "New Item") {
        let group_element = target.closest(".group-title").nextElementSibling;
        group_element.insertAdjacentHTML("beforeend", GROUP_ITEM);
    }
    else if (title == "New Group") {
        let group_element = target.closest(".group-card");
        group_element.insertAdjacentHTML("afterend", GROUP);
    }
    else if (title == "Delete Group") {
        answer = window.confirm("Tác giả Vũ Xuân Bắc 20194230 cần bạn xác nhận:\n      Bạn có muốn xóa GROUP này không?");
        if (answer) {
            let group_element = target.closest(".group-card");
            group_element.remove();
        }
    }
    else if (title == "Delete Item") {
        answer = window.confirm("Tác giả Vũ Xuân Bắc 20194230 cần bạn xác nhận:\n      Bạn có muốn xóa ITEM này không?");
        if (answer) {
            let group_item_element = target.closest(".group-item");
            group_item_element.remove();
        }
    }
    else if (title == "Download as PDF") {
        makePDF();
    }
}

document.addEventListener("dblclick", dblclickHandler, true);
document.addEventListener("keydown", keydownHandler, true);
document.addEventListener("click", clickHandler, true);

function makePDF() {
    const padding_vertical = 10;
    const padding_horizontal = 0;

    let source = document.getElementById('main-content');

    html2canvas(source).then(canvas => {
        let pdf = new jspdf.jsPDF('p', 'px', 'a4');
        let pageWidth = pdf.internal.pageSize.getWidth();
        let pageHeight = pdf.internal.pageSize.getHeight();
        let drawingWidth = pageWidth - 2 * padding_horizontal;
        let drawingHeight = pageHeight - 2 * padding_vertical;

        let currentContentWidth = canvas.width;
        let maxContentHeight = drawingHeight / drawingWidth * canvas.width;
        let ratio = drawingWidth / canvas.width;

        // console.log('       Page Size:', drawingHeight, ' x ', drawingWidth);
        // console.log('Actual Page Size:', maxContentHeight, ' x ', currentContentWidth);
        let remainContentHeight = canvas.height;
        let n_pages = canvas.height / maxContentHeight;

        for (let p = 0; p < n_pages; ++p) {
            let pageCanvas = document.createElement('canvas');

            let pageContext = pageCanvas.getContext('2d');
            let currentContentHeight = Math.min(remainContentHeight, maxContentHeight);

            pageCanvas.width = currentContentWidth;
            pageCanvas.height = currentContentHeight;

            pageContext.drawImage(canvas, 0, p * maxContentHeight, currentContentWidth, currentContentHeight, 0, 0, currentContentWidth, currentContentHeight);

            if (p > 0) {
                pdf.addPage('p', 'px', 'a4');
                pdf.setPage(p + 1);
            }

            pdf.addImage(pageCanvas.toDataURL('image/png', 1.0), 'PNG', padding_horizontal, padding_vertical, currentContentWidth * ratio, currentContentHeight * ratio);
            remainContentHeight -= maxContentHeight;
        }
        pdf.save('ThongTinSinhVien.pdf');
    });
}
