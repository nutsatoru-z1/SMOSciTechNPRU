// --- 1. TAB SWITCHING ---
function switchTab(tabName, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tabName).classList.add('active');
}

// --- 2. IMAGE & FILE PROCESSING ---
// บีบอัดรูปเดี่ยว (รูปปก / รูปโปรไฟล์)
function processImage(input, targetHiddenId, previewImgId, labelId) {
    const file = input.files[0];
    if (!file) return;

    if (labelId && document.getElementById(labelId)) {
        document.getElementById(labelId).innerText = file.name;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const maxWidth = 700;
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.65);
            document.getElementById(targetHiddenId).value = compressedBase64;
            
            if (previewImgId && document.getElementById(previewImgId)) {
                const preview = document.getElementById(previewImgId);
                preview.src = compressedBase64;
                preview.style.display = 'block';
            }
        };
    };
}

// บีบอัดและอัปโหลดหลายรูปพร้อมกัน (รูปกิจกรรม / รูปประกาศเพิ่มเติม)
function processMultipleImages(input, hiddenInputId, previewContainerId, labelId) {
    const files = Array.from(input.files);
    if (!files.length) return;

    if (labelId && document.getElementById(labelId)) {
        document.getElementById(labelId).innerText = `เลือกแล้ว ${files.length} รูป`;
    }
    
    const previewContainer = document.getElementById(previewContainerId);
    if (previewContainer) previewContainer.innerHTML = '';
    
    let processedImages = [];
    let count = 0;

    files.forEach(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxWidth = 700;
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const compressed = canvas.toDataURL('image/jpeg', 0.65);
                processedImages.push(compressed);

                if (previewContainer) {
                    const thumb = document.createElement('img');
                    thumb.src = compressed;
                    thumb.style.cssText = 'width:55px; height:55px; object-fit:cover; border-radius:6px; margin:2px; border:1px solid #cbd5e1;';
                    previewContainer.appendChild(thumb);
                }

                count++;
                if (count === files.length) {
                    document.getElementById(hiddenInputId).value = JSON.stringify(processedImages);
                }
            };
        };
    });
}

// อ่านไฟล์แนบเอกสาร (PDF, Word, Excel)
function processDoc(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        document.getElementById('annDocBase64').value = e.target.result;
        document.getElementById('annDocName').value = file.name;
        if (document.getElementById('annDocStatus')) {
            document.getElementById('annDocStatus').innerText = 'แนบไฟล์เรียบร้อย: ' + file.name;
        }
    };
}

// --- 3. ACTIVITIES ---
function getAct() { return JSON.parse(localStorage.getItem('smo_activities') || '[]'); }
function saveAct(d) { localStorage.setItem('smo_activities', JSON.stringify(d)); renderAct(); }

function renderAct() {
    const tbody = document.getElementById('tableActivities');
    if (!tbody) return;
    tbody.innerHTML = '';
    getAct().forEach((item, i) => {
        let coverImg = 'https://via.placeholder.com/50';
        let countText = '';
        
        if (item.imgs && Array.isArray(item.imgs) && item.imgs.length > 0) {
            coverImg = item.imgs[0];
            countText = `<br><small style="color:var(--primary-red);">${item.imgs.length} รูป</small>`;
        } else if (item.img) {
            coverImg = item.img;
        }

        tbody.innerHTML += `
            <tr>
                <td><img src="${coverImg}" class="img-thumb rect"></td>
                <td style="font-weight:600;">${item.title} ${countText}</td>
                <td>${item.date}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-action btn-edit" onclick="editAct(${i})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-action btn-delete" onclick="deleteAct(${i})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>`;
    });
}

document.getElementById('formActivity').onsubmit = function (e) {
    e.preventDefault();
    const idx = parseInt(document.getElementById('actEditIndex').value);
    const list = getAct();
    
    const rawImgs = document.getElementById('actImgBase64').value;
    let imgsArray = rawImgs ? JSON.parse(rawImgs) : [];
    if (idx !== -1 && imgsArray.length === 0) {
        imgsArray = list[idx].imgs || (list[idx].img ? [list[idx].img] : []);
    }

    const item = {
        title: document.getElementById('actTitle').value.trim(),
        date: document.getElementById('actDate').value.trim(),
        imgs: imgsArray,
        desc: document.getElementById('actDesc').value.trim()
    };

    if (idx === -1) list.unshift(item); else list[idx] = item;
    
    try {
        saveAct(list);
        resetActForm();
    } catch (err) {
        alert('ขนาดรูปภาพรวมกันใหญ่เกินไป กรุณาลดจำนวนรูปภาพหรือขนาดไฟล์');
    }
};

function editAct(i) {
    const item = getAct()[i];
    document.getElementById('actEditIndex').value = i;
    document.getElementById('actTitle').value = item.title || '';
    document.getElementById('actDate').value = item.date || '';
    document.getElementById('actDesc').value = item.desc || '';
    
    let imgsArray = item.imgs || (item.img ? [item.img] : []);
    document.getElementById('actImgBase64').value = JSON.stringify(imgsArray);
    
    const previewContainer = document.getElementById('actPreviewContainer');
    if (previewContainer) {
        previewContainer.innerHTML = '';
        imgsArray.forEach(src => {
            const thumb = document.createElement('img');
            thumb.src = src;
            thumb.style.cssText = 'width:55px; height:55px; object-fit:cover; border-radius:6px; margin:2px; border:1px solid #cbd5e1;';
            previewContainer.appendChild(thumb);
        });
    }

    if (document.getElementById('actCancelBtn')) document.getElementById('actCancelBtn').style.display = 'block';
}

function deleteAct(i) {
    if (confirm('ยืนยันการลบกิจกรรมนี้?')) {
        const l = getAct();
        l.splice(i, 1);
        saveAct(l);
    }
}

function resetActForm() {
    document.getElementById('formActivity').reset();
    document.getElementById('actEditIndex').value = -1;
    document.getElementById('actImgBase64').value = '';
    
    const previewContainer = document.getElementById('actPreviewContainer');
    if (previewContainer) previewContainer.innerHTML = '';
    
    if (document.getElementById('actPreview')) document.getElementById('actPreview').style.display = 'none';
    if (document.getElementById('actCancelBtn')) document.getElementById('actCancelBtn').style.display = 'none';
    if (document.getElementById('actFileName')) document.getElementById('actFileName').innerText = 'เลือกรูปภาพกิจกรรม';
}

// --- 4. ANNOUNCEMENTS ---
function getAnn() { return JSON.parse(localStorage.getItem('smo_announcements') || '[]'); }
function saveAnn(d) { localStorage.setItem('smo_announcements', JSON.stringify(d)); renderAnn(); }

function renderAnn() {
    const tbody = document.getElementById('tableAnnouncements');
    if (!tbody) return;
    tbody.innerHTML = '';
    getAnn().forEach((item, i) => {
        let coverImg = item.img || (item.extraImgs && item.extraImgs.length > 0 ? item.extraImgs[0] : 'https://via.placeholder.com/50');
        let extraText = item.extraImgs && item.extraImgs.length > 0 ? ` (+${item.extraImgs.length} รูป)` : '';

        tbody.innerHTML += `
            <tr>
                <td><img src="${coverImg}" class="img-thumb rect"></td>
                <td style="font-weight:600;">${item.title}${extraText}</td>
                <td>${item.date}</td>
                <td>${item.docName ? `<i class="fa-solid fa-paperclip"></i> ${item.docName}` : '-'}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-action btn-edit" onclick="editAnn(${i})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-action btn-delete" onclick="deleteAnn(${i})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>`;
    });
}

document.getElementById('formAnnouncement').onsubmit = function (e) {
    e.preventDefault();
    const idx = parseInt(document.getElementById('annEditIndex').value);
    const list = getAnn();
    
    const rawExtra = document.getElementById('annExtraImgsBase64') ? document.getElementById('annExtraImgsBase64').value : '';
    let extraArray = rawExtra ? JSON.parse(rawExtra) : [];
    if (idx !== -1 && extraArray.length === 0) {
        extraArray = list[idx].extraImgs || [];
    }

    const item = {
        title: document.getElementById('annTitle').value.trim(),
        date: document.getElementById('annDate').value,
        desc: document.getElementById('annDesc').value.trim(),
        img: document.getElementById('annImgBase64').value || (idx !== -1 ? list[idx].img : ''),
        docBase64: document.getElementById('annDocBase64').value || (idx !== -1 ? list[idx].docBase64 : ''),
        docName: document.getElementById('annDocName').value || (idx !== -1 ? list[idx].docName : ''),
        extraImgs: extraArray
    };

    if (idx === -1) list.unshift(item); else list[idx] = item;
    
    try {
        saveAnn(list);
        resetAnnForm();
    } catch (err) {
        alert('ขนาดไฟล์หรือรูปภาพใหญ่เกินความจุของเบราว์เซอร์');
    }
};

