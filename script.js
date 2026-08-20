/* ============================================================
   BUK DIRECT ENTRY SCREENING PORTAL
   SUPABASE CONNECTION
   ============================================================ */

const SUPABASE_URL =
  "https://uxtmqsjqqnxbjnbmjyhx.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_DFCIvtLLD3nuDugftfezqA_ZnXvKoch";


const { createClient } = window.supabase;

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  }
);


/* ============================================================
   APPLICATION STATE
   ============================================================ */

const state = {
  candidate: null,
  olevel: null,
  payment: null,
  loggedIn: false
};


/* ============================================================
   ELEMENTS
   ============================================================ */

const pages =
  document.querySelectorAll(".page");

const navs =
  document.querySelectorAll(".nav");

const sidebar =
  document.getElementById("sidebar");

const toast =
  document.getElementById("toast");


/* ============================================================
   TOAST
   ============================================================ */

function toastMsg(message) {

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);

}


/* ============================================================
   PAGE NAVIGATION
   ============================================================ */

function go(page) {

  if (!state.loggedIn && page !== "login") {

    toastMsg(
      "Please login first."
    );

    page = "login";
  }


  pages.forEach(section => {

    section.classList.toggle(
      "active",
      section.id === page
    );

  });


  navs.forEach(nav => {

    nav.classList.toggle(
      "active",
      nav.dataset.page === page
    );

  });


  sidebar.classList.remove("open");

  window.scrollTo(0, 0);

  update();

}


navs.forEach(nav => {

  nav.addEventListener("click", () => {

    go(nav.dataset.page);

  });

});


document
  .getElementById("menuBtn")
  .addEventListener("click", () => {

    sidebar.classList.toggle("open");

  });


/* ============================================================
   LOGIN
   DE NUMBER + STATE + GENDER
   ============================================================ */

document
  .getElementById("loginForm")
  .addEventListener("submit", async event => {

    event.preventDefault();


    const form =
      new FormData(event.target);


    const deNumber =
      String(form.get("deNumber") || "")
        .trim();

    const stateOfOrigin =
      String(form.get("state") || "")
        .trim();

    const gender =
      String(form.get("gender") || "")
        .trim();


    if (
      !deNumber ||
      !stateOfOrigin ||
      !gender
    ) {

      toastMsg(
        "Please complete all login fields."
      );

      return;
    }


    const button =
      document.getElementById("loginBtn");


    button.disabled = true;

    button.textContent =
      "Checking...";


    try {

      /*
       * First identify the candidate.
       * This function is already in your database.
       */

      const {
        data: candidateId,
        error: loginError
      } = await supabase.rpc(
        "bukde_login",
        {
          p_de_number: deNumber,
          p_state: stateOfOrigin,
          p_gender: gender
        }
      );


      if (loginError) {
        throw loginError;
      }


      if (!candidateId) {

        toastMsg(
          "Invalid DE Number, State of Origin or Gender."
        );

        return;
      }


      /*
       * Create the invisible Supabase session.
       * The candidate does not see or enter a password.
       */

      const {
        data: authData,
        error: authError
      } =
        await supabase.auth.getSession();


      let session =
        authData?.session || null;


      if (!session) {

        const {
          data,
          error
        } =
          await supabase.auth.signInAnonymously();


        if (error) {
          throw error;
        }


        session =
          data.session;
      }


      if (!session) {

        throw new Error(
          "Unable to create secure session."
        );

      }


      /*
       * Link this candidate to the anonymous session.
       */

      const {
        error: claimError
      } = await supabase.rpc(
        "claim_bukde_candidate",
        {
          p_candidate_id: candidateId
        }
      );


      if (claimError) {
        throw claimError;
      }


      /*
       * Now retrieve only the candidate belonging
       * to this session.
       */

      const {
        data: candidate,
        error: candidateError
      } =
        await supabase
          .from("candidates")
          .select("*")
          .eq("id", candidateId)
          .single();


      if (candidateError) {
        throw candidateError;
      }


      state.candidate =
        candidate;

      state.loggedIn =
        true;


      await loadOLevel();

      await loadPayment();


      toastMsg(
        "Login successful."
      );


      go("profile");


    } catch (error) {

      console.error(error);

      toastMsg(
        error.message ||
        "Unable to login. Please try again."
      );

    } finally {

      button.disabled = false;

      button.textContent =
        "Login";

    }

  });


/* ============================================================
   PROFILE UPDATE
   ============================================================ */

document
  .getElementById("profileForm")
  .addEventListener("submit", async event => {

    event.preventDefault();


    if (!state.candidate) {

      toastMsg(
        "Please login first."
      );

      go("login");

      return;
    }


    const form =
      new FormData(event.target);


    const updateData = {

      first_name:
        String(
          form.get("firstName") || ""
        ).trim(),

      middle_name:
        String(
          form.get("middleName") || ""
        ).trim() || null,

      last_name:
        String(
          form.get("lastName") || ""
        ).trim(),

      dob:
        form.get("dob") || null,

      lga:
        String(
          form.get("lga") || ""
        ).trim(),

      phone:
        String(
          form.get("phone") || ""
        ).trim(),

      email:
        String(
          form.get("email") || ""
        ).trim(),

      alt_phone:
        String(
          form.get("altPhone") || ""
        ).trim() || null,

      alt_email:
        String(
          form.get("altEmail") || ""
        ).trim() || null,

      address:
        String(
          form.get("address") || ""
        ).trim(),

      kin_name:
        String(
          form.get("kinName") || ""
        ).trim(),

      kin_relationship:
        String(
          form.get("kinRelationship") || ""
        ).trim(),

      kin_phone:
        String(
          form.get("kinPhone") || ""
        ).trim(),

      kin_address:
        String(
          form.get("kinAddress") || ""
        ).trim(),

      updated_at:
        new Date().toISOString()

    };


    const button =
      event.target.querySelector(
        "button[type='submit']"
      );


    button.disabled = true;

    button.textContent =
      "Saving...";


    try {

      const {
        data,
        error
      } =
        await supabase
          .from("candidates")
          .update(updateData)
          .eq("id", state.candidate.id)
          .select()
          .single();


      if (error) {
        throw error;
      }


      state.candidate =
        data;


      toastMsg(
        "Profile updated successfully."
      );


      update();


      setTimeout(() => {
        go("olevel");
      }, 600);


    } catch (error) {

      console.error(error);

      toastMsg(
        error.message ||
        "Unable to save profile."
      );

    } finally {

      button.disabled = false;

      button.textContent =
        "Update Profile";

    }

  });


/* ============================================================
   O LEVEL
   ============================================================ */

document
  .getElementById("olevelForm")
  .addEventListener("submit", async event => {

    event.preventDefault();


    if (!state.candidate) {

      toastMsg(
        "Please login first."
      );

      go("login");

      return;
    }


    const form =
      new FormData(event.target);


    const resultData = {

      candidate_id:
        state.candidate.id,

      exam1:
        form.get("exam1"),

      year1:
        form.get("year1"),

      number1:
        form.get("number1"),

      result1:
        form.get("result1"),

      exam2:
        form.get("exam2") || null,

      year2:
        form.get("year2") || null,

      number2:
        form.get("number2") || null,

      result2:
        form.get("result2") || null,

      declared:
        form.get("declare") === "on"

    };


    const button =
      event.target.querySelector(
        "button[type='submit']"
      );


    button.disabled = true;

    button.textContent =
      "Saving...";


    try {

      /*
       * Check whether the candidate already has
       * an O' Level record.
       */

      const {
        data: existing,
        error: findError
      } =
        await supabase
          .from("olevel_results")
          .select("id")
          .eq(
            "candidate_id",
            state.candidate.id
          )
          .maybeSingle();


      if (findError) {
        throw findError;
      }


      let saved;


      if (existing) {

        const {
          data,
          error
        } =
          await supabase
            .from("olevel_results")
            .update({
              exam1:
                resultData.exam1,

              year1:
                resultData.year1,

              number1:
                resultData.number1,

              result1:
                resultData.result1,

              exam2:
                resultData.exam2,

              year2:
                resultData.year2,

              number2:
                resultData.number2,

              result2:
                resultData.result2,

              declared:
                resultData.declared,

              updated_at:
                new Date().toISOString()
            })
            .eq(
              "id",
              existing.id
            )
            .select()
            .single();


        if (error) {
          throw error;
        }


        saved = data;

      } else {

        const {
          data,
          error
        } =
          await supabase
            .from("olevel_results")
            .insert(resultData)
            .select()
            .single();


        if (error) {
          throw error;
        }


        saved = data;

      }


      state.olevel =
        saved;


      toastMsg(
        "O' Level result saved successfully."
      );


      update();


      setTimeout(() => {
        go("payment");
      }, 600);


    } catch (error) {

      console.error(error);

      toastMsg(
        error.message ||
        "Unable to save O' Level result."
      );

    } finally {

      button.disabled = false;

      button.textContent =
        "Save O' Level Result";

    }

  });


