document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");
    const loginButton = document.getElementById("loginButton");

    if (!loginForm) return;

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const jambNumber =
            document.getElementById("jambNumber").value.trim();

        const state =
            document.getElementById("state").value;

        const gender =
            document.getElementById("gender").value;


        /* -----------------------------
           VALIDATION
        ----------------------------- */

        if (jambNumber === "") {
            showMessage(
                "Please enter your JAMB Number.",
                "error"
            );

            document.getElementById("jambNumber").focus();
            return;
        }

        if (state === "") {
            showMessage(
                "Please select your State.",
                "error"
            );

            document.getElementById("state").focus();
            return;
        }

        if (gender === "") {
            showMessage(
                "Please select your Gender.",
                "error"
            );

            document.getElementById("gender").focus();
            return;
        }


        /* -----------------------------
           BUTTON PROCESSING
        ----------------------------- */

        loginButton.disabled = true;
        loginButton.textContent = "Checking...";

        showMessage(
            "Checking your details...",
            "success"
        );


        /* -----------------------------
           DEMO APPLICANT SESSION
        ----------------------------- */

        const applicant = {
            jambNumber: jambNumber,
            state: state,
            gender: gender,
            loggedIn: true,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem(
            "bUKApplicant",
            JSON.stringify(applicant)
        );


        /* -----------------------------
           REDIRECT
        ----------------------------- */

        setTimeout(() => {

            showMessage(
                "Login successful. Redirecting...",
                "success"
            );

            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 600);

        }, 1000);

    });


    /* -----------------------------
       MESSAGE FUNCTION
    ----------------------------- */

    function showMessage(message, type) {

        loginMessage.textContent = message;

        if (type === "error") {

            loginMessage.style.color = "#b00020";

        } else {

            loginMessage.style.color = "#006633";

        }

    }

});
