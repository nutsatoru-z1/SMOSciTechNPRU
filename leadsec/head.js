
document.addEventListener('DOMContentLoaded', function () {
    loadHeadsData();
});

// ดึงข้อมูลหัวหน้าหมู่เรียนจาก localStorage ที่บันทึกมาจากหน้าแอดมิน
function getStoredHeads() {
    const stored = localStorage.getItem('smo_heads');
    return stored ? JSON.parse(stored) : [];
}
function loadHeadsData() {
    const heads = getStoredHeads();
    const filterContainer = document.getElementById('batchFilterContainer');
    const gridContainer = document.getElementById('headsGridContainer');

    if (heads.length === 0) {
        gridContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted); padding: 3rem;">ยังไม่มีข้อมูลหัวหน้าหมู่เรียนในระบบ</p>`;
        return;
    }

    // 1. สร้างปุ่ม Filter รหัสรุ่นอัตโนมัติจากข้อมูลจริง
    const batches = [...new Set(heads.map(h => h.batch || (h.section ? h.section.substring(0, 2) : 'อื่นๆ')))].sort().reverse();

    let filterHTML = `<button class="year-btn active" onclick="filterBatch('all', this)"><i class="fa-solid fa-layer-group"></i> ทั้งหมด</button>`;
    batches.forEach(b => {
        filterHTML += `<button class="year-btn" onclick="filterBatch('${b}', this)"><i class="fa-solid fa-graduation-cap"></i> รหัสรุ่น ${b}</button>`;
    });
    filterContainer.innerHTML = filterHTML;

    // 2. เรนเดอร์การ์ดแสดงผล
    renderCards(heads);
}

