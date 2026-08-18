document.addEventListener("DOMContentLoaded", function () {

    const menuButton = document.getElementById("menuButton");
    const navigation = document.getElementById("navigation");

    const loginForm = document.getElementById("screeningLoginForm");
    const loginMessage = document.getElementById("loginMessage");

    /*
    ==========================================
    MOBILE MENU
    ==========================================
    */

    if (menuButton && navigation) {

        menuButton.addEventListener("click", function () {

            navigation.classList.toggle("show");

        });

    }


    /*
    ==========================================
    NAVIGATION
    ==========================================
    */

    const navLinks = document.querySelectorAll(
        '.nav-link[href^="#"], .primary-button[href^="#"]'
    );

    navLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                if (navigation) {
                    navigation.classList.remove("show");
                }

            }

        });

    });


    /*
    ==========================================
    LOGIN FORM
    ==========================================
    */

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const jambNumber =
                document.getElementById("jambNumber").value.trim();

            const state =
                document.getElementById("state").value;

            const gender =
                document.getElementById("gender").value;


            /*
            BASIC VALIDATION
            */

            if (jambNumber === "") {

                showMessage(
                    "Please enter your JAMB Number."
                );

                return;
            }


            if (state === "") {

                showMessage(
                    "Please select your State."
                );

                return;
            }


            if (gender === "") {

                showMessage(
                    "Please select your Gender."
                );

                return;
            }


            /*
            JAMB NUMBER FORMAT
            */

            const jambPattern = /^[A-Za-z0-9]{8,20}$/;

            if (!jambPattern.test(jambNumber)) {

                showMessage(
                    "Please enter a valid JAMB Number."
                );

                return;
            }


            /*
            DEMO SUCCESS MESSAGE
            */

            showMessage(
                "Your information has been submitted. Connecting to the screening portal..."
            );


            /*
            DEMO DELAY
            */

            setTimeout(function () {

                /*
                For the real authorized deployment,
                replace this section with your backend
                authentication endpoint.

                Example:

                window.location.href = "dashboard.html";
                */

                window.location.href = "dashboard.html";

            }, 1200);

        });

    }


    /*
    ==========================================
    MESSAGE FUNCTION
    ==========================================
    */

    function showMessage(message) {

        if (!loginMessage) {
            return;
        }

        loginMessage.textContent = message;

        loginMessage.style.display = "block";

    }


    /*
    ==========================================
    INPUT CLEANUP
    ==========================================
    */

    const jambInput =
        document.getElementById("jambNumber");

    if (jambInput) {

        jambInput.addEventListener("input", function () {

            this.value = this.value
                .replace(/\s+/g, "")
                .toUpperCase();

        });

    }

});
