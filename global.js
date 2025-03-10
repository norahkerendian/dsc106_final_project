// // let pages = [
// //     { url: '', title: 'Background' },
// //     { url: 'features/features.html', title: 'Features' },
// //     { url: 'plots/index.html', title: 'Main Plots' },
// //     { url: 'conclusion/conclusion.html', title: 'Conclusion' },
// //     { url: 'writeup/index.html', title: 'Write Up' },
// //   ];

// let pages = [
//     { url: '/dsc106_final_project/', title: 'Background' },
//     { url: '/dsc106_final_project/features/features.html', title: 'Features' },
//     { url: '/dsc106_final_project/plots/index.html', title: 'Main Plots' },
//     { url: '/dsc106_final_project/conclusion/conclusion.html', title: 'Conclusion' },
//     { url: '/dsc106_final_project/writeup/index.html', title: 'Write Up' },
// ];

// // let prevScrollY = window.scrollY;

//   let nav = document.createElement('nav');
//   document.body.prepend(nav);
  
//   const ARE_WE_HOME = document.documentElement.classList.contains('home');
  
//   for (let p of pages) {
//     let url = p.url;
//     let title = p.title;
  
//     // url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
//     url = url.startsWith('/') ? url : '/' + url;

//     let a = document.createElement('a');
//     a.href = url;
//     a.textContent = title;
//     nav.append(a);

//     if (a.host === location.host && a.pathname === location.pathname) {
//         a.classList.add('current');
//       }

//     if (a.host !== location.host) {
//         a.target = '_blank';
//     }
//   }

// // document.body.insertAdjacentHTML(
// // 'afterbegin',
// // `
// // <label class="color-scheme">
// //     Theme:
// //     <select>
// //     <option value="auto">Automatic</option>
// //     <option value="light">Light</option>
// //     <option value="dark">Dark</option>
// //     </select>
// // </label>`
// // );

// // function setColorScheme(colorScheme) {
// //     document.documentElement.style.setProperty('color-scheme', colorScheme);
// //     localStorage.colorScheme = colorScheme;
// //   }
  
// // const select = document.querySelector(".color-scheme select");
  
// // if (localStorage.colorScheme) {
// //     setColorScheme(localStorage.colorScheme); 
// //     select.value = localStorage.colorScheme; 
// //   } else {
// //     setColorScheme('auto'); 
// //     select.value = 'auto'; 
// //   }

// // select.addEventListener('input', function (event) {
// //     console.log('color scheme changed to', event.target.value);
// //     setColorScheme(event.target.value);
// //   });

//   document.addEventListener("DOMContentLoaded", function () {
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

// // Create play button
// const playButton = document.createElement('button');
// playButton.textContent = 'Play Music';
// document.body.appendChild(playButton);

// // Create pause button
// const pauseButton = document.createElement('button');
// pauseButton.textContent = 'Pause Music';
// document.body.appendChild(pauseButton);

// // Create audio element
// const audio = document.createElement('audio');
// audio.id = 'background-audio';
// audio.loop = true;

// // Create source element
// const source = document.createElement('source');
// source.src = '../jupiter/01.I.AllegroVivace.mp3';
// source.type = 'audio/mpeg';

// audio.appendChild(source);
// document.body.appendChild(audio);

// // Add event listeners
// playButton.addEventListener('click', () => audio.play());
// pauseButton.addEventListener('click', () => audio.pause());

// // Scrolling
// document.addEventListener('scroll', () => {
//     if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
//         goToNextPage();
//     }
//     // } else if (window.scrollY < prevScrollY) {
//     //     goToPreviousPage(); // Go to previous page on scroll up
//     // }
//     // prevScrollY = window.scrollY;
// });

// function goToNextPage() {
//     // Find the current page index
//     const currentPageIndex = pages.findIndex(page =>
//         location.pathname.endsWith(page.url)
//     );

//     // If a next page exists, navigate to it
//     if (currentPageIndex !== -1 && currentPageIndex < pages.length - 1) {
//         const nextPage = pages[currentPageIndex + 1].url;
//         window.location.href = nextPage;
//     }
// }

// // Function to go to the previous page
// // function goToPreviousPage() {
// //     const currentPageIndex = pages.findIndex(page =>
// //         location.pathname.endsWith(page.url)
// //     );
// //     if (currentPageIndex !== -1 && currentPageIndex > 0) {
// //         const prevPage = pages[currentPageIndex - 1].url;
// //         window.location.href = prevPage;
// //     }
// // }




let pages = [
    { url: '/dsc106_final_project/', title: 'Background' },
    { url: '/dsc106_final_project/features/features.html', title: 'Features' },
    { url: '/dsc106_final_project/plots/index.html', title: 'Main Plots' },
    { url: '/dsc106_final_project/conclusion/conclusion.html', title: 'Conclusion' },
    { url: '/dsc106_final_project/writeup/index.html', title: 'Write Up' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = url.startsWith('/') ? url : '/' + url;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    if (a.host !== location.host) {
        a.target = '_blank';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const terms = document.querySelectorAll(".term");

    terms.forEach(term => {
        let tooltip;

        term.addEventListener("mouseenter", function (event) {
            tooltip = document.createElement("div");
            tooltip.classList.add("tooltip");
            tooltip.textContent = term.getAttribute("data-definition");
            document.body.appendChild(tooltip);

            const rect = term.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;

            setTimeout(() => tooltip.classList.add("visible"), 10);
        });

        term.addEventListener("mouseleave", function () {
            if (tooltip) {
                tooltip.remove();
            }
        });

        term.addEventListener("click", function (event) {
            event.stopPropagation();
            if (tooltip) {
                tooltip.classList.toggle("visible");
            }
        });

        document.addEventListener("click", function () {
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
});

// Create play button
const playButton = document.createElement('button');
playButton.textContent = 'Play Music';
document.body.appendChild(playButton);

// Create pause button
const pauseButton = document.createElement('button');
pauseButton.textContent = 'Pause Music';
document.body.appendChild(pauseButton);

// Create audio element
const audio = document.createElement('audio');
audio.id = 'background-audio';
audio.loop = true;

// Create source element
const source = document.createElement('source');
source.src = '../jupiter/01.I.AllegroVivace.mp3';
source.type = 'audio/mpeg';

audio.appendChild(source);
document.body.appendChild(audio);

// Add event listeners
playButton.addEventListener('click', () => audio.play());
pauseButton.addEventListener('click', () => audio.pause());

// let navigating = false; // Prevents multiple navigation triggers

// document.addEventListener('scroll', () => {
//     // Only navigate when the user reaches the bottom and isn't already navigating
//     if (!navigating && window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
//         navigating = true;
//         setTimeout(goToNextPage, 1000); // Delay navigation to ensure smooth experience
//     }
// });

// function goToNextPage() {
//     const currentPageIndex = pages.findIndex(page =>
//         location.pathname.endsWith(page.url)
//     );

//     if (currentPageIndex !== -1 && currentPageIndex < pages.length - 1) {
//         const nextPage = pages[currentPageIndex + 1].url;
//         window.location.href = nextPage;
//     }

//     navigating = false; // Allow further navigation
// }
