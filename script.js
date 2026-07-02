// ===== 1. ОБРАБОТКА ФОРМЫ =====
function submitForm() {
    alert('✅ Спасибо! Мы свяжемся с вами в ближайшее время для подбора кораблика.');
}

// ===== 2. ПЛАВНАЯ ПРОКРУТКА К ФОРМЕ =====
document.addEventListener('DOMContentLoaded', function() {
    // Все ссылки, ведущие на #form, прокручивают плавно
    const links = document.querySelectorAll('a[href="#form"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const form = document.getElementById('form');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
});

// ===== 3. СЧЁТЧИК ПОСЕЩЕНИЙ (как на старом сайте) =====
function updateCounters() {
    let total = parseInt(localStorage.getItem('bekasTotalVisits')) || 0;
    let month = parseInt(localStorage.getItem('bekasMonthVisits')) || 0;
    let lastVisitDate = localStorage.getItem('bekasLastVisitDate');

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const today = `${currentYear}-${currentMonth}-${now.getDate()}`;

    if (lastVisitDate !== today) {
        total += 1;
        month += 1;
        localStorage.setItem('bekasTotalVisits', total.toString());
        localStorage.setItem('bekasMonthVisits', month.toString());
        localStorage.setItem('bekasLastVisitDate', today);

        const lastMonth = localStorage.getItem('bekasLastMonth');
        if (lastMonth !== currentMonth.toString()) {
            localStorage.setItem('bekasMonthVisits', '0');
            localStorage.setItem('bekasLastMonth', currentMonth.toString());
        }
    }

    // Если есть элементы для счётчиков — обновляем (можно добавить в подвал)
    const totalEl = document.getElementById('totalVisits');
    const monthEl = document.getElementById('monthVisits');
    if (totalEl) totalEl.textContent = total.toLocaleString('ru-RU');
    if (monthEl) monthEl.textContent = month.toLocaleString('ru-RU');
}

// Запускаем счётчики при загрузке
document.addEventListener('DOMContentLoaded', updateCounters);

// ===== 4. КОНСОЛЬНОЕ ПРИВЕТСТВИЕ =====
console.log('🚤 Бекас — прикормочные кораблики. Сайт загружен!');
console.log('📞 Контакты: +7 (915) 870-69-79');