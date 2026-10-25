// --- 1. RENDER ANNOUNCEMENTS (รองรับรูปภาพเพิ่มเติม + ไฟล์แนบ) ---
function renderAnnouncements() {
    const annGrid = document.getElementById('announcementsGrid');
    if (!annGrid) return;

    const rawData = localStorage.getItem('smo_announcements');
    let data = rawData ? JSON.parse(rawData) : [];

    if (data.length === 0) {
        annGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2.5rem; background: #ffffff; border-radius: 12px; border: 1px dashed var(--border-color);">
                <i class="fa-solid fa-bullhorn" style="font-size: 1.8rem; margin-bottom: 8px; color: var(--primary-red);"></i>
                <p>ยังไม่มีข่าวประชาสัมพันธ์ในขณะนี้</p>
            </div>`;
        return;
    }

    let html = '';
    data.forEach((item, index) => {
        // ดึงรูปปกหลัก หรือรูปแรกจาก extraImgs
        let imgUrl = item.img || (item.extraImgs && item.extraImgs.length > 0 ? item.extraImgs[0] : 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80');

        let badgeHTML = '';
        if (item.extraImgs && item.extraImgs.length > 0) {
            badgeHTML = `<span class="card-category" style="left: auto; right: 12px;"><i class="fa-solid fa-images"></i> +${item.extraImgs.length} รูป</span>`;
        }

        html += `
            <article class="news-card" onclick="openAnnModal(${index})" style="cursor: pointer;">
                <div class="card-img-wrapper">
                    <img src="${imgUrl}" alt="${item.title}" class="card-img">
                    <span class="card-category">ข่าวประกาศ</span>
                    ${badgeHTML}
                </div>
                <div class="card-body">
                    <div class="card-date"><i class="fa-regular fa-calendar"></i> ${item.date || 'ไม่ระบุวันที่'}</div>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-desc">${item.desc || ''}</p>
                    <div class="card-footer">
                        ${item.docBase64 || item.docName ? `<span style="font-size:0.85rem; color:var(--primary-red);"><i class="fa-solid fa-file-pdf"></i> มีไฟล์แนบ</span>` : '<span></span>'}
                        <button class="read-more-btn">อ่านรายละเอียด <i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
            </article>`;
    });

    annGrid.innerHTML = html;
}

// --- 2. RENDER ACTIVITIES (อัปเดตให้รองรับหลายรูป) ---
function renderActivities() {
    const actGrid = document.getElementById('activitiesGrid');
    if (!actGrid) return;

    const rawData = localStorage.getItem('smo_activities');
    let data = rawData ? JSON.parse(rawData) : [];

    if (data.length === 0) {
        actGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2.5rem; background: #ffffff; border-radius: 12px; border: 1px dashed var(--border-color);">
                <i class="fa-regular fa-calendar-xmark" style="font-size: 1.8rem; margin-bottom: 8px; color: var(--primary-red);"></i>
                <p>ยังไม่มีกิจกรรมประชาสัมพันธ์ในขณะนี้</p>
            </div>`;
        return;
    }

    actGrid.innerHTML = '';
    data.forEach((item, index) => {
        // ดึงรูปแรกจาก imgs มาแสดงเป็นรูปปกการ์ด
        let imgUrl = 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80';
        let imgCount = 0;

        if (item.imgs && Array.isArray(item.imgs) && item.imgs.length > 0) {
            imgUrl = item.imgs[0];
            imgCount = item.imgs.length;
        } else if (item.img) {
            imgUrl = item.img;
            imgCount = 1;
        }

        let badgeHTML = '';
        if (imgCount > 1) {
            badgeHTML = `<span class="card-category" style="left: auto; right: 12px;"><i class="fa-solid fa-images"></i> ${imgCount} รูป</span>`;
        }

        actGrid.innerHTML += `
            <article class="news-card" onclick="openActModal(${index})" style="cursor: pointer;">
                <div class="card-img-wrapper">
                    <img src="${imgUrl}" alt="${item.title}" class="card-img">
                    <span class="card-category">กิจกรรม</span>
                    ${badgeHTML}
                </div>
                <div class="card-body">
                    <div class="card-date" style="color: var(--primary-red); font-weight: 600;">
                        <i class="fa-regular fa-clock"></i> ${item.date || 'ไม่ระบุช่วงเวลา'}
                    </div>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-desc">${item.desc || ''}</p>
                    <div class="card-footer">
                        <button class="read-more-btn">ดูรายละเอียดกิจกรรม <i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
            </article>`;
    });
}

// --- 3. RENDER HEADS ---
function renderHeads() {
    const headsGrid = document.getElementById('headsGrid');
    if (!headsGrid) return;

    const rawData = localStorage.getItem('smo_heads');
    let data = rawData ? JSON.parse(rawData) : [];

    if (data.length === 0) {
        headsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2.5rem; background: #ffffff; border-radius: 12px; border: 1px dashed var(--border-color);">
                <i class="fa-solid fa-users-slash" style="font-size: 1.8rem; margin-bottom: 8px; color: var(--primary-red);"></i>
                <p>ยังไม่มีข้อมูลหัวหน้าหมู่เรียนในขณะนี้</p>
            </div>`;
        return;
    }

    headsGrid.innerHTML = '';
    data.forEach(item => {
        const imgUrl = item.img || 'https://via.placeholder.com/150';
        headsGrid.innerHTML += `
            <div style="background: #ffffff; border: 1px solid var(--border-color); border-radius: 12px; padding: 1.25rem; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <div style="width: 80px; height: 80px; margin: 0 auto 1rem; border-radius: 50%; overflow: hidden; border: 2px solid var(--primary-red); cursor: pointer;" onclick="openImageZoom('${imgUrl}')">
                    <img src="${imgUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-dark); margin-bottom: 4px;">${item.name}</h4>
                <p style="font-size: 0.85rem; color: var(--primary-red); font-weight: 600;">หมู่ ${item.section} (${item.major})</p>
                ${item.phone ? `<p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 6px;"><i class="fa-solid fa-phone"></i> ${item.phone}</p>` : ''}
            </div>`;
    });
}

function filterActivities(category, btn) {
    document.querySelectorAll('#activities-section .filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const cards = document.querySelectorAll('#activitiesGrid .news-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- ฟังก์ชันเปิด Modal ข่าวสาร (รองรับรูปหลัก รูปเพิ่มเติม และดาวน์โหลดไฟล์แนบ) ---
function openAnnModal(index) {
    const rawData = localStorage.getItem('smo_announcements');
    const dataList = rawData ? JSON.parse(rawData) : [];
    const data = dataList[index];
    if (!data) return;

    const modalTitle = document.getElementById('detailTitle');
    const modalDate = document.getElementById('dateText');
    const modalDesc = document.getElementById('detailDesc');
    const mainImg = document.getElementById('detailMainImg');
    const fileBox = document.getElementById('detailFileBox');
    const extraBox = document.getElementById('detailExtraImagesBox');

    modalTitle.innerText = data.title || '-';
    modalDate.innerText = data.date || '-';
    modalDesc.innerText = data.desc || 'ไม่มีรายละเอียดเพิ่มเติม';

    // แสดงรูปปกหลัก (ถ้ามี) และคลิกเพื่อขยายใหญ่ได้
    let mainImgSrc = data.img || (data.extraImgs && data.extraImgs.length > 0 ? data.extraImgs[0] : '');
    if (mainImgSrc) {
        mainImg.src = mainImgSrc;
        mainImg.style.display = 'block';
        mainImg.style.cursor = 'pointer';
        mainImg.onclick = function () { openImageZoom(mainImgSrc); };
    } else {
        mainImg.style.display = 'none';
    }

    // แสดงปุ่มดาวน์โหลดไฟล์เอกสารแนบ (ถ้ามี)
    if (data.docBase64 && data.docName) {
        fileBox.style.display = 'block';
        fileBox.innerHTML = `
            <a href="${data.docBase64}" download="${data.docName}" class="btn-open-file">
                <i class="fa-solid fa-download"></i> ดาวน์โหลดไฟล์แนบ (${data.docName})
            </a>`;
    } else {
        fileBox.style.display = 'none';
    }

    // แสดงรูปภาพเพิ่มเติม (Extra Images)
    extraBox.innerHTML = '';
    if (data.extraImgs && Array.isArray(data.extraImgs) && data.extraImgs.length > 0) {
        extraBox.style.display = 'block';
        let extraHTML = '<h4 style="font-size:0.95rem; margin-bottom:8px; color:var(--text-dark);">รูปภาพเพิ่มเติม:</h4><div style="display:flex; gap:8px; flex-wrap:wrap;">';
        data.extraImgs.forEach((imgUrl) => {
            extraHTML += `<img src="${imgUrl}" style="width:70px; height:70px; object-fit:cover; border-radius:8px; cursor:pointer; border:1px solid var(--border-color);" onclick="document.getElementById('detailMainImg').src='${imgUrl}'; document.getElementById('detailMainImg').onclick = function() { openImageZoom('${imgUrl}'); };" title="คลิกเพื่อดูรูปนี้">`;
        });
        extraHTML += '</div>';
        extraBox.innerHTML = extraHTML;
    } else {
        extraBox.style.display = 'none';
    }

    document.getElementById('postDetailModal').style.display = 'flex';
}

// --- ฟังก์ชันเปิด Modal กิจกรรม (รองรับการแสดงรูปทั้งหมดและคลิกขยาย) ---
function openActModal(index) {
    const rawData = localStorage.getItem('smo_activities');
    const dataList = rawData ? JSON.parse(rawData) : [];
    const data = dataList[index];
    if (!data) return;

    const modalTitle = document.getElementById('detailTitle');
    const modalDate = document.getElementById('dateText');
    const modalDesc = document.getElementById('detailDesc');
    const mainImg = document.getElementById('detailMainImg');
    const fileBox = document.getElementById('detailFileBox');
    const extraBox = document.getElementById('detailExtraImagesBox');

    modalTitle.innerText = data.title || '-';
    modalDate.innerText = data.date || '-';
    modalDesc.innerText = data.desc || 'ไม่มีรายละเอียดเพิ่มเติม';
    fileBox.style.display = 'none';

    // รวบรวมรูปภาพทั้งหมด
    let imagesList = [];
    if (data.imgs && Array.isArray(data.imgs)) {
        imagesList = data.imgs;
    } else if (data.img) {
        imagesList = [data.img];
    }

    // แสดงรูปแรกเป็นรูปหลัก และคลิกเพื่อซูมได้
    if (imagesList.length > 0) {
        mainImg.src = imagesList[0];
        mainImg.style.display = 'block';
        mainImg.style.cursor = 'pointer';
        mainImg.onclick = function () { openImageZoom(imagesList[0]); };
    } else {
        mainImg.style.display = 'none';
    }

    // ถ้ามีหลายรูป ให้แสดงรูปย่อยด้านล่าง (สามารถคลิกเพื่อเปลี่ยนรูปหลักหรือคลิกขยายได้)
    extraBox.innerHTML = '';
    if (imagesList.length > 1) {
        extraBox.style.display = 'block';
        let galleryHTML = '<h4 style="font-size:0.95rem; margin-bottom:8px; color:var(--text-dark);">รูปภาพทั้งหมดในกิจกรรม:</h4><div style="display:flex; gap:8px; flex-wrap:wrap;">';
        imagesList.forEach((imgUrl) => {
            galleryHTML += `<img src="${imgUrl}" style="width:70px; height:70px; object-fit:cover; border-radius:8px; cursor:pointer; border:1px solid var(--border-color);" onclick="document.getElementById('detailMainImg').src='${imgUrl}'; document.getElementById('detailMainImg').onclick = function() { openImageZoom('${imgUrl}'); };" title="คลิกเพื่อดูรูปนี้">`;
        });
        galleryHTML += '</div>';
        extraBox.innerHTML = galleryHTML;
    } else {
        extraBox.style.display = 'none';
    }

    document.getElementById('postDetailModal').style.display = 'flex';
}

// --- LIGHTBOX ZOOM FUNCTIONS ---
function openImageZoom(imgUrl) {
    const modal = document.getElementById('imageZoomModal');
    const zoomedImg = document.getElementById('zoomedImage');
    if (zoomedImg && modal) {
        zoomedImg.src = imgUrl;
        modal.style.display = 'flex';
    }
}

function closeImageZoom() {
    document.getElementById('imageZoomModal').style.display = 'none';
}

function closePostModal() {
    document.getElementById('postDetailModal').style.display = 'none';
}

// --- 4. NAVIGATION & SCROLLSPY ---
function setupNavigation() {
    const navLinks = document.querySelectorAll('#mainNavMenu a.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetAttr = this.getAttribute('href');

            if (targetAttr && targetAttr.startsWith('#')) {
                e.preventDefault();

                const targetSection = document.querySelector(targetAttr);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    const sections = document.querySelectorAll('section[id], div[id*="section"]');

    window.addEventListener('scroll', function () {
        let scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}` || link.getAttribute('href') === `index.html#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// INIT
document.addEventListener('DOMContentLoaded', function () {
    renderAnnouncements();
    renderActivities();
    renderHeads();
    setupNavigation();
});

// --- ADMIN AUTH SYSTEM ---
const ADMIN_PASS = 'Smosci2569';

function openAdminAuthModal() {
    const modal = document.getElementById('adminAuthModal');
    const input = document.getElementById('adminPassInput');
    const errorMsg = document.getElementById('adminAuthError');

    input.value = '';
    errorMsg.innerText = '';
    modal.style.display = 'flex';
    setTimeout(() => input.focus(), 100);
}

function closeAdminAuthModalDirect() {
    document.getElementById('adminAuthModal').style.display = 'none';
}

function closeAdminAuthModal(e) {
    if (e.target.id === 'adminAuthModal') {
        closeAdminAuthModalDirect();
    }
}

function handleAdminPassKey(e) {
    if (e.key === 'Enter') {
        verifyAdminPassword();
    }
}

function verifyAdminPassword() {
    const input = document.getElementById('adminPassInput');
    const errorMsg = document.getElementById('adminAuthError');

    if (input.value === ADMIN_PASS) {
        errorMsg.style.color = '#10b981';
        errorMsg.innerText = 'รหัสผ่านถูกต้อง กำลังเข้าสู่ระบบ...';
        setTimeout(() => {
            window.location.href = 'admin/adminpage.html';
        }, 500);
    } else {
        errorMsg.style.color = '#e11d48';
        errorMsg.innerText = 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
        input.value = '';
        input.focus();
    }
}


//---------------------------------------------

function renderFooterContact() {
    const phoneLink = document.getElementById('footerPhoneLink');
    const phoneText = document.getElementById('footerPhoneText');
    if (!phoneLink || !phoneText) return;

    let foundPhone = '';
    let foundRole = 'นายกสโมสรนักศึกษา';

    // 1. ลองค้นหาจากข้อมูลผังคณะกรรมการสโมสร (smo_chart_members)
    const chartData = JSON.parse(localStorage.getItem('smo_chart_members') || '[]');
    const president = chartData.find(item =>
        item.role && (item.role.includes('นายก') || item.role.includes('ประธาน'))
    );

    if (president && president.phone) {
        foundPhone = president.phone;
        foundRole = president.role;
    } else {
        // 2. ถ้าไม่พบในผัง ลองค้นหาจากข้อมูลส่วนอื่นๆ หรือใช้ค่าเริ่มต้นจากโค้ดเดิมที่คุณกรอกไว้
        foundPhone = '0984212022'; // เบอร์สำรองเผื่อยังไม่ได้ระบุ
    }

    // จัดรูปแบบลิงก์โทรออกและข้อความแสดงผล
    const cleanPhone = foundPhone.replace(/\s+/g, '');
    phoneLink.href = `tel:${cleanPhone}`;
    phoneText.innerText = `${foundPhone} (${foundRole})`;
}

// เพิ่มการเรียกใช้ฟังก์ชันนี้ตอนโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', function () {
    renderAnnouncements();
    renderActivities();
    renderHeads();
    setupNavigation();
    renderFooterContact(); // <--- ดึงเบอร์มาแสดงที่ Footer อัตโนมัติ
});



// --- ระบบแบนเนอร์สไลด์ด้านบนสุด (รองรับการเปลี่ยนภาพทุกๆ 10 วินาที และวนลูป) ---
class AdminBannerSlider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.banners = [];
        this.currentIndex = 0;
        this.timer = null;
        this.init();
    }

    init() {
        if (!this.container) return;

        // ดึงข้อมูลภาพแบนเนอร์ที่แอดมินบันทึกไว้ (ใช้ Key: 'smo_banners')
        const rawBanners = localStorage.getItem('smo_banners');
        this.banners = rawBanners ? JSON.parse(rawBanners) : [];

        // ถ้ายังไม่มีข้อมูลแอดมินเพิ่ม ให้ใส่ภาพตัวอย่างเริ่มต้นไว้ก่อน
        if (this.banners.length === 0) {
            this.banners = [
                { img: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=1600' },
                { img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600' }
            ];
        }

        let html = '';
        this.banners.forEach((item, index) => {
            const activeClass = index === 0 ? 'active' : '';
            html += `
                <div class="banner-slide-item ${activeClass}">
                    <img src="${item.img}" alt="Banner Image">
                </div>`;
        });

        // ปุ่มลูกศรซ้าย-ขวา
        html += `
            <button class="banner-nav-btn banner-btn-prev" onclick="bannerSliderInstance.prev()"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="banner-nav-btn banner-btn-next" onclick="bannerSliderInstance.next()"><i class="fa-solid fa-chevron-right"></i></button>
        `;

        // จุดไข่ปลา (Dots)
        html += `<div class="banner-dots">`;
        this.banners.forEach((_, index) => {
            const activeDot = index === 0 ? 'active' : '';
            html += `<button class="banner-dot ${activeDot}" onclick="bannerSliderInstance.goTo(${index})"></button>`;
        });
        html += `</div>`;

        this.container.innerHTML = html;
        this.startAutoPlay();
    }

    show(index) {
        const slides = this.container.querySelectorAll('.banner-slide-item');
        const dots = this.container.querySelectorAll('.banner-dot');
        if (slides.length === 0) return;

        // ระบบวนลูป (ถ้าถึงรูปสุดท้าย กดถัดไปจะกลับมารูปแรกสุดทันที)
        if (index >= slides.length) {
            this.currentIndex = 0;
        } else if (index < 0) {
            this.currentIndex = slides.length - 1;
        } else {
            this.currentIndex = index;
        }

        slides.forEach((s, i) => s.classList.toggle('active', i === this.currentIndex));
        dots.forEach((d, i) => d.classList.toggle('active', i === this.currentIndex));
    }

    next() {
        this.show(this.currentIndex + 1);
        this.resetAutoPlay();
    }

    prev() {
        this.show(this.currentIndex - 1);
        this.resetAutoPlay();
    }

    goTo(index) {
        this.show(index);
        this.resetAutoPlay();
    }

    startAutoPlay() {
        // ตั้งเวลาเปลี่ยนภาพอัตโนมัติทุกๆ 10 วินาที (10000 มิลลิวินาที) ตามที่คุณต้องการ
        this.timer = setInterval(() => {
            this.show(this.currentIndex + 1);
        }, 10000);
    }

    resetAutoPlay() {
        clearInterval(this.timer);
        this.startAutoPlay();
    }
}

let bannerSliderInstance = null;

// เรียกใช้งานเมื่อโหลดหน้าแรก
document.addEventListener('DOMContentLoaded', function () {
    bannerSliderInstance = new AdminBannerSlider('adminBannerSlider');
});