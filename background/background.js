// document.addEventListener("DOMContentLoaded", function () {
//     const sections = document.querySelectorAll("section");
//     const navLinks = document.querySelectorAll("nav ul li");

//     function changeActiveSection() {
//         let index = sections.length;

//         while (--index && window.scrollY + 50 < sections[index].offsetTop) {}

//         navLinks.forEach((li) => li.classList.remove("active"));
//         navLinks[index].classList.add("active");
//     }

//     // Run function on scroll
//     window.addEventListener("scroll", changeActiveSection);

//     // Smooth scroll on click
//     navLinks.forEach((li, i) => {
//         li.addEventListener("click", function (e) {
//             e.preventDefault();
//             window.scrollTo({
//                 top: sections[i].offsetTop,
//                 behavior: "smooth",
//             });
//         });
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const terms = document.querySelectorAll(".term");

//     terms.forEach(term => {
//         let tooltip;

//         term.addEventListener("mouseenter", function (event) {
//             tooltip = document.createElement("div");
//             tooltip.classList.add("tooltip");
//             tooltip.textContent = term.getAttribute("data-definition");
//             document.body.appendChild(tooltip);

//             const rect = term.getBoundingClientRect();
//             tooltip.style.left = `${rect.left + window.scrollX}px`;
//             tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;

//             setTimeout(() => tooltip.classList.add("visible"), 10);
//         });

//         term.addEventListener("mouseleave", function () {
//             if (tooltip) {
//                 tooltip.remove();
//             }
//         });

//         term.addEventListener("click", function (event) {
//             event.stopPropagation(); // Prevent closing immediately
//             if (tooltip) {
//                 tooltip.classList.toggle("visible");
//             }
//         });

//         document.addEventListener("click", function () {
//             if (tooltip) {
//                 tooltip.remove();
//             }
//         });
//     });
// });