// Ждем, пока загрузится весь HTML-код страницы
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ЛОГИКА РАБОТЫ МОДАЛЬНОГО ОКНА (ФОРМЫ ЗАПИСИ)
    // ==========================================
    const modal = document.getElementById('modal'); // Находим само окно
    const openBtns = document.querySelectorAll('.open-modal'); // Находим все кнопки "Записаться"
    const closeBtn = document.getElementById('closeModal'); // Находим крестик закрытия

    // Открываем окно при клике на любую кнопку "Записаться"
    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    });

    // Закрываем окно при клике на крестик
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Закрываем окно, если кликнуть мимо самого окна (на темный фон)
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // ==========================================
    // 2. ОБРАБОТКА ОТПРАВКИ ФОРМЫ
    // ==========================================
    const form = document.getElementById('appointmentForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Запрещаем странице перезагружаться при отправке
        
        // В реальном проекте здесь был бы код отправки данных на сервер (AJAX)
        // А пока просто показываем сообщение об успехе
        alert('Спасибо! Ваша заявка отправлена. Администратор перезвонит вам в течение 15 минут.');
        
        form.reset(); // Очищаем поля формы
        modal.classList.remove('active'); // Закрываем окно
    });

    // ==========================================
    // 3. ЛОГИКА МОБИЛЬНОГО МЕНЮ (БУРГЕР)
    // ==========================================
    const burger = document.getElementById('burger');
    const navMenu = document.getElementById('navMenu');

    // Открываем/закрываем меню при клике на бургер
    burger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Закрываем меню, если пользователь кликнул на какую-то ссылку в нем
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
});