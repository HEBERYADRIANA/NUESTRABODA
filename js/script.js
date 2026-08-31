document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTOS
    ========================================= */

    const music = document.getElementById("backgroundMusic");
    const musicButton = document.getElementById("musicButton");

    const envelopeScreen =
        document.getElementById("envelopeScreen");


    /* =========================================
       MÚSICA
    ========================================= */

    if (musicButton && music) {

        musicButton.addEventListener("click", async () => {

            if (music.paused) {

                try {

                    await music.play();

                    musicButton.textContent = "♫";

                    musicButton.setAttribute(
                        "aria-label",
                        "Pausar música"
                    );

                } catch (error) {

                    console.log(
                        "No se pudo reproducir el audio:",
                        error
                    );

                }

            } else {

                music.pause();

                musicButton.textContent = "🔇";

                musicButton.setAttribute(
                    "aria-label",
                    "Activar música"
                );

            }

        });

    }


    /* =========================================
       CUENTA REGRESIVA
       
       14 DE NOVIEMBRE DE 2026
       16:30 HORAS
    ========================================= */

    const eventDate =
        new Date(2026, 10, 14, 16, 30, 0);

    const days =
        document.getElementById("days");

    const hours =
        document.getElementById("hours");

    const minutes =
        document.getElementById("minutes");

    const seconds =
        document.getElementById("seconds");


    function pad(value) {

        return String(value).padStart(2, "0");

    }


    function updateCountdown() {

        if (
            !days ||
            !hours ||
            !minutes ||
            !seconds
        ) {
            return;
        }


        const now = new Date();

        const difference =
            eventDate - now;


        if (difference <= 0) {

            days.textContent = "00";
            hours.textContent = "00";
            minutes.textContent = "00";
            seconds.textContent = "00";

            return;

        }


        const totalSeconds =
            Math.floor(difference / 1000);


        const d =
            Math.floor(
                totalSeconds / 86400
            );


        const h =
            Math.floor(
                (totalSeconds % 86400) / 3600
            );


        const m =
            Math.floor(
                (totalSeconds % 3600) / 60
            );


        const s =
            totalSeconds % 60;


        days.textContent = pad(d);

        hours.textContent = pad(h);

        minutes.textContent = pad(m);

        seconds.textContent = pad(s);

    }


    updateCountdown();

    setInterval(
        updateCountdown,
        1000
    );


    /* =========================================
       GALERÍA
    ========================================= */

    const slides =
        document.querySelectorAll(
            ".gallery-slide"
        );

    const dots =
        document.querySelectorAll(".dot");

    const slider =
        document.querySelector(
            ".gallery-slider"
        );


    let currentSlide = 0;

    let startX = 0;

    let currentX = 0;

    let isDragging = false;


    function showSlide(index) {

        if (!slides.length) return;


        slides.forEach(
            (slide, i) => {

                slide.classList.remove(
                    "active",
                    "next-card",
                    "previous-card"
                );


                if (i === index) {

                    slide.classList.add(
                        "active"
                    );

                }


                if (
                    i ===
                    (index + 1) %
                    slides.length
                ) {

                    slide.classList.add(
                        "next-card"
                    );

                }


                if (
                    i ===
                    (index - 1 +
                        slides.length) %
                        slides.length
                ) {

                    slide.classList.add(
                        "previous-card"
                    );

                }

            }
        );


        dots.forEach(
            (dot, i) => {

                dot.classList.toggle(
                    "active",
                    i === index
                );

            }
        );

    }


    function nextSlide() {

        if (!slides.length) return;


        currentSlide++;


        if (
            currentSlide >=
            slides.length
        ) {

            currentSlide = 0;

        }


        showSlide(currentSlide);

    }


    function previousSlide() {

        if (!slides.length) return;


        currentSlide--;


        if (currentSlide < 0) {

            currentSlide =
                slides.length - 1;

        }


        showSlide(currentSlide);

    }


    /* =========================================
       GALERÍA - CELULAR
    ========================================= */

    if (slider) {

        slider.addEventListener(
            "touchstart",
            (e) => {

                startX =
                    e.touches[0].clientX;

                isDragging = true;

            }
        );


        slider.addEventListener(
            "touchmove",
            (e) => {

                if (!isDragging) return;

                currentX =
                    e.touches[0].clientX;

            }
        );


        slider.addEventListener(
            "touchend",
            () => {

                if (!isDragging) return;


                const difference =
                    startX - currentX;


                isDragging = false;


                if (
                    Math.abs(difference) > 50
                ) {

                    if (difference > 0) {

                        nextSlide();

                    } else {

                        previousSlide();

                    }

                }

            }
        );

    }


    /* =========================================
       GALERÍA - INDICADORES
    ========================================= */

    dots.forEach(
        (dot, index) => {

            dot.addEventListener(
                "click",
                () => {

                    currentSlide =
                        index;

                    showSlide(
                        currentSlide
                    );

                }
            );

        }
    );


    showSlide(currentSlide);


    /* =========================================
       SOBRE
    ========================================= */

    if (!envelopeScreen) {

        console.log(
            "No se encontró #envelopeScreen"
        );

        return;

    }


    let envelopeOpened = false;

    let startY = 0;


    /* =========================================
       CELULAR - DESLIZAR
    ========================================= */

    envelopeScreen.addEventListener(
        "touchstart",
        (e) => {

            startY =
                e.touches[0].clientY;

        }
    );


    envelopeScreen.addEventListener(
        "touchend",
        (e) => {

            const endY =
                e.changedTouches[0].clientY;


            const difference =
                startY - endY;


            /*
             * Deslizar hacia arriba
             * abre el sobre.
             */

            if (difference > 60) {

                openEnvelope();

            }

        }
    );


    /* =========================================
       COMPUTADORA - RUEDA DEL MOUSE
    ========================================= */

    envelopeScreen.addEventListener(
        "wheel",
        (e) => {

            if (e.deltaY > 0) {

                openEnvelope();

            }

        }
    );


    /* =========================================
       ABRIR SOBRE
    ========================================= */

    function openEnvelope() {

        if (envelopeOpened) return;


        envelopeOpened = true;


        envelopeScreen.classList.add(
            "opening"
        );


        /*
         * Reproducir música después
         * de la interacción del usuario.
         */

        if (music) {

            music.play()
                .then(() => {

                    if (musicButton) {

                        musicButton.textContent =
                            "♫";

                    }

                })
                .catch(() => {

                    console.log(
                        "El navegador bloqueó el audio."
                    );

                });

        }


        /*
         * Después de abrir el sobre,
         * desaparece de la pantalla.
         */

        setTimeout(
            () => {

                envelopeScreen.classList.add(
                    "hide"
                );


                document.body.style.overflow =
                    "auto";

            },
            1300
        );

    }

});