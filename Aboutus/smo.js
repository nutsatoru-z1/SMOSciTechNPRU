
let currentChartData = [];

function renderFlowchart() {
    const wrapper = document.getElementById('flowchartWrapper');
    if (!wrapper) return;

    currentChartData = JSON.parse(localStorage.getItem('smo_chart_members') || '[]');

    if (currentChartData.length === 0) {
        wrapper.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-solid fa-users-slash" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--primary-red);"></i>
                        <p style="font-size: 1.1rem; font-weight: 600; color: #fff;">ยังไม่มีข้อมูลคณะกรรมการสโมสร</p>
                        <p style="font-size: 0.85rem; margin-top: 4px;">สามารถเพิ่มข้อมูลรายชื่อและตำแหน่งได้ที่หน้า Admin Center</p>
                    </div>`;
        return;
    }

    const level1 = currentChartData.filter(m => m.level === 'level1' || (!m.level && m.role.includes('นายก') && !m.role.includes('รอง')));
    const level2 = currentChartData.filter(m => m.level === 'level2' || (!m.level && (m.role.includes('รองนายก') || m.role.includes('รองประธาน'))));
    const level3 = currentChartData.filter(m => m.level === 'level3' || (!m.level && (m.role.includes('ฝ่าย') || m.role.includes('ประธาน') || m.role.includes('หัวหน้า')) && !level1.includes(m) && !level2.includes(m)));
    const level4 = currentChartData.filter(m => m.level === 'level4' || (!m.level && !level1.includes(m) && !level2.includes(m) && !level3.includes(m)));

    let html = '';
    let hasPrev = false;

    if (level1.length > 0) {
        const titleText = level1[0].role || 'นายกสโมสรนักศึกษา';
        html += `
                    <div class="level-title"><i class="fa-solid fa-crown" style="color:#e11d48;"></i> ${titleText}</div>
                    <div class="tree-level">`;
        level1.forEach(m => { html += createCardHtml(m, 'level-president'); });
        html += `</div>`;
        hasPrev = true;
    }

    if (level2.length > 0) {
        if (hasPrev) html += `<div class="line-connector"></div>`;
        const titleText = level2[0].role || 'รองนายกสโมสรนักศึกษา';
        html += `
                    <div class="level-title">${titleText}</div>
                    <div class="tree-level">`;
        level2.forEach(m => { html += createCardHtml(m, 'level-vice'); });
        html += `</div>`;
        hasPrev = true;
    }

    if (level3.length > 0) {
        if (hasPrev) html += `<div class="line-connector"></div>`;
        html += `
                    <div class="level-title">หัวหน้าฝ่ายปฏิบัติงาน</div>
                    <div class="tree-level">`;
        level3.forEach(m => { html += createCardHtml(m, ''); });
        html += `</div>`;
        hasPrev = true;
    }

    if (level4.length > 0) {
        if (hasPrev) html += `<div class="line-connector"></div>`;
        html += `
                    <div class="level-title">คณะกรรมการปฏิบัติงาน</div>
                    <div class="tree-level">`;
        level4.forEach(m => { html += createCardHtml(m, ''); });
        html += `</div>`;
    }

    wrapper.innerHTML = html;
}

function createCardHtml(m, customClass) {
    const index = currentChartData.indexOf(m);
    return `
                <div class="node-card ${customClass}" onclick="openMemberModal(${index})">
                    <div class="avatar-box">
                        <img src="${m.img || 'https://via.placeholder.com/150'}" alt="${m.name}">
                    </div>
                    <div class="node-name">${m.name}</div>
                    <div class="node-role">${m.role}</div>
                    ${m.phone ? `<div class="node-phone"><i class="fa-solid fa-phone"></i> ${m.phone}</div>` : ''}
                </div>`;
}

// --- 1. ระบบเปิด Modal ข้อมูลสมาชิก ---
function openMemberModal(index) {
    const m = currentChartData[index];
    if (!m) return;

    const modalBody = document.getElementById('modalBody');
    const levelText = m.level === 'level1' ? 'ฝ่ายบริหาร' :
        m.level === 'level2' ? 'ฝ่ายบริหาร' :
            m.level === 'level3' ? 'ฝ่ายบริหาร' : 'คณะกรรมการปฏิบัติงาน';

    const imgSrc = m.img || 'https://via.placeholder.com/150';

    modalBody.innerHTML = `
                <div class="modal-avatar-wrapper" id="avatarClickTarget">
                    <img src="${imgSrc}" class="modal-avatar-img" id="targetProfileImg" alt="${m.name}">
                    <div class="zoom-hint"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
                </div>
                <h2 class="modal-name">${m.name}</h2>
                <div class="modal-role-badge">${m.role}</div>
                <div class="modal-info-box">
                    <div class="modal-info-item">
                        <i class="fa-solid fa-layer-group"></i>
                        <span><strong>สังกัดฝ่าย/ระดับ:</strong> ${levelText}</span>
                    </div>
                    <div class="modal-info-item">
                        <i class="fa-solid fa-phone"></i>
                        <span><strong>เบอร์โทรศัพท์:</strong> ${m.phone || 'ไม่ได้ระบุ'}</span>
                    </div>
                    <div class="modal-info-item">
                        <i class="fa-solid fa-building-columns"></i>
                        <span>สโมสรนักศึกษา คณะวิทยาศาสตร์และเทคโนโลยี</span>
                    </div>
                </div>
            `;

    document.getElementById('avatarClickTarget').onclick = function (e) {
        e.stopPropagation();
        openImageLightbox();
    };

    document.getElementById('memberModal').style.display = 'flex';
}

// --- 2. ระบบเปิด/ปิด Lightbox รูปภาพขยายใหญ่ ---
function openImageLightbox() {
    const currentImgSrc = document.getElementById('targetProfileImg')?.src;
    if (!currentImgSrc) return;

    document.getElementById('lightboxImg').src = currentImgSrc;
    document.getElementById('imageLightbox').style.display = 'flex';
}

document.getElementById('closeMemberModalBtn').onclick = function () {
    document.getElementById('memberModal').style.display = 'none';
};

document.getElementById('closeLightboxBtn').onclick = function () {
    document.getElementById('imageLightbox').style.display = 'none';
};

document.getElementById('memberModal').onclick = function (e) {
    if (e.target === this) this.style.display = 'none';
};

document.getElementById('imageLightbox').onclick = function (e) {
    if (e.target === this) this.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', renderFlowchart);
