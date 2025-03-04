document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menu-btn"); // Изменено на твой класс
    const closeMenuButton = document.getElementById("close-menu");
    const overlay = document.getElementById("overlay");
    const mobileMenu = document.getElementById("mobile-menu");

    // Проверяем, существуют ли элементы перед добавлением событий
    if (menuButton && closeMenuButton && overlay && mobileMenu) {
        // Функция открытия меню
        function openMenu() {
            mobileMenu.classList.add("active");
            overlay.classList.add("active");
        }

        // Функция закрытия меню
        function closeMenu() {
            mobileMenu.classList.remove("active");
            overlay.classList.remove("active");
        }

        // Назначаем события
        menuButton.addEventListener("click", openMenu); // Теперь работает по .menu-btn
        closeMenuButton.addEventListener("click", closeMenu);
        overlay.addEventListener("click", closeMenu);
    } else {
        console.error("❌ Ошибка: Один или несколько элементов меню не найдены в DOM.");
    }
});

// document.addEventListener("DOMContentLoaded", function () {
//     const rentButtons = document.querySelectorAll(".btn-rent");

//     rentButtons.forEach(button => {
//         button.addEventListener("click", function (event) {
//             event.preventDefault();
//             alert("Функция аренды пока недоступна. Свяжитесь с менеджером!");
//         });
//     });
// });

document.addEventListener("DOMContentLoaded", function () {
    const rentButtons = document.querySelectorAll(".btn-rent");
    const modal = document.getElementById("booking-popup");
    const overlay = document.getElementById("popup-overlay");
    const closeModal = document.getElementById("booking-close");
    const submitBtn = document.getElementById("submit-btn");
    const policyCheckbox = document.getElementById("policy");
    const bookingForm = document.getElementById("booking-form");
    const boatImage = document.getElementById("booking-boat-img");
    const boatName = document.getElementById("booking-boat-name");

    // ДАННЫЕ ТЕЛЕГРАМ-БОТА
    const TELEGRAM_BOT_TOKEN = "7873850845:AAHqXxX-jyozeUKTxSaGPqMmo9uIetwTyss";  // Вставь сюда токен бота
    const TELEGRAM_CHAT_ID = "301593280"; // Вставь сюда ID канала (с -100 в начале, если приватный)

    // Открытие модального окна
    rentButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const boatCard = this.closest(".catalog-item");
            const boatImgSrc = boatCard.querySelector(".catalog-image img").src;
            const boatTitle = boatCard.querySelector("h3").textContent;

            boatImage.src = boatImgSrc;
            boatName.textContent = boatTitle;

            modal.classList.add("active");
            overlay.classList.add("active");
        });
    });

    // Закрытие окна
    closeModal.addEventListener("click", closeBooking);
    overlay.addEventListener("click", closeBooking);

    function closeBooking() {
        modal.classList.remove("active");
        overlay.classList.remove("active");
        submitBtn.textContent = "Отправить заявку"; // Сбрасываем кнопку
        submitBtn.classList.remove("loading"); // Убираем состояние загрузки
        submitBtn.removeAttribute("disabled"); // Включаем кнопку
    }

    // Активация кнопки "Отправить заявку" только при согласии с политикой
    policyCheckbox.addEventListener("change", function () {
        if (this.checked) {
            submitBtn.classList.add("active");
            submitBtn.removeAttribute("disabled");
        } else {
            submitBtn.classList.remove("active");
            submitBtn.setAttribute("disabled", "true");
        }
    });

    // Отправка заявки в Telegram
    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (submitBtn.disabled) return; // Если кнопка уже нажата – выходим

        const userName = document.getElementById("name").value.trim();
        const userPhone = document.getElementById("phone").value.trim();
        const userComment = document.getElementById("comment").value.trim();
        const boatTitle = boatName.textContent;

        if (!userName || !userPhone) {
            alert("Заполните имя и телефон!");
            return;
        }

        // Блокируем кнопку во время отправки
        submitBtn.textContent = "Отправка...";
        submitBtn.classList.add("loading");
        submitBtn.setAttribute("disabled", "true");

        // Формируем текст сообщения
        const message = `
🚤 *Новая заявка на аренду!*
🛥️ Яхта: *${boatTitle}*
👤 Имя: *${userName}*
📞 Телефон: *${userPhone}*
📝 Комментарий: ${userComment || "Не указан"}
        `;

        // Отправляем данные в Telegram через API
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown"
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert("✅ Заявка успешно отправлена!");
                bookingForm.reset();
                closeBooking();
            } else {
                alert("❌ Ошибка при отправке. Попробуйте снова.");
                submitBtn.textContent = "Отправить заявку";
                submitBtn.classList.remove("loading");
                submitBtn.removeAttribute("disabled");
            }
        })
        .catch(error => {
            console.error("Ошибка:", error);
            alert("❌ Ошибка при отправке. Попробуйте позже.");
            submitBtn.textContent = "Отправить заявку";
            submitBtn.classList.remove("loading");
            submitBtn.removeAttribute("disabled");
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const reviewContainer = document.querySelector(".reviews-container");
    
    let isDown = false;
    let startX;
    let scrollLeft;

    // Начало перетаскивания
    reviewContainer.addEventListener("mousedown", (e) => {
        isDown = true;
        reviewContainer.classList.add("active");
        startX = e.pageX - reviewContainer.offsetLeft;
        scrollLeft = reviewContainer.scrollLeft;
    });

    // Конец перетаскивания
    reviewContainer.addEventListener("mouseleave", () => {
        isDown = false;
        reviewContainer.classList.remove("active");
    });

    reviewContainer.addEventListener("mouseup", () => {
        isDown = false;
        reviewContainer.classList.remove("active");
        snapToNearest();
    });

    // Движение по оси X
    reviewContainer.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - reviewContainer.offsetLeft;
        const walk = (x - startX) * 2; // Скорость прокрутки
        reviewContainer.scrollLeft = scrollLeft - walk;
    });

    // Функция фиксации отзыва
    function snapToNearest() {
        const reviewWidth = 340; // Фиксированная ширина карточки + отступы
        const scrollPosition = reviewContainer.scrollLeft;
        const nearestReview = Math.round(scrollPosition / reviewWidth) * reviewWidth;
        
        reviewContainer.scrollTo({
            left: nearestReview,
            behavior: "smooth"
        });
    }
});

const images = ["yacht1.jpg", "yacht2.jpg", "yacht3.jpg"];
let currentIndex = 0;

function changeImage(img) {
    document.getElementById("main-yacht-img").src = img.src;
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    document.getElementById("main-yacht-img").src = images[currentIndex];
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    document.getElementById("main-yacht-img").src = images[currentIndex];
}


document.addEventListener("DOMContentLoaded", function () {
    const mainImage = document.getElementById("mainImage");
    const thumbnails = document.querySelectorAll(".thumbnails img");
    const backArrow = document.getElementById("backArrow");

    // Запоминаем исходное изображение
    const defaultImageSrc = mainImage.src;

    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener("click", function () {
            mainImage.src = this.src;

            // Показываем стрелку
            backArrow.classList.add("show");

            // Обновляем active у миниатюр
            thumbnails.forEach((thumb) => thumb.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Клик по стрелке — вернуть первую картинку
    backArrow.addEventListener("click", function () {
        mainImage.src = defaultImageSrc;

        // Возвращаем активную миниатюру
        thumbnails.forEach((thumb) => thumb.classList.remove("active"));
        thumbnails[0].classList.add("active");

        // Прячем стрелку
        backArrow.classList.remove("show");
    });
});


document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".catalog-item").forEach((item) => {
        try {
            const images = item.querySelectorAll(".catalog-photo");
            let currentIndex = 0;

            if (!images.length) {
                console.warn("❌ Ошибка: нет изображений в карточке:", item);
                return;
            }

            function updateImage(index) {
                images.forEach((img, i) => {
                    img.classList.toggle("active", i === index);
                });
            }

            item.querySelector(".prev-btn").addEventListener("click", (event) => {
                event.stopPropagation();
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateImage(currentIndex);
            });

            item.querySelector(".next-btn").addEventListener("click", (event) => {
                event.stopPropagation();
                currentIndex = (currentIndex + 1) % images.length;
                updateImage(currentIndex);
            });

            updateImage(currentIndex);
        } catch (error) {
            console.error("Ошибка при перелистывании изображений:", error);
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".catalog-item").forEach((item) => {
        const mainImage = item.querySelector(".catalog-photo");
        const prevBtn = item.querySelector(".prev-btn");
        const nextBtn = item.querySelector(".next-btn");
        const detailsBtn = item.querySelector(".btn-details");
        const rentBtn = item.querySelector(".btn-rent");

        // Определяем страницу описания по названию яхты
        const yachtPages = {
            "HERMES": "HERMES.html",
            "ECLIPSE": "ECLIPSE.html",
            "Катер Velvette": "Velvette.html"
        };

        let yachtName = item.querySelector("h3").innerText.trim();
        let currentIndex = 0;

        const images = {
            "HERMES": ["yacht-hecmes.png", "yacht-hecmes1.png", "yacht-hecmes2.png", "yacht-hecmes3.png", "yacht-hecmes4.png", "yacht-hecmes5.png", "yacht-hecmes6.png", "yacht-hecmes7.png", "yacht-hecmes8.png", "yacht-hecmes9.png"],
            "ECLIPSE": ["ECLIPSE.png", "ECLIPSE1.png", "ECLIPSE3.png", "ECLIPSE4.png", "ECLIPSE5.png", "ECLIPSE6.png", "ECLIPSE7.png", "ECLIPSE8.png", "ECLIPSE9.png", "ECLIPSE10.png"],
            "Катер Velvette": ["VELVETTE1.png","VELVETTE2.png", "VELVETTE3.png", "VELVETTE4.png", "VELVETTE5.png", "VELVETTE6.png", "VELVETTE7.png"]
        };

        if (!images[yachtName] || images[yachtName].length === 0) return;

        function updateImage(index) {
            mainImage.src = images[yachtName][index];
        }

        prevBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            currentIndex = (currentIndex - 1 + images[yachtName].length) % images[yachtName].length;
            updateImage(currentIndex);
        });

        nextBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            currentIndex = (currentIndex + 1) % images[yachtName].length;
            updateImage(currentIndex);
        });

        // Добавляем обработчик клика на всю карточку, но исключаем кнопки
        item.addEventListener("click", (event) => {
            if (!event.target.closest(".btn-details") && !event.target.closest(".btn-rent") && !event.target.closest(".prev-btn") && !event.target.closest(".next-btn")) {
                window.location.href = yachtPages[yachtName] || "#"; // Открываем страницу яхты
            }
        });

        updateImage(currentIndex);
    });

});