function editAnn(i) {
    const item = getAnn()[i];
    document.getElementById('annEditIndex').value = i;
    document.getElementById('annTitle').value = item.title || '';
    document.getElementById('annDate').value = item.date || '';
    document.getElementById('annDesc').value = item.desc || '';
    document.getElementById('annImgBase64').value = item.img || '';
    document.getElementById('annDocBase64').value = item.docBase64 || '';
    document.getElementById('annDocName').value = item.docName || '';

    if (item.img && document.getElementById('annPreview')) {
        document.getElementById('annPreview').src = item.img;
        document.getElementById('annPreview').style.display = 'block';
    }

    if (item.docName && document.getElementById('annDocStatus')) {
        document.getElementById('annDocStatus').innerText = 'ไฟล์เดิม: ' + item.docName;
    }

    // โหลดพรีวิวรูปภาพเพิ่มเติม
    if (document.getElementById('annExtraImgsBase64')) {
        document.getElementById('annExtraImgsBase64').value = JSON.stringify(item.extraImgs || []);
    }
    const extraPreviewContainer = document.getElementById('annExtraPreviewContainer');
    if (extraPreviewContainer) {
        extraPreviewContainer.innerHTML = '';
        if (item.extraImgs && Array.isArray(item.extraImgs)) {
            item.extraImgs.forEach(src => {
                const thumb = document.createElement('img');
                thumb.src = src;
                thumb.style.cssText = 'width:55px; height:55px; object-fit:cover; border-radius:6px; margin:2px; border:1px solid #cbd5e1;';
                extraPreviewContainer.appendChild(thumb);
            });
        }
    }

    if (document.getElementById('annCancelBtn')) document.getElementById('annCancelBtn').style.display = 'block';
}

function deleteAnn(i) {
    if (confirm('ยืนยันการลบประกาศนี้?')) {
        const l = getAnn();
        l.splice(i, 1);
        saveAnn(l);
    }
}

function resetAnnForm() {
    document.getElementById('formAnnouncement').reset();
    document.getElementById('annEditIndex').value = -1;
    document.getElementById('annImgBase64').value = '';
    document.getElementById('annDocBase64').value = '';
    document.getElementById('annDocName').value = '';
    
    if (document.getElementById('annExtraImgsBase64')) document.getElementById('annExtraImgsBase64').value = '';
    const extraPreviewContainer = document.getElementById('annExtraPreviewContainer');
    if (extraPreviewContainer) extraPreviewContainer.innerHTML = '';

    if (document.getElementById('annPreview')) document.getElementById('annPreview').style.display = 'none';
    if (document.getElementById('annCancelBtn')) document.getElementById('annCancelBtn').style.display = 'none';
    if (document.getElementById('annFileName')) document.getElementById('annFileName').innerText = 'เลือกรูปภาพหน้าปกประกาศ';
    if (document.getElementById('annExtraFileName')) document.getElementById('annExtraFileName').innerText = 'เลือกรูปภาพเพิ่มเติม (ถ้ามี)';
    if (document.getElementById('annDocStatus')) document.getElementById('annDocStatus').innerText = '';
}

// --- 5. CHART (MEMBERS) ---
function getChart() { return JSON.parse(localStorage.getItem('smo_chart_members') || '[]'); }
function saveChart(d) { localStorage.setItem('smo_chart_members', JSON.stringify(d)); renderChart(); }

function renderChart() {
    const tbody = document.getElementById('tableChart');
    if (!tbody) return;
    tbody.innerHTML = '';
    getChart().forEach((item, i) => {
        const levelText = item.level === 'level1' ? 'ระดับ 1 (บริหาร)' :
            item.level === 'level2' ? 'ระดับ 2 (รองบริหาร)' :
                item.level === 'level3' ? 'ระดับ 3 (หัวหน้าฝ่าย)' : 'ระดับ 4 (กรรมการ)';
        tbody.innerHTML += `
            <tr>
                <td><img src="${item.img || 'https://via.placeholder.com/40'}" class="img-thumb"></td>
                <td style="font-weight:600;">${item.name}</td>
                <td>${item.role} <br><small style="color:var(--primary-red);">${levelText}</small></td>
                <td>${item.phone}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-action btn-edit" onclick="editChart(${i})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-action btn-delete" onclick="deleteChart(${i})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>`;
    });
}

document.getElementById('formChart').onsubmit = function (e) {
    e.preventDefault();
    const idx = parseInt(document.getElementById('chartEditIndex').value);
    const list = getChart();
    const item = {
        name: document.getElementById('chartName').value.trim(),
        role: document.getElementById('chartRole').value.trim(),
        level: document.getElementById('chartLevel') ? document.getElementById('chartLevel').value : 'level4',
        phone: document.getElementById('chartPhone').value.trim(),
        img: document.getElementById('chartImgBase64').value
    };
    if (idx === -1) list.push(item); else list[idx] = item;
    saveChart(list);
    resetChartForm();
};

function editChart(i) {
    const item = getChart()[i];
    document.getElementById('chartEditIndex').value = i;
    document.getElementById('chartName').value = item.name;
    document.getElementById('chartRole').value = item.role;
    if (document.getElementById('chartLevel')) {
        document.getElementById('chartLevel').value = item.level || 'level4';
    }
    document.getElementById('chartPhone').value = item.phone;
    document.getElementById('chartImgBase64').value = item.img;
    if (item.img && document.getElementById('chartPreview')) {
        document.getElementById('chartPreview').src = item.img;
        document.getElementById('chartPreview').style.display = 'block';
    }
    if (document.getElementById('chartCancelBtn')) document.getElementById('chartCancelBtn').style.display = 'block';
}

function deleteChart(i) {
    if (confirm('ยืนยันการลบสมาชิกท่านนี้?')) {
        const l = getChart();
        l.splice(i, 1);
        saveChart(l);
    }
}

function resetChartForm() {
    document.getElementById('formChart').reset();
    document.getElementById('chartEditIndex').value = -1;
    document.getElementById('chartImgBase64').value = '';
    if (document.getElementById('chartLevel')) document.getElementById('chartLevel').value = 'level4';
    if (document.getElementById('chartPreview')) document.getElementById('chartPreview').style.display = 'none';
    if (document.getElementById('chartCancelBtn')) document.getElementById('chartCancelBtn').style.display = 'none';
    if (document.getElementById('chartFileName')) document.getElementById('chartFileName').innerText = 'เลือกรูปโปรไฟล์';
}

// --- 6. HEADS ---
function getHeads() { return JSON.parse(localStorage.getItem('smo_heads') || '[]'); }
function saveHeads(d) { localStorage.setItem('smo_heads', JSON.stringify(d)); renderHeads(); }

function renderHeads() {
    const tbody = document.getElementById('tableHeads');
    if (!tbody) return;
    tbody.innerHTML = '';
    getHeads().forEach((item, i) => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${item.img || 'https://via.placeholder.com/40'}" class="img-thumb"></td>
                <td style="font-weight:600;">${item.name}</td>
                <td>หมู่ ${item.section} (${item.major})</td>
                <td>${item.phone}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-action btn-edit" onclick="editHead(${i})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-action btn-delete" onclick="deleteHead(${i})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>`;
    });
}

document.getElementById('formHead').onsubmit = function (e) {
    e.preventDefault();
    const idx = parseInt(document.getElementById('headEditIndex').value);
    const list = getHeads();
    const item = {
        name: document.getElementById('headName').value.trim(),
        section: document.getElementById('headSection').value.trim(),
        major: document.getElementById('headMajor').value.trim(),
        phone: document.getElementById('headPhone').value.trim(),
        img: document.getElementById('headImgBase64').value
    };
    if (idx === -1) list.push(item); else list[idx] = item;
    saveHeads(list);
    resetHeadForm();
};

function editHead(i) {
    const item = getHeads()[i];
    document.getElementById('headEditIndex').value = i;
    document.getElementById('headName').value = item.name;
    document.getElementById('headSection').value = item.section;
    document.getElementById('headMajor').value = item.major;
    document.getElementById('headPhone').value = item.phone;
    document.getElementById('headImgBase64').value = item.img;
    if (item.img && document.getElementById('headPreview')) {
        document.getElementById('headPreview').src = item.img;
        document.getElementById('headPreview').style.display = 'block';
    }
    if (document.getElementById('headCancelBtn')) document.getElementById('headCancelBtn').style.display = 'block';
}

function deleteHead(i) {
    if (confirm('ยืนยันการลบหัวหน้าหมู่เรียนท่านนี้?')) {
        const l = getHeads();
        l.splice(i, 1);
        saveHeads(l);
    }
}

function resetHeadForm() {
    document.getElementById('formHead').reset();
    document.getElementById('headEditIndex').value = -1;
    document.getElementById('headImgBase64').value = '';
    if (document.getElementById('headPreview')) document.getElementById('headPreview').style.display = 'none';
    if (document.getElementById('headCancelBtn')) document.getElementById('headCancelBtn').style.display = 'none';
    if (document.getElementById('headFileName')) document.getElementById('headFileName').innerText = 'เลือกรูปโปรไฟล์';
}

// --- INIT ALL ---
document.addEventListener('DOMContentLoaded', function () {
    renderAct();
    renderAnn();
    renderChart();
    renderHeads();
});