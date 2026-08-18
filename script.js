document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const jambNumber =
            document.getElementById("jambNumber").value.trim();

        const state =
            document.getElementById("state").value;

        const gender =
            document.getElementById("gender").value;


        // Basic validation
        if (!jambNumber || !state || !gender) {

            loginMessage.textContent =
                "Please complete all required fields.";

            loginMessage.style.color = "#c00000";

            return;
        }


        // Save applicant information temporarily
        const applicant = {
            jambNumber: jambNumber,
            state: state,
            gender: gender
        };

        localStorage.setItem(
            "bUKApplicant",
            JSON.stringify(applicant)
        );


        // Show processing message
        loginMessage.textContent =
            "Checking your details...";

        loginMessage.style.color = "#006b3c";


        // Temporary login simulation
        setTimeout(function () {

            loginMessage.textContent =
                "Login successful. Redirecting...";

            loginMessage.style.color = "#006b3c";


            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 800);

        }, 1000);

    });

});
