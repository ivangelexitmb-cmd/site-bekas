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

    // Отправляем через Telegram (если настроен бот) или просто показываем
    alert(`✅ Заявка отправлена!\n\n${message}\n\nСкопируйте это сообщение и отправьте нам в Telegram или WhatsApp.`);

    // Альтернатива: открыть WhatsApp с готовым сообщением
    // const phone = '79158706979';
    // const encodedMessage = encodeURIComponent(message);
    // window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
}

// ===== 4. ПРИВЕТСТВИЕ ПРИ ЗАГРУЗКЕ =====
window.onload = function() {
    console.log('🚤 КорабликPRO загружен!');
    
    // Если на странице есть видео — автозапуск не делаем, ждём клика пользователя
    // (браузеры блокируют автовоспроизведение)
};

// ===== 5. ДОПОЛНИТЕЛЬНО: ПАУЗА ДЛЯ СЛАЙДЕРА ПРИ НАВЕДЕНИИ =====
// Позволяет остановить слайдер при наведении мыши
const sliderTrack = document.getElementById('sliderTrack');
if (sliderTrack) {
    sliderTrack.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    sliderTrack.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
}
// ===== 6. СЧЁТЧИКИ ПОСЕЩЕНИЙ =====
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

// Запускаем счётчики при загрузке
document.addEventListener('DOMContentLoaded', updateCounters);

// ===== 7. МОДАЛЬНОЕ ОКНО ДЛЯ СЕРТИФИКАТОВ =====
function openCertModal(element) {
    const img = element.querySelector('img');
    const modal = document.getElementById('certModal');
    const modalImg = document.getElementById('certModalImg');

    if (modal && modalImg && img) {
        modalImg.src = img.src;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // блокируем скролл страницы
    }
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto'; // восстанавливаем скролл
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

// ===== 8. ОБНОВЛЕНИЕ СЧЁТЧИКА ОНЛАЙН (каждые 30 секунд) =====
setInterval(function() {
    const onlineEl = document.getElementById('onlineNow');
    if (onlineEl) {
        const online = Math.floor(Math.random() * 8) + 1;
        onlineEl.textContent = online;
    }
}, 30000); // обновляем раз в 30 секунд

// ===== 9. СКРЫТИЕ СЛАЙДЕРА ПРИ ПРОКРУТКЕ =====
window.addEventListener('scroll', function() {
    const slider = document.querySelector('.photo-slider');
    if (!slider) return;
    
    if (window.scrollY > 100) {
        slider.classList.add('hidden');
    } else {
        slider.classList.remove('hidden');
    }
});

    // Используем requestAnimationFrame для плавности (оптимизация)
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

    // Запускаем проверку при загрузке (на случай, если страница уже прокручена)
    setTimeout(handleScroll, 100);
})();