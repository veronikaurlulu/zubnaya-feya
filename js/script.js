document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. МОДАЛЬНОЕ ОКНО ---
    const modal = document.getElementById('modal');
    const openBtns = document.querySelectorAll('.open-modal');
    const closeBtn = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('appointmentForm');

    // Функция открытия модалки
    const openModal = (title) => {
        modalTitle.innerText = title;
        modal.classList.add('active');
        generateTimeSlots();
    };

    // Открытие через шапку/баннер
    openBtns.forEach(btn => {
        btn.addEventListener('click', () => openModal('Запись на прием'));
    });

    // Открытие через карточку врача
    const bookDoctorBtns = document.querySelectorAll('.btn-book');
    bookDoctorBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const doctorName = btn.getAttribute('data-doctor');
            openModal(`Запись к ${doctorName}`);
        });
    });

    // Закрытие модалки
    const closeModal = () => {
        modal.classList.remove('active');
    };

    closeBtn.addEventListener('click', closeModal);
    
    // Закрытие по клику вне окна
    window.addEventListener('click', (e) => { 
        if (e.target === modal) closeModal(); 
    });

    // ДОСТУПНОСТЬ: Закрытие по нажатию клавиши Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });


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
        
        let hour = 9;
        let minute = 0;

        while (hour < 20) {
            const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            
            const btn = document.createElement('button');
            btn.type = 'button'; // Чтобы кнопка не отправляла форму
            btn.className = 'time-slot-btn';
            btn.innerText = timeString;
            // ДОСТУПНОСТЬ: Добавляем подпись для скринридеров
            btn.setAttribute('aria-label', `Выбрать время ${timeString}`);
            
            btn.addEventListener('click', () => {
                const allBtns = document.querySelectorAll('.time-slot-btn');
                allBtns.forEach(b => {
                    b.classList.remove('selected');
                    b.setAttribute('aria-pressed', 'false');
                });
                
                btn.classList.add('selected');
                btn.setAttribute('aria-pressed', 'true'); // ДОСТУПНОСТЬ
                selectedTimeInput.value = timeString;
            });
            
            timeSlotsContainer.appendChild(btn);
            
            minute += 30;
            if (minute === 60) { hour++; minute = 0; }
        }
    }

    // --- 3. ОТПРАВКА ФОРМЫ И ЦЕЛИ МЕТРИКИ ---
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!selectedTimeInput.value) {
                alert('Пожалуйста, выберите время приема.');
                return;
            }

            const date = bookingDateInput.value;
            const time = selectedTimeInput.value;
            const doctor = modalTitle.innerText;

            // Цель Яндекс.Метрики на отправку формы
            if (typeof ym !== 'undefined') {
                ym(113852204, 'reachGoal', 'form_submit');
            }

            alert(`Спасибо! Вы записаны: ${doctor}.\nДата: ${date}\nВремя: ${time}.\nАдминистратор перезвонит для подтверждения.`);
            
            // Очищаем форму и скрытое поле
            form.reset();
            selectedTimeInput.value = ''; 
            document.querySelectorAll('.time-slot-btn').forEach(b => {
                b.classList.remove('selected');
                b.setAttribute('aria-pressed', 'false');
            });
            
            closeModal();
        });
    }

    // --- 4. МОБИЛЬНОЕ МЕНЮ ---
    const burger = document.getElementById('burger');
    const navMenu = document.getElementById('navMenu');
    
    if(burger && navMenu) {
        burger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // ДОСТУПНОСТЬ: Переключаем состояние меню (открыто/закрыто)
            const isExpanded = navMenu.classList.contains('active');
            burger.setAttribute('aria-expanded', isExpanded);
        });
    }

    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if(burger) burger.setAttribute('aria-expanded', 'false');
        });
    });

    // --- 5. ОТСЛЕЖИВАНИЕ КЛИКОВ ПО ТЕЛЕФОНУ ---
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            if (typeof ym !== 'undefined') {
                ym(113852204, 'reachGoal', 'phone_click');
            }
        });
    });
});
