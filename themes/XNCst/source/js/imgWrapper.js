const AvgBrightnessThreshold = 128;
const RateBrightnessThreshold = 0.6;
const DimAsRate = true;

window.addEventListener("DOMContentLoaded", function () {
    document
        .querySelectorAll("img:not(.maintain-brightness)")
        .forEach((img) => {
            if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
                if (isImgToBright(img, AvgBrightnessThreshold))
                    img.classList.add("dark-img-dim");
            } else {
                img.addEventListener("load", function onImgLoad() {
                    if (isImgToBright(img, AvgBrightnessThreshold))
                        img.classList.add("dark-img-dim");
                    img.removeEventListener("load", onImgLoad);
                });
            }
        });
});

function isImgToBright(img, threshold) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let totalBrightness = 0;
    let totalBrightPixel = 0;
    for (let i = 0; i < data.length; i += 4) {
        const gray =
            0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (gray > threshold) totalBrightPixel++;
        totalBrightness += gray;
    }
    const avgBrightness = totalBrightness / (data.length / 4);
    return (
        avgBrightness > threshold ||
        totalBrightPixel / (canvas.width * canvas.height) >
            RateBrightnessThreshold
    );
}
