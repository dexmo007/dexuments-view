import cv from 'opencv4nodejs';

export function loadImageAsBase64(f, imageHeight) {
  let image = cv.imread(f);
  const scalar = imageHeight / image.rows;
  image = image.resize(imageHeight, Math.round(image.cols * scalar));
  return cv.imencode('.jpg', image).toString('base64');
}

export function loadImageMarkFaceAsBase64(f, faceLocation, imageHeight) {
  let image = cv.imread(f);
  const scalar = imageHeight / image.rows;
  image = image.resize(imageHeight, Math.round(image.cols * scalar));
  image.drawRectangle(
    new cv.Point2(faceLocation.right * scalar, faceLocation.top * scalar),
    new cv.Point2(faceLocation.left * scalar, faceLocation.bottom * scalar),
    new cv.Vec3(0, 0, 255),
    2,
  );
  return cv.imencode('.jpg', image).toString('base64');
}
