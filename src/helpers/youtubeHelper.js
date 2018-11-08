import loadScriptOnce from 'load-script-once';
const makePlayIdStack = [];
const playerInstances = {};
const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?$/;
let loadLib = false;
let uid = 0;

function onYouTubeIframeAPIReady() {
  /* global YT:true */
  loadLib = true;
  makePlayIdStack.forEach(youtubeInfo => {
    addPlayer(youtubeInfo);
  });
}

function addPlayer(youtubeInfo) {
  const {element, key, id, loop, autoplay, cb = () => {}} = youtubeInfo;
  if (loadLib) {
    const player = new YT.Player(element, {
      height: '100%',
      width: '100%',
      videoId: id,
      playerVars: {
        controls: 0,
        disablekb: 1,
        loop: loop,
        autoplay: autoplay
      },
      events: {
        onReady: () => {
          cb();
        },
        onStateChange: () => {}
      }
    });

    playerInstances[key] = player;
  } else {
    makePlayIdStack.push(youtubeInfo);
  }
}

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

loadScriptOnce(`//www.youtube.com/iframe_api`, err => {
  if (err) {
    console.error(err);
  }
});

export default {
  addPlayer,
  playerInstances,
  getYoutubeThumbnail: id => {
    return `https://img.youtube.com/vi/${id}/sddefault.jpg`;
  },
  isYoutubeUrl: url => {
    return !!url.match(regExp);
  },
  getYoutubeId: url => {
    return url.match(regExp)[1];
  },
  makeVideoUid: () => {
    uid = uid + 1;

    return uid;
  }
};
