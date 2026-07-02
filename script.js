// ===== 1. ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК =====
function openTab(tabName) {
    // Скрываем все вкладки
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Убираем активный класс у всех кнопок
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Показываем нужную вкладку
    const targetTab = document.getElementById('tab-' + tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Активируем кнопку
    buttons.forEach(btn => {
        if (btn.textContent.includes('Главная') && tabName === 'home') btn.classList.add('active');
        if (btn.textContent.includes('Заказать') && tabName === 'order') btn.classList.add('active');
        if (btn.textContent.includes('Контакты') && tabName === 'contacts') btn.classList.add('active');
    });

    // При переходе на вкладку заказа обновляем итог
    if (tabName === 'order') {
        updateTotal();
    }
}

// ===== 2. КАЛЬКУЛЯТОР КОМПЛЕКТАЦИИ =====
function updateTotal() {
    const checkboxes = document.querySelectorAll('.option-check');
    let total = 0;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            total += parseInt(checkbox.dataset.price);
        }
    });

    // Форматируем число с пробелами
    const formattedTotal = total.toLocaleString('ru-RU');
    document.getElementById('totalPrice').textContent = formattedTotal + ' ₽';
}

// ===== 3. ОТПРАВКА ЗАЯВКИ =====
function submitOrder() {
    const checkboxes = document.querySelectorAll('.option-check:checked');
    
    if (checkboxes.length === 0) {
        alert('⚠️ Выберите хотя бы одну опцию!');
        return;
    }

    // Собираем список выбранных опций
    let optionsList = [];
    let total = 0;
    checkboxes.forEach(checkbox => {
        const label = checkbox.closest('label');
        const name = label.querySelector('.option-name').textContent;
        const price = checkbox.dataset.price;
        optionsList.push(`${name} (${price}₽)`);
        total += parseInt(price);
    });

    // Формируем сообщение
    const message = `Здравствуйте! Хочу заказать кораблик со следующими опциями:\n\n${optionsList.join('\n')}\n\n💰 Итоговая цена: ${total.toLocaleString('ru-RU')} ₽\n\nМой номер: +7...`;

    alert(`✅ Заявка отправлена!\n\n${message}\n\nСкопируйте это сообщение и отправьте нам в Telegram или WhatsApp.`);
}

// ===== 4. СЧЁТЧИКИ ПОСЕЩЕНИЙ =====
function updateCounters() {
    // Получаем текущие данные из localStorage
    let total = parseInt(localStorage.getItem('siteTotalVisits')) || 0;
    let month = parseInt(localStorage.getItem('siteMonthVisits')) || 0;
    let lastVisitDate = localStorage.getItem('siteLastVisitDate');

    // Текущая дата
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const today = `${currentYear}-${currentMonth}-${now.getDate()}`;

    // Проверяем, был ли визит сегодня
    if (lastVisitDate !== today) {
        // Новый визит
        total += 1;
        month += 1;

        // Обновляем данные
        localStorage.setItem('siteTotalVisits', total.toString());
        localStorage.setItem('siteMonthVisits', month.toString());
        localStorage.setItem('siteLastVisitDate', today);

        // Сброс месячного счётчика, если месяц изменился
        const lastMonth = localStorage.getItem('siteLastMonth');
        if (lastMonth !== currentMonth.toString()) {
            localStorage.setItem('siteMonthVisits', '0');
            localStorage.setItem('siteLastMonth', currentMonth.toString());
        }
    }

    // Отображаем счётчики на странице
    const totalEl = document.getElementById('totalVisits');
    const monthEl = document.getElementById('monthVisits');
    const onlineEl = document.getElementById('onlineNow');

    if (totalEl) totalEl.textContent = total.toLocaleString('ru-RU');
    if (monthEl) monthEl.textContent = month.toLocaleString('ru-RU');

    // Счётчик онлайн (случайное число для демонстрации)
    if (onlineEl) {
        const online = Math.floor(Math.random() * 8) + 1;
        onlineEl.textContent = online;
    }
}

// ===== 5. МОДАЛЬНОЕ ОКНО ДЛЯ СЕРТИФИКАТОВ =====
function openCertModal(element) {
    const img = element.querySelector('img');
    const modal = document.getElementById('certModal');
    const modalImg = document.getElementById('certModalImg');

    if (modal && modalImg && img) {
        modalImg.src = img.src;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
}

// Закрытие модального окна по клику вне картинки
document.addEventListener('click', function(e) {
    const modal = document.getElementById('certModal');
    if (modal && modal.classList.contains('open')) {
        if (e.target === modal) {
            closeCertModal();
        }
    }
});

// Закрытие по клавише ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCertModal();
    }
});

// ===== 6. СКРЫТИЕ СЛАЙДЕРА ПРИ ПРОКРУТКЕ (ПЛАВНОЕ) =====
(function() {
    const slider = document.querySelector('.photo-slider');
    if (!slider) return;

    function handleScroll() {
        const scrollY = window.scrollY;
        
        // Прозрачность от 1 до 0 при прокрутке от 0 до 150px
        const opacity = Math.max(0, 1 - (scrollY / 150));
        
        // Применяем прозрачность
        slider.style.opacity = opacity;
        
        // Скрываем полностью, когда прозрачность стала 0
        if (opacity <= 0) {
            slider.style.pointerEvents = 'none';
        } else {
            slider.style.pointerEvents = 'auto';
        }
    }

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    handleScroll();
})();

// ===== 7. ОБНОВЛЕНИЕ СЧЁТЧИКА ОНЛАЙН (каждые 30 секунд) =====
setInterval(function() {
    const onlineEl = document.getElementById('onlineNow');
    if (onlineEl) {
        const online = Math.floor(Math.random() * 8) + 1;
        onlineEl.textContent = online;
    }
}, 30000);

// ===== 8. ЗАПУСК ПРИ ЗАГРУЗКЕ =====
document.addEventListener('DOMContentLoaded', function() {
    updateCounters();
    console.log('🚤 КорабликPRO загружен!');
});