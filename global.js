// let pages = [
//     { url: 'background/index.html', title: 'Background', sectionId: 'section1' },
//     { url: 'features/features.html', title: 'Features', sectionId: 'section2' },
//     { url: 'plots/index.html', title: 'Main Plots', sectionId: 'section3' },
//     { url: 'takeaways/takeaways.html', title: 'Takeaways', sectionId: 'section4' },
// ];
let pages = [
    { url: '/dsc106_final_project/background/index.html', title: 'Background', sectionId: 'content1' },
    { url: '/dsc106_final_project/features/features.html', title: 'Features', sectionId: 'content2' },
    { url: '/dsc106_final_project/plots/index.html', title: 'Main Plots', sectionId: 'content3' },
    { url: '/dsc106_final_project/takeaways/takeaways.html', title: 'Takeaways', sectionId: 'content4' },
];
let nav = document.createElement('nav');
document.body.prepend(nav);

nav.style.position = 'fixed';
nav.style.top = '0';
nav.style.left = '0';
nav.style.height = '100%';
nav.style.width = '200px';
nav.style.display = 'flex';
nav.style.flexDirection = 'column';
nav.style.backgroundColor = '#f8f9fa';
nav.style.padding = '10px';
nav.style.boxShadow = '2px 0 5px rgba(0,0,0,0.1)';


for (let p of pages) {
    let a = document.createElement('a');
    a.href = `#${p.sectionId}`;
    a.textContent = p.title;
    a.style.marginBottom = '10px'; // Add some spacing between links
    nav.append(a);

    // Fetch and insert content for each section
    if (p.url) {
        fetch(p.url)
            .then(response => response.text())
            .then(data => {
                const section = document.getElementById(p.sectionId);
                section.innerHTML = data;

                // Re-evaluate any scripts in the fetched content
                const scripts = section.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    newScript.textContent = oldScript.textContent;
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });
            })
            .catch(error => console.error('Error loading section:', error));
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll('div[id^="content"]'); 
    const navLinks = document.querySelectorAll('nav a');

    // Highlight the active section based on scroll position
    window.addEventListener("scroll", () => {
        let current = ""; 

        sections.forEach((section) => {
            const sectionTop = section.offsetTop; 
            const sectionHeight = section.clientHeight; 
            const sectionBottom = sectionTop + sectionHeight; 
            console.log(`Section: ${section.id}, Top: ${sectionTop}, Bottom: ${sectionBottom}`);

            // Check if the current scroll position is within this section
            if (window.scrollY >= sectionTop - 50 && window.scrollY < sectionBottom - 50) {
                current = section.getAttribute("id"); 
            }
        });

        // Highlight the corresponding navigation link
        navLinks.forEach((link) => {
            link.classList.remove("active"); 
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active"); 
            }
        });
    });

    // Smooth scrolling when clicking on navbar links
    navLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1); 
            const targetSection = document.getElementById(targetId); 

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 10, 
                    behavior: "smooth", // Smooth scrolling
                });
            }
        });
    });

    // Initial call to highlight the active section on page load
    window.dispatchEvent(new Event("scroll"));
});


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
// Create a container div for the buttons

const buttonContainer = document.createElement('div');
buttonContainer.classList.add('button-container');

// Create play button
const playButton = document.createElement('button');
playButton.textContent = 'Play Music';
playButton.classList.add('music-button');

// Create pause button
const pauseButton = document.createElement('button');
pauseButton.textContent = 'Pause Music';
pauseButton.classList.add('music-button');

// Append buttons to the container
buttonContainer.appendChild(playButton);
buttonContainer.appendChild(pauseButton);

// Add container to the body
document.body.appendChild(buttonContainer);

// Create audio element
const audio = document.createElement('audio');
audio.id = 'background-audio';
audio.loop = true;

// Create source element
const source = document.createElement('source');
source.src = '../dsc106_final_project/jupiter/01.I.AllegroVivace.mp3';
source.type = 'audio/mpeg';

audio.appendChild(source);
document.body.appendChild(audio);

// Set the starting point of the song (in seconds)
const startTime = 2; // Set the time you want to start the music (e.g., 30 seconds)

audio.currentTime = startTime; // Set the audio to start from 30 seconds

// Add event listeners
playButton.addEventListener('click', () => audio.play());
pauseButton.addEventListener('click', () => audio.pause());