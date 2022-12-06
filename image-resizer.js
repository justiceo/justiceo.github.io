const Jimp = require("jimp");
const fs = require("fs");

const outputSizes = [128, 256, 502];

const resize = (image, pathTemplate, size) => {
  // Generate color image for given size.
  const colorImagePath = pathTemplate.replace(
    "%qualifier%",
    `-${size}x${size}`
  );
  const colorImage = image.clone();
  colorImage.resize(size, size).write(colorImagePath);
  console.log("Generated ", colorImagePath);

  // Generate gray version of same image.
  const grayImagePath = pathTemplate.replace(
    "%qualifier%",
    `-gray-${size}x${size}`
  );
  const grayImage = image.clone();
  grayImage.resize(size, size).greyscale().write(grayImagePath);
  console.log("Generated ", grayImagePath);
};

const generateIcons = (imageDir) => {
  if (!imageDir) {
    console.error(
      "Please specify original image path and destination template"
    );
    return;
  }

  fs.readdir(imageDir, (error, fileNames) => {
    if (error) {
      console.error("Error reading directory", error);
    }

    fileNames.forEach((origImagePath) => {
        const destTemplate = imageDir.replace("images", "images/generated") + origImagePath.replace(".JPG", "%qualifier%.jpg");
        Jimp.read(imageDir + origImagePath, (err, image) => {
            if (err) {
              console.error(`Error reading '${origImagePath}': ${err}`);
              return;
            }
        
            outputSizes.forEach((size) => {
              resize(image, destTemplate, size);
            });
          });
    });
  });


};

generateIcons("images/portraits/");
