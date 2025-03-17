// Add animation for rotation around the medial-lateral axis (tilting forward and backward)
const personMx = document.querySelector(".MxPersonImage");
console.log('MxPerson: ', document.querySelector(".MxPersonImage")); 

    let rotationMx = 0;
    let directionMx = 1;

    function rotatePersonMx() {
        rotationMx += directionMx * 1; // Increment rotation angle back and forth
        if (rotationMx > 40 || rotationMx < -40) {
            directionMx *= -1; // Reverse direction when reaching limits
        }
        personMx.style.transform = `rotateX(${rotationMx}deg)`; // Tilt forward and backward

        requestAnimationFrame(rotatePersonMx); // Keep oscillating smoothly
    }
    rotatePersonMx();

// Add animation for rotation around the anterior-posterior axis (cartwheel motion without full rotation)
const personMy = document.querySelector(".MyPersonImage");
let rotationMy = 0;
let direction = 1;

function rotatePersonMy() {
    rotationMy += direction * 1; // Increment rotation angle back and forth
    if (rotationMy > 21 || rotationMy < -21) {
        direction *= -1; // Reverse direction when reaching limits
    }
    personMy.style.transform = `rotateZ(${rotationMy}deg)`; // Rotate the person around Z-axis (cartwheel motion)

    requestAnimationFrame(rotatePersonMy); // Keep oscillating smoothly
}
rotatePersonMy();

const slider = document.getElementById("pressureSlider");
const leftBox = document.getElementById("leftPressure");
const rightBox = document.getElementById("rightPressure");

function updateColors() {
  let value = slider.value;
  let intensity = (value / 100) * 255; // Scale intensity across full range (0 to 255)

  let rightShade = 255 - intensity; // Darker as value decreases
  let leftShade = intensity; // Opposite of leftShade

  let leftColor = `rgb(${leftShade}, ${leftShade}, ${leftShade})`;
  let rightColor = `rgb(${rightShade}, ${rightShade}, ${rightShade})`;

  leftBox.style.backgroundColor = leftColor;
  rightBox.style.backgroundColor = rightColor;
}

// Set initial value to middle and apply colors on load
slider.value = 50;
updateColors();

// Update colors on slider input
slider.addEventListener("input", updateColors);


// const sliderY = document.getElementById("pressureSliderY");
// const upperBox = document.getElementById("upperPressure");
// const lowerBox = document.getElementById("lowerPressure");

// sliderY.addEventListener("input", () => {
//     let value = sliderY.value;
//     let intensity = Math.abs(value - 50) * 5; // Scale intensity for visual effect

//     let upperColor, lowerColor;

//     if (value < 50) {
//         // More pressure on upper, so it gets darker blue
//         upperColor = `#0000${(255 - intensity).toString(16).padStart(2, '0')}`;
//         lowerColor = `#d3e2f0`; // Lighter blue for less pressure on lower
//     } else {
//         // More pressure on lower, so it gets darker blue
//         upperColor = `#d3e2f0`; // Lighter blue for less pressure on upper
//         lowerColor = `#0000${(255 - intensity).toString(16).padStart(2, '0')}`;
//     }

//     upperBox.style.backgroundColor = upperColor;
//     lowerBox.style.backgroundColor = lowerColor;
// });

const sliderY = document.getElementById("pressureSliderY");
const upperBox = document.getElementById("upperPressure");
const lowerBox = document.getElementById("lowerPressure");

function updateVerticalColors() {
    let value = sliderY.value;
    let intensity = (value / 100) * 255; // Scale intensity across full range (0 to 255)

    let lowerShade = 255 - intensity; // Darker as value decreases
    let upperShade = intensity; // Opposite of upperShade

    let upperColor = `rgb(${upperShade}, ${upperShade}, ${upperShade})`;
    let lowerColor = `rgb(${lowerShade}, ${lowerShade}, ${lowerShade})`;

    upperBox.style.backgroundColor = upperColor;
    lowerBox.style.backgroundColor = lowerColor;
}

// Set initial value to middle and apply colors on load
sliderY.value = 50;
updateVerticalColors();

// Update colors on slider input
sliderY.addEventListener("input", updateVerticalColors);

