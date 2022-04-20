// Copied from COMP6080 22T1 Assignment 2

/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 *
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

// Converts Youtube URL to embedded verison
export const youtubeUrlEmbed = (url) => {
  const embed = url.indexOf('embed');
  if (embed > -1) return url;
  else {
    const watch = url.indexOf('watch?v=');
    if (watch > -1) return `https://www.youtube-nocookie.com/embed/${url.substring(watch + 8)}`;
    else {
      const short = url.indexOf('.be/');
      if (short > -1) return `https://www.youtube-nocookie.com/embed/${url.substring(short + 4)}`;
    }
  }
  return null;
}

// Generate unique question ID
const ids = [];
export const generateId = (n = 5) => {
  let id = Math.floor(Math.random() * Math.pow(10, n));
  while (ids.includes(id)) id = Math.floor(Math.random() * Math.pow(10, n));
  ids.push(id);
  return id;
}

// Format duration to string
export const formatDuration = (duration) => {
  const m = Math.floor(duration / 60);
  const s = duration % 60;
  if (m && s) return `${m}:${String(s).padStart(2, '0')} (min:sec)`;
  if (m) return `${m}:00 (min:sec)`;
  if (s) return `0:${String(s).padStart(2, '0')} (min:sec)`
  return '0:00 (min:sec)';
}