/* ============================================================
   LOAD O LEVEL
   ============================================================ */

async function loadOLevel() {

  if (!state.candidate) {
    return;
  }


  const {
    data,
    error
  } =
    await supabase
      .from("olevel_results")
      .select("*")
      .eq(
        "candidate_id",
        state.candidate.id
      )
      .maybeSingle();


  if (error) {

    console.error(
      "O' Level load error:",
      error
    );

    return;
  }


  state.olevel =
    data || null;


  if (data) {

    const form =
      document.getElementById(
        "olevelForm"
      );


    form.exam1.value =
      data.exam1 || "";

    form.year1.value =
      data.year1 || "";

    form.number1.value =
      data.number1 || "";

    form.result1.value =
      data.result1 || "";

    form.exam2.value =
      data.exam2 || "";

    form.year2.value =
      data.year2 || "";

    form.number2.value =
      data.number2 || "";

    form.result2.value =
      data.result2 || "";

    form.declare.checked =
      data.declared === true;

  }

}


/* ============================================================
   PAYMENT RECORD
   ============================================================ */

async function loadPayment() {

  if (!state.candidate) {
    return;
  }


  const {
    data,
    error
  } =
    await supabase
      .from("payments")
      .select("*")
      .eq(
        "candidate_id",
        state.candidate.id
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      )
      .limit(1)
      .maybeSingle();


  if (error) {

    console.error(
      "Payment load error:",
      error
    );

    return;
  }


  state.payment =
    data || null;

}


/* ============================================================
   PAYMENT
   ============================================================ */

document
  .getElementById("generatePayment")
  .addEventListener(
    "click",
    async () => {

      if (!state.candidate) {

        toastMsg(
          "Please login first."
        );

        go("login");

        return;
      }


      if (!state.olevel) {

        toastMsg(
          "Submit your O' Level result first."
        );

        go("olevel");

        return;
      }


      const button =
        document.getElementById(
          "generatePayment"
        );


      button.disabled = true;

      button.textContent =
        "Preparing Payment...";


      try {

        /*
         * IMPORTANT:
         *
         * This creates the payment record.
         * The REAL payment gateway/RRR generation
         * will be handled by a Supabase Edge Function.
         *
         * We do NOT put gateway secret keys here.
         */

        const reference =
          "BUKDE-" +
          Date.now();


        const {
          data,
          error
        } =
          await supabase
            .from("payments")
            .insert({

              candidate_id:
                state.candidate.id,

              reference:
                reference,

              amount:
                2000,

              status:
                "pending",

              provider:
                "remita"

            })
            .select()
            .single();


        if (error) {
          throw error;
        }


        state.payment =
          data;


        toastMsg(
          "Payment reference created."
        );


        update();


      } catch (error) {

        console.error(error);

        toastMsg(
          error.message ||
          "Unable to create payment."
        );

      } finally {

        button.disabled = false;

        button.textContent =
          "Generate Payment";

      }

    }
  );


/* ============================================================
   ACKNOWLEDGEMENT
   ============================================================ */

document
  .getElementById("printAck")
  .addEventListener(
    "click",
    async () => {

      if (!state.candidate) {

        toastMsg(
          "Please login first."
        );

        go("login");

        return;
      }


      if (!state.olevel) {

        toastMsg(
          "Complete your O' Level result first."
        );

        go("olevel");

        return;
      }


      if (
        !state.payment ||
        state.payment.status !== "successful"
      ) {

        toastMsg(
          "Payment must be successfully verified first."
        );

        go("payment");

        return;
      }


      window.print();

    }
  );


/* ============================================================
   FORM HELPERS
   ============================================================ */

function fillProfileForm() {

  /*
   * IMPORTANT:
   *
   * We deliberately DO NOT populate the profile
   * form from the database.
   *
   * The candidate enters the profile information.
   */

  const form =
    document.getElementById(
      "profileForm"
    );


  form.reset();

}


/* ============================================================
   UPDATE DASHBOARD
   ============================================================ */

function setText(
  id,
  value
) {

  const element =
    document.getElementById(id);


  if (element) {
    element.textContent =
      value;
  }

}


function update() {

  const loggedIn =
    state.loggedIn &&
    !!state.candidate;


  const profileComplete =
    loggedIn &&
    !!state.candidate.first_name &&
    !!state.candidate.last_name &&
    !!state.candidate.dob &&
    !!state.candidate.lga &&
    !!state.candidate.phone &&
    !!state.candidate.email &&
    !!state.candidate.address &&
    !!state.candidate.kin_name &&
    !!state.candidate.kin_phone &&
    !!state.candidate.kin_address;


  const olevelComplete =
    !!state.olevel;


  const paymentSuccessful =
    !!state.payment &&
    state.payment.status ===
    "successful";


  const candidateName =
    profileComplete
      ? [
          state.candidate.first_name,
          state.candidate.middle_name,
          state.candidate.last_name
        ]
          .filter(Boolean)
          .join(" ")
      : "Profile Not Completed";


  setText(
    "paymentCandidate",
    candidateName
  );


  setText(
    "paymentDeNumber",
    loggedIn
      ? state.candidate.de_number
      : "Not available"
  );


  setText(
    "paymentRef",
    state.payment
      ? state.payment.reference
      : "Not generated"
  );


  setText(
    "paymentStatus",
    state.payment
      ? state.payment.status
      : "Pending"
  );


  setText(
    "sLogin",
    loggedIn
      ? "Completed"
      : "Pending"
  );


  setText(
    "sProfile",
    profileComplete
      ? "Completed"
      : "Pending"
  );


  setText(
    "sOlevel",
    olevelComplete
      ? "Completed"
      : "Pending"
  );


  setText(
    "sPayment",
    paymentSuccessful
      ? "Successful"
      : state.payment
        ? state.payment.status
        : "Pending"
  );


  setText(
    "sAck",
    paymentSuccessful
      ? "Available"
      : "Pending"
  );


  const statusMessage =
    document.getElementById(
      "statusMessage"
    );


  if (!loggedIn) {

    statusMessage.textContent =
      "Login with your DE Number, State of Origin and Gender.";

  } else if (!profileComplete) {

    statusMessage.textContent =
      "Login successful. Complete your profile update.";

  } else if (!olevelComplete) {

    statusMessage.textContent =
      "Profile completed. Submit your O' Level result.";

  } else if (!state.payment) {

    statusMessage.textContent =
      "O' Level result saved. Proceed to payment.";

  } else if (!paymentSuccessful) {

    statusMessage.textContent =
      "Payment is pending verification.";

  } else {

    statusMessage.textContent =
      "Your required screening steps have been completed.";

  }


  const ackMessage =
    document.getElementById(
      "ackMessage"
    );


  if (paymentSuccessful) {

    ackMessage.textContent =
      "Your payment has been verified. Your acknowledgement slip is ready for printing.";

  } else {

    ackMessage.textContent =
      "Complete your profile, O' Level information and successful payment before printing your acknowledgement slip.";

  }

}


/* ============================================================
   RESTORE SESSION
   ======================================
