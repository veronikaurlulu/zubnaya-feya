document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. МОДАЛЬНОЕ ОКНО ---
    const modal = document.getElementById('modal');
    const openBtns = document.querySelectorAll('.open-modal');
    const closeBtn = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');

    // Открытие через шапку/баннер
    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modalTitle.innerText = 'Запись на прием';
            modal.classList.add('active');
            generateTimeSlots(); // Генерируем время
        });
    });

    // Открытие через карточку врача
    const bookDoctorBtns = document.querySelectorAll('.btn-book');
    bookDoctorBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const doctorName = btn.getAttribute('data-doctor');
            modalTitle.innerText = `Запись к ${doctorName}`;
            modal.classList.add('active');
            generateTimeSlots();
        });
    });

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    // --- 2. ГЕНЕРАЦИЯ ВРЕМЕНИ ---
    const timeSlotsContainer = document.getElementById('timeSlots');
    const selectedTimeInput = document.getElementById('selectedTime');
    const bookingDateInput = document.getElementById('bookingDate');

    // Устанавливаем минимальную дату - сегодня
    const today = new Date().toISOString().split('T')[0];
    if (bookingDateInput) bookingDateInput.setAttribute('min', today);

        function generateTimeSlots() {
        if(!timeSlotsContainer) return;
        timeSlotsContainer.innerHTML = '';
        selectedTimeInput.value = '';
        
        // Генерируем время с 9:00 до 20:00 с шагом 30 минут
        let hour = 9;
        let minute = 0;

        while (hour < 20) {
            const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            
            const btn = document.createElement('button');
            btn.type = 'button'; // ВАЖНО: чтобы кнопка не отправляла форму
            btn.className = 'time-slot-btn';
            btn.innerText = timeString;
            
            btn.addEventListener('click', () => {
                // Убираем класс 'selected' у всех кнопок
                const allBtns = document.querySelectorAll('.time-slot-btn');
                allBtns.forEach(b => b.classList.remove('selected'));
                
                // Добавляем класс 'selected' текущей кнопке
                btn.classList.add('selected');
                
                // Записываем время в скрытое поле
                selectedTimeInput.value = timeString;
            });
            
            timeSlotsContainer.appendChild(btn);
            
            minute += 30;
            if (minute === 60) { hour++; minute = 0; }
        }
    }

    // --- 3. ОТПРАВКА ФОРМЫ ---
    const form = document.getElementById('appointmentForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!selectedTimeInput.value) {
            alert('Пожалуйста, выберите время приема.');
            return;
        }

        const date = bookingDateInput.value;
        const time = selectedTimeInput.value;
        const doctor = modalTitle.innerText;

        alert(`Спасибо! Вы записаны: ${doctor}.\nДата: ${date}\nВремя: ${time}.\nАдминистратор перезвонит для подтверждения.`);
        
        form.reset();
        document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
        modal.classList.remove('active');
    });

    // --- 4. МОБИЛЬНОЕ МЕНЮ ---
    const burger = document.getElementById('burger');
    const navMenu = document.getElementById('navMenu');
    if(burger) {
        burger.addEventListener('click', () => navMenu.classList.toggle('active'));
    }
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('active'));
    });
});
// === НАСТРОЙКА ЦЕЛЕЙ ЯНДЕКС.МЕТРИКИ ===

// 1. Отслеживание кликов по номеру телефона
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        if (typeof ym !== 'undefined') {
            ym(113852204, 'reachGoal', 'phone_click');
        }
    });
});

// 2. Отслеживание отправки формы записи
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', () => {
        if (typeof ym !== 'undefined') {
            ym(113852204, 'reachGoal', 'form_submit');
        }
    });
}