function renderCards(heads) {
    const gridContainer = document.getElementById('headsGridContainer');
    if (!gridContainer) return;

    if (heads.length === 0) {
        gridContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted); padding: 3rem;">ยังไม่มีข้อมูลหัวหน้าหมู่เรียนในระบบ</p>`;
        return;
    }

    let html = '';
    heads.forEach((h) => {
        const name = h.name || '-';
        const section = h.section || '-';
        const major = h.major || '-';
        const phone = h.phone || '-';
        const batch = h.batch || (section !== '-' ? section.substring(0, 2) : '67');
        const img = h.img || 'https://via.placeholder.com/150';

        // หลีกเลี่ยงปัญหาเครื่องหมายคำพูดซ้อนในพารามิเตอร์
        const safeName = name.replace(/'/g, "\\'");
        const safeMajor = major.replace(/'/g, "\\'");
        const safeImg = img.replace(/'/g, "\\'");

        html += `
            <div class="head-card" data-batch="${batch}" onclick="openHeadModal('${safeName}', '${safeMajor}', '${section}', '${phone}', '${safeImg}')">
                <span class="year-badge">รุ่น ${batch}</span>
                <div class="head-img-wrapper">
                    <img src="${img}" alt="Head" class="head-img" onerror="this.src='https://via.placeholder.com/150'">
                </div>
                <h3 class="head-name">${name}</h3>
                <p class="head-dept">${major}<br><small style="color:var(--primary-red);">หมู่เรียน ${section}</small></p>
                <div class="head-contact-mini"><i class="fa-solid fa-phone"></i> ${phone}</div>
            </div>
        `;
    });
    gridContainer.innerHTML = html;
}

// ฟังก์ชันกรองตามรหัสรุ่น
function filterBatch(batch, btnElement) {
    document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');

    const cards = document.querySelectorAll('.head-card');
    cards.forEach(card => {
        if (batch === 'all' || card.getAttribute('data-batch') === batch) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// เปิด Modal รายละเอียดการ์ด และผูกคลิกขยายรูปที่ตัวรูปภาพข้างใน
function openHeadModal(name, major, section, phone, imgUrl) {
    document.getElementById('mHeadName').innerText = name;
    document.getElementById('mHeadDept').innerText = `${major} (หมู่ ${section})`;
    document.getElementById('mHeadId').innerText = 'หมู่เรียน (Section): ' + section;
    document.getElementById('mHeadPhone').innerText = 'เบอร์โทรศัพท์: ' + phone;
    document.getElementById('mHeadEmail').innerText = 'สถานะ: หัวหน้าหมู่เรียน';

    const modalImg = document.getElementById('mHeadImg');
    modalImg.src = imgUrl;
    modalImg.style.cursor = 'pointer';
    modalImg.title = 'คลิกเพื่อขยายรูปภาพ';

    // พอกดที่รูปในหน้าต่างรายละเอียด จะเรียกฟังก์ชันซูมภาพใหญ่ทันที
    modalImg.onclick = function (e) {
        e.stopPropagation();
        openImageZoom(imgUrl);
    };

    document.getElementById('headDetailModal').style.display = 'flex';
}

function closeHeadModalDirect() {
    document.getElementById('headDetailModal').style.display = 'none';
}

function closeHeadModal(e) {
    if (e.target.id === 'headDetailModal') {
        closeHeadModalDirect();
    }
}

// ฟังก์ชันสำหรับเปิด Lightbox ขยายรูปภาพเต็มจอ
function openImageZoom(imgUrl) {
    const modal = document.getElementById('imageZoomModal');
    const zoomedImg = document.getElementById('zoomedImage');

    zoomedImg.src = imgUrl || 'https://via.placeholder.com/300';
    modal.style.display = 'flex';
}

function closeImageZoomDirect() {
    document.getElementById('imageZoomModal').style.display = 'none';
}

function closeImageZoom(e) {
    if (e.target.id === 'imageZoomModal') {
        closeImageZoomDirect();
    }
}

// Admin Auth
const ADMIN_PASS = 'Smosci2569';
function openAdminAuthModal() {
    document.getElementById('adminPassInput').value = '';
    document.getElementById('adminAuthError').innerText = '';
    document.getElementById('adminAuthModal').style.display = 'flex';
    setTimeout(() => document.getElementById('adminPassInput').focus(), 100);
}
function closeAdminAuthModalDirect() {
    document.getElementById('adminAuthModal').style.display = 'none';
}
function closeAdminAuthModal(e) {
    if (e.target.id === 'adminAuthModal') closeAdminAuthModalDirect();
}
function verifyAdminPassword() {
    const input = document.getElementById('adminPassInput');
    const err = document.getElementById('adminAuthError');
    if (input.value === ADMIN_PASS) {
        err.style.color = '#10b981';
        err.innerText = 'รหัสผ่านถูกต้อง กำลังเข้าสู่ระบบ...';
        setTimeout(() => window.location.href = '../admin/adminpage.html', 500);
    } else {
        err.style.color = '#e11d48';
        err.innerText = 'รหัสผ่านไม่ถูกต้อง';
        input.value = '';
        input.focus();
    }
}
// ฟังก์ชันเปิดรูปขยายใหญ่ (ส่ง URL รูปเข้ามา)
function openImageZoom(imgUrl, event) {
    if (event) event.stopPropagation(); // ป้องกันไม่ให้กดทับกับการคลิกเปิดการ์ดหลัก
    const modal = document.getElementById('imageZoomModal');
    const zoomedImg = document.getElementById('zoomedImage');

    zoomedImg.src = imgUrl || 'https://via.placeholder.com/300';
    modal.style.display = 'flex';
}

function closeImageZoomDirect() {
    document.getElementById('imageZoomModal').style.display = 'none';
}

function closeImageZoom(e) {
    if (e.target.id === 'imageZoomModal') {
        closeImageZoomDirect();
    }
}

// --- HELPER: อ่านรูปหลายรูปและบีบอัดเป็น Array ---
function processMultipleImages(input, hiddenInputId, previewContainerId, labelId) {
    const files = Array.from(input.files);
    if (!files.length) return;

    document.getElementById(labelId).innerText = `เลือกแล้ว ${files.length} รูป`;
    const previewContainer = document.getElementById(previewContainerId);
    previewContainer.innerHTML = '';

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
                const maxWidth = 800;
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const compressed = canvas.toDataURL('image/jpeg', 0.7);
                processedImages.push(compressed);

                // สร้าง Preview
                const thumb = document.createElement('img');
                thumb.src = compressed;
                thumb.className = 'img-thumb-preview';
                thumb.style.cssText = 'width:60px; height:60px; object-fit:cover; border-radius:6px; margin:2px; border:1px solid #ddd;';
                previewContainer.appendChild(thumb);

                count++;
                if (count === files.length) {
                    document.getElementById(hiddenInputId).value = JSON.stringify(processedImages);
                }
            };
        };
    });
}

// --- 3. ACTIVITIES (ปรับรองรับหลายรูป) ---
function getAct() { return JSON.parse(localStorage.getItem('smo_activities') || '[]'); }
function saveAct(d) { localStorage.setItem('smo_activities', JSON.stringify(d)); renderAct(); }

document.getElementById('formActivity').onsubmit = function (e) {
    e.preventDefault();
    const idx = parseInt(document.getElementById('actEditIndex').value);
    const list = getAct();

    // ดึง Array รูปภาพ (ถ้าไม่ได้เลือกใหม่ตอนแก้ไข ให้ใช้รูปเดิม)
    const rawImgs = document.getElementById('actImgBase64').value;
    let imgsArray = rawImgs ? JSON.parse(rawImgs) : [];
    if (idx !== -1 && imgsArray.length === 0) {
        imgsArray = list[idx].imgs || (list[idx].img ? [list[idx].img] : []);
    }

    const item = {
        title: document.getElementById('actTitle').value.trim(),
        date: document.getElementById('actDate').value.trim(),
        imgs: imgsArray, // เก็บรูปเป็น Array
        desc: document.getElementById('actDesc').value.trim()
    };

    if (idx === -1) list.unshift(item); else list[idx] = item;
    try { saveAct(list); resetActForm(); }
    catch (err) { alert('ขนาดไฟล์ภาพรวมกันใหญ่เกินไป กรุณาลดจำนวนรูปภาพ'); }
};

// --- 4. ANNOUNCEMENTS (สลับโหมด: แนบไฟล์เอกสาร OR แนบรูปหลายรูป) ---
function getAnn() { return JSON.parse(localStorage.getItem('smo_announcements') || '[]'); }
function saveAnn(d) { localStorage.setItem('smo_announcements', JSON.stringify(d)); renderAnn(); }

function toggleAnnType() {
    const type = document.getElementById('annTypeSelect').value;
    if (type === 'file') {
        document.getElementById('annFileGroup').style.display = 'block';
        document.getElementById('annImagesGroup').style.display = 'none';
    } else {
        document.getElementById('annFileGroup').style.display = 'none';
        document.getElementById('annImagesGroup').style.display = 'block';
    }
}

document.getElementById('formAnnouncement').onsubmit = function (e) {
    e.preventDefault();
    const idx = parseInt(document.getElementById('annEditIndex').value);
    const list = getAnn();
    const type = document.getElementById('annTypeSelect').value;

    const rawImgs = document.getElementById('annImgBase64').value;
    let imgsArray = rawImgs ? JSON.parse(rawImgs) : [];
    if (idx !== -1 && imgsArray.length === 0 && type === 'images') {
        imgsArray = list[idx].imgs || [];
    }

    const item = {
        title: document.getElementById('annTitle').value.trim(),
        date: document.getElementById('annDate').value,
        desc: document.getElementById('annDesc').value.trim(),
        attachmentType: type, // 'file' หรือ 'images'
        docBase64: type === 'file' ? document.getElementById('annDocBase64').value : '',
        docName: type === 'file' ? document.getElementById('annDocName').value : '',
        imgs: type === 'images' ? imgsArray : []
    };

    if (idx === -1) list.unshift(item); else list[idx] = item;
    try { saveAnn(list); resetAnnForm(); }
    catch (err) { alert('ขนาดรูปภาพใหญ่เกินความจุของเบราว์เซอร์'); }
};