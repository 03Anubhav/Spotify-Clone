let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
  // Ensure seconds is rounded to the nearest whole number
  seconds = Math.floor(seconds);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format minutes and seconds with leading zeros
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  // console.log(as);
  songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  //Display all the songs
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";

  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li data-track="${song}"><img class="invert" src="music.svg" alt="">
    <div class="info">
    <div>${
      song
        .replaceAll("%20", " ")
        .replaceAll("128-", " ")
        .replaceAll("128 Kbps.mp3", " ")
        .replaceAll(".mp3", " ")
        .split(" - ")[0]
    }</div>
    <div>Diljit</div>
    </div>
    <div class="playNow">
    <span>Play Now</span>
    <img src="play.svg" class="invert" alt="">
    </div>
    </li>`;
  }

  //Attach an Event Listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      const track = e.getAttribute("data-track");
      console.log("Playing track:" + track);

      playMusic(track, false);
      play.src = "pause.svg";
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;

  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }

  document.querySelector(".songInfo").innerHTML = track
    .replaceAll("%20", " ")
    .replaceAll("128-", " ")
    .replaceAll("128 Kbps.mp3", " ")
    .replaceAll(".mp3", " ")
    .split(" - ")[0];
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");

  Array.from(anchors).forEach(async (e) => {
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-2)[1];

      //Get the metadata of the folder
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);
      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="fresh" class="card">
              <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
                  <!-- Green Circle Background -->
                  <circle cx="12" cy="12" r="12" fill="green" />
                  <!-- Play Button (Black Triangle) -->
                  <path d="M7.75194 5.43872L18.2596 11.5682C18.4981 11.7073 18.5787 12.0135 18.4396 12.252C18.3961 12.3265 18.3341 12.3885 18.2596 12.432L7.75194 18.5615C7.51341 18.7006 7.20725 18.62 7.06811 18.3815C7.0235 18.305 7 18.2181 7 18.1296V5.87061C7 5.59446 7.22386 5.37061 7.5 5.37061C7.58853 5.37061 7.67547 5.39411 7.75194 5.43872Z" fill="black"/>
                </svg>
              </div>
              
              <!-- <img src="" alt=""> -->
              <img src="/songs/${folder}/cover.jpg">
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`

    }
  });
}

async function main() {
  //Get all the songs
  songs = await getSongs("songs/fresh");
  playMusic(songs[2], true);
  // console.log(songs);

  //Display Albums
  displayAlbums();

  //Attach the Event Listener to the songButtons --> previous, play and next
  const play = document.getElementById("play");
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  //Listen for TimeUpdate Event
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime + ":" + currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${formatTime(
      currentSong.currentTime
    )} / ${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Add event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // console.log(e.target.getBoundingClientRect());

    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Add event Listener to hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //Add event Listener to close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-130%";
  });

  //Add event listener to previous button
  previous.addEventListener("click", () => {
    currentSong.pause;
    console.log("Previous Played");
    let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
    // console.log(songs, index, length);

    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  //Add event listener to next button
  next.addEventListener("click", () => {
    currentSong.pause;
    let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
    // console.log(songs, index, length);

    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //Add event Listener to range
  document.querySelector(".range").addEventListener("change", (e) => {
    console.log("Setting Volume to ", e.target.value, " / 100");
    currentSong.volume = parseInt(e.target.value) / 100;
  });

  //Load the playlist when card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      console.log(item.currentTarget.dataset.folder);
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}

main();
