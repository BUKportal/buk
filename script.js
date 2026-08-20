


const state={
 profile:JSON.parse(localStorage.getItem("buk_profile")||"null"),
 olevel:JSON.parse(localStorage.getItem("buk_olevel")||"null"),
 payment:JSON.parse(localStorage.getItem("buk_payment_v2")||"null")
};
const pages=document.querySelectorAll(".page"), navs=document.querySelectorAll(".nav"), sidebar=document.getElementById("sidebar"), toast=document.getElementById("toast");
function toastMsg(x){toast.textContent=x;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2400)}
function go(page){pages.forEach(p=>p.classList.toggle("active",p.id===page));navs.forEach(n=>n.classList.toggle("active",n.dataset.page===page));sidebar.classList.remove("open");window.scrollTo(0,0);update()}
navs.forEach(n=>n.onclick=()=>go(n.dataset.page));
document.getElementById("menuBtn").onclick=()=>sidebar.classList.toggle("open");

document.getElementById("profileForm").onsubmit=e=>{
 e.preventDefault();state.profile=Object.fromEntries(new FormData(e.target));localStorage.setItem("buk_profile",JSON.stringify(state.profile));toastMsg("Candidate profile saved.");update();
};
document.getElementById("olevelForm").onsubmit=e=>{
 e.preventDefault();state.olevel=Object.fromEntries(new FormData(e.target));localStorage.setItem("buk_olevel",JSON.stringify(state.olevel));toastMsg("O' Level information saved.");update();
};
document.getElementById("generatePayment").onclick=()=>{
 if(!state.profile){toastMsg("Complete your candidate profile first.");go("profile");return}
 if(!state.olevel){toastMsg("Submit your O' Level result first.");go("olevel");return}
 state.payment={reference:"BUK-SCR-"+Date.now(),status:"Generated",amount:2000};
 localStorage.setItem("buk_payment_v2",JSON.stringify(state.payment));toastMsg("Payment reference generated.");update();
};
document.getElementById("printAck").onclick=()=>{
 if(!state.payment){toastMsg("Complete payment first.");go("payment");return}
 window.print();
};
function setText(id,val){document.getElementById(id).textContent=val}
function update(){
 const p=!!state.profile,o=!!state.olevel, pay=!!state.payment;
 const name=p?[state.profile.firstName,state.profile.middleName,state.profile.lastName].filter(Boolean).join(" "):"Not logged in";
 setText("candidateName",name);setText("olevelHome",o?"Submitted":"Not Submitted");setText("paymentHome",pay?"Reference Generated":"Pending");
 setText("paymentCandidate",name);setText("paymentUtme",p?state.profile.utme:"Not available");setText("paymentRef",pay?state.payment.reference:"Not generated");setText("paymentStatus",pay?state.payment.status:"Pending");
 setText("sProfile",p?"Completed":"Pending");setText("sOlevel",o?"Completed":"Pending");setText("sPayment",pay?"Reference Generated":"Pending");setText("sAck",pay?"Available":"Pending");
 document.getElementById("statusMessage").textContent=!p?"Begin by completing your candidate profile.":!o?"Profile saved. Submit your O' Level result.":!pay?"O' Level saved. Proceed to payment.":"Required screening steps have been completed.";
 document.getElementById("ackMessage").textContent=pay?"Your acknowledgement slip is ready for printing in this demo version.":"Complete your profile, O' Level information and payment before generating the acknowledgement slip.";
}
update();
