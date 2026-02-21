const fs = require('fs');
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;

function compareImages(baselinePath, currentPath, diffPath) {

    const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
    const current = PNG.sync.read(fs.readFileSync(currentPath));

    const { width, height } = baseline;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(
        baseline.data,
        current.data,
        diff.data,
        width,
        height,
        { threshold: 0.1 }
    );

    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    return numDiffPixels;
}

module.exports = { compareImages };