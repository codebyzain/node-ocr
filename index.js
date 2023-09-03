const { createWorker } = require("tesseract.js");
var Jimp = require("jimp");

const start = async () => {
    const worker = await createWorker();
    (async () => {
        await worker.loadLanguage("ind");
        await worker.initialize("ind");
        await worker.setParameters({});
        var imagePath = "ktp.jpeg";
        var image = await Jimp.read(imagePath);
        image.rgba(false);
        // grayscale image to get a better result of text
        image.greyscale();
        // modified and write new image
        await image.write("edited_" + imagePath);
        setTimeout(async () => {
            const data = await worker.recognize("edited_" + imagePath);
            console.log("Total Accuracy", data.data.confidence);
            console.log("Total Accuracy", data.data.text);
            data.data.lines.map((item) => {
                if (item.confidence > 60) {
                    item.text.split("\n").map((word) => {
                        word = word.trim().split(" ");
                        const wordKey = word[0].replace(/[&\/\\#+()$~%'":;"*?<>{}]/g, "").toLowerCase();
                        word.shift();
                        const wordValue = word
                            .join()
                            .replace(/[&\/\\#,+()$~%.'":;"\-*?<>{}]/g, " ")
                            .trim();
                        if (wordKey != "")
                            console.log({
                                [wordKey]: wordValue,
                            });
                    });
                }
            });
            await worker.terminate();
        }, 600);
    })();
};

// Start proses nya
start();
