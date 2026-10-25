// --- ฟังก์ชันเปิด-ปิดเมนู Dropdown บนมือถือ ---
function toggleMobileDropdown(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('mobileDropdownMenu');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// กดพื้นที่ว่างที่อื่นเพื่อให้กล่อง Dropdown ปิดลง
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('mobileDropdownMenu');
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    if (dropdown && dropdown.classList.contains('active')) {
        if (!dropdown.contains(e.target) && !toggleBtn.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    }
});