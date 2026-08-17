/* =========================================
   BUK UNDERGRADUATE SCREENING PORTAL
   FRONTEND APPLICATION LOGIC
========================================= */


/* =========================================
   APPLICATION STATE
========================================= */

const state = {

  profile:
    JSON.parse(
      localStorage.getItem("buk_profile") || "null"
    ),

  olevel:
    JSON.parse(
      localStorage.getItem("buk_olevel") || "null"
    ),

  payment:
    JSON.parse(
      localStorage.getItem("buk_payment_v2") || "null"
    )

};


/* =========================================
   DOM ELEMENTS
========================================= */

const pages =
  document.querySelectorAll(".page");

const navButtons =
  document.querySelectorAll(".nav");

const sidebar =
  document.getElementById("sidebar");

const menuButton =
  document.getElementById("menuBtn");

const toast =
  document.getElementById("toast");


/* =========================================
   PAGE NAVIGATION
========================================= */

function openPage(pageName) {

  pages.forEach(function(page) {

    page.classList.toggle(
      "active",
      page.id === pageName
    );

  });


  navButtons.forEach(function(button) {

    button.classList.toggle(
      "active",
      button.dataset.page === pageName
    );

  });


  /*
    Close mobile sidebar
  */

  if (sidebar) {

    sidebar.classList.remove("open");

  }


  /*
    Scroll to top
  */

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  updatePortal();

}


/* =========================================
   SIDEBAR NAVIGATION
========================================= */

navButtons.forEach(function(button) {

  button.addEventListener(
    "click",
    function() {

      const page =
        button.dataset.page;

      openPage(page);

    }
  );

});


/* =========================================
   MOBILE MENU
========================================= */

if (menuButton) {

  menuButton.addEventListener(
    "click",
    function() {

      sidebar.classList.toggle("open");

    }
  );

}


/* =========================================
   TOAST MESSAGE
========================================= */

function showToast(message) {

  if (!toast) {
    return;
  }


  toast.textContent = message;

  toast.classList.add("show");


  setTimeout(function() {

    toast.classList.remove("show");

  }, 2500);

}


/* =========================================
   PROFILE FORM
========================================= */

const profileForm =
  document.getElementById("profileForm");


if (profileForm) {

  profileForm.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      /*
        Convert form fields into an object
      */

      const formData =
        new FormData(profileForm);


      const profile =
        Object.fromEntries(formData.entries());


      /*
        Save candidate information
      */

      state.profile = profile;


      localStorage.setItem(
        "buk_profile",
        JSON.stringify(profile)
      );


      showToast(
        "Candidate profile saved successfully."
      );


      updatePortal();

    }
  );

}


/* =========================================
   O' LEVEL FORM
========================================= */

const olevelForm =
  document.getElementById("olevelForm");


if (olevelForm) {

  olevelForm.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      const formData =
        new FormData(olevelForm);


      const result =
        Object.fromEntries(
          formData.entries()
        );


      /*
        Save O' Level information
      */

      state.olevel = result;


      localStorage.setItem(
        "buk_olevel",
        JSON.stringify(result)
      );


      showToast(
        "O' Level result saved successfully."
      );


      updatePortal();

    }
  );

}


/* =========================================
   PAYMENT
========================================= */

const paymentButton =
  document.getElementById(
    "generatePayment"
  );


if (paymentButton) {

  paymentButton.addEventListener(
    "click",
    function() {


      /*
        Candidate profile is required
      */

      if (!state.profile) {

        showToast(
          "Complete your candidate profile first."
        );

        openPage("profile");

        return;

      }


      /*
        O' Level information is required
      */

      if (!state.olevel) {

        showToast(
          "Submit your O' Level result first."
        );

        openPage("olevel");

        return;

      }


      /*
        Generate a temporary reference.

        This is only for the frontend prototype.
        It should later be replaced with the
        real payment gateway reference.
      */

      const reference =
        "BUK-SCR-" +
        Date.now();


      state.payment = {

        reference: reference,

        status: "Reference Generated",

        amount: 2000,

        createdAt:
          new Date().toISOString()

      };


      localStorage.setItem(
        "buk_payment_v2",
        JSON.stringify(state.payment)
      );


      showToast(
        "Payment reference generated successfully."
      );


      updatePortal();

    }
  );

}


/* =========================================
   ACKNOWLEDGEMENT SLIP
========================================= */

const printButton =
  document.getElementById(
    "printAck"
  );


if (printButton) {

  printButton.addEventListener(
    "click",
    function() {


      /*
        Payment/reference must exist
      */

      if (!state.payment) {

        showToast(
          "Complete the payment step first."
        );

        openPage("payment");

        return;

      }


      /*
        Open browser print dialog
      */

      window.print();

    }
  );

}


/* =========================================
   SAFE TEXT HELPER
========================================= */

function setText(
  elementId,
  value
) {

  const element =
    document.getElementById(
      elementId
    );


  if (!element) {
    return;
  }


  element.textContent =
    value || "";

}


/* =========================================
   GET CANDIDATE NAME
========================================= */

function getCandidateName() {

  if (!state.profile) {

    return "Not logged in";

  }


  const first =
    state.profile.firstName || "";

  const middle =
    state.profile.middleName || "";

  const last =
    state.profile.lastName || "";


  const name =
    [first, middle, last]
      .filter(Boolean)
      .join(" ");


  return name || "Candidate";

}


/* =========================================
   UPDATE PORTAL
=========================================