document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".catalog-item").forEach((item) => {
        const images = item.querySelectorAll(".catalog-photo");
        const prevBtn = item.querySelector(".prev-btn");
        const nextBtn = item.querySelector(".next-btn");

        let currentIndex = 0;

        function updateImage(index) {
            images.forEach((img, i) => {
                img.classList.toggle("active", i === index);
            });
        }

        prevBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage(currentIndex);
        });

        nextBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            updateImage(currentIndex);
        });

        updateImage(currentIndex);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".catalog-item").forEach((item) => {
        const images = item.querySelectorAll(".catalog-photo");
        const prevBtn = item.querySelector(".prev-btn");
        const nextBtn = item.querySelector(".next-btn");
        const detailsBtn = item.querySelector(".btn-details");
        const rentBtn = item.querySelector(".btn-rent");

        let currentIndex = 0;

        function updateImage(index) {
            images.forEach((img, i) => img.classList.toggle("active", i === index));
        }

        prevBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage(currentIndex);
        });

        nextBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            updateImage(currentIndex);
        });

        // Клик по карточке (переброс на страницу)
        item.addEventListener("click", (event) => {
            // Проверяем, был ли клик по кнопке (чтобы не мешать работе кнопок)
            if (!event.target.closest(".prev-btn") && 
                !event.target.closest(".next-btn") && 
                !event.target.closest(".btn-details") && 
                !event.target.closest(".btn-rent")) {
                    
                // Получаем название яхты из data-yacht атрибута или заголовка
                let yachtPage = detailsBtn?.getAttribute("href") || "#";
                window.location.href = yachtPage;
            }
        });

        updateImage(currentIndex);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll(".lazyload");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove("lazyload");
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => observer.observe(img));
});