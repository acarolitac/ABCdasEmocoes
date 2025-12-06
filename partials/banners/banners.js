let index = 0;
const slides = document.getElementById("slides");
const dots = document.querySelectorAll("#dots button");
const total = dots.length;

function go(n) {
    index = (n + total) % total;
    slides.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach(d => d.classList.remove("active"));
    dots[index].classList.add("active");
}

document.getElementById("prev").onclick = () => go(index - 1);
document.getElementById("next").onclick = () => go(index + 1);

dots.forEach(dot => {
    dot.onclick = () => go(parseInt(dot.dataset.index));
});
