document.addEventListener("DOMContentLoaded", function () {
  var musicDiv = document.createElement("div");
  musicDiv.id = "music";
  document.getElementById("musics").appendChild(musicDiv);
 // code moi-même
  fetch("public/js/data.json")
    .then((response) => response.json())
    .then((data) => {
      data.musics.forEach((music) => {
        let musicDivHeader = document.createElement("div");
        musicDivHeader.className = "music-header";
        musicDivHeader.classList.add("box");
        musicDiv.appendChild(musicDivHeader);
        let title = document.createElement("h1");
        title.innerHTML = music.name;
        musicDivHeader.appendChild(title);

        let artistsAndDate = document.createElement("h2");
        artistsAndDate.innerHTML = music.artists;
        artistsAndDate.innerHTML += " - " + music.year;
        musicDivHeader.appendChild(artistsAndDate);

        let linkToPlatformDiv = document.createElement("div");
        linkToPlatformDiv.className = "link-to-platform";
        linkToPlatformDiv.style.display = "flex";
        musicDivHeader.appendChild(linkToPlatformDiv);

        let linkToPlatform = document.createElement("a");
        linkToPlatform.className = "link-to-platform";
        linkToPlatform.href = music.link;
        linkToPlatform.setAttribute("aria-label", `Ecouter sur Apple Music`);
        linkToPlatform.target = "_blank";
        linkToPlatform.innerHTML = `<img src="${music.platform}" alt="${music.platform}">`;
        linkToPlatformDiv.appendChild(linkToPlatform);

        let linkToPlatform2 = document.createElement("a");
        linkToPlatform2.className = "link-to-platform";
        linkToPlatform2.href = music.link2;
        linkToPlatform2.setAttribute("aria-label", `Ecouter sur Spotify`);
        linkToPlatform2.target = "_blank";
        linkToPlatform2.innerHTML = `<img src="${music.platform2}" alt="${music.platform2}">`;
        linkToPlatformDiv.appendChild(linkToPlatform2);

        let coverDiv = document.createElement("div");
        coverDiv.className = "cover";
        musicDivHeader.appendChild(coverDiv);
        let cover = document.createElement("img");
        cover.alt = music.name;
        cover.src = music.cover;
        coverDiv.appendChild(cover);

        let lyricsDiv = document.createElement("div");
        lyricsDiv.className = "lyrics";
        lyricsDiv.style.display = "none";
        musicDivHeader.appendChild(lyricsDiv);

        let controls = document.createElement("div");
        controls.className = "controls";
        musicDivHeader.appendChild(controls);

        let audioPlayer = document.createElement("audio");
        audioPlayer.className = `audio-player`;
        audioPlayer.src = music.audio;
        audioPlayer.preload = "auto";
        controls.appendChild(audioPlayer);

        let playButton = document.createElement("button");
        playButton.className = `play-button`;
        playButton.ariaLabel = "Lecture/Pause";
        playButton.innerHTML = `<i class="fa-solid fa-play fa-2xl"></i>`;
        controls.appendChild(playButton);

        let timeInfo = document.createElement("p");
        timeInfo.className = `time-info`;
        timeInfo.innerHTML = "-00:00";
        controls.appendChild(timeInfo);
        timeInfo.style.padding = "10px";

        let timeContainer = document.createElement("div");
        timeContainer.className = "time-container";
        controls.appendChild(timeContainer);

        let timeBar = document.createElement("div");
        timeBar.className = "time-bar";
        timeContainer.appendChild(timeBar);

        let volumeIcon = document.createElement("i");
        volumeIcon.className = "fas fa-volume-off fa-2xl volume-icon";
        controls.appendChild(volumeIcon);

        let volumeContainer = document.createElement("div");
        volumeContainer.className = "volume-container";
        controls.appendChild(volumeContainer);

        let volumeBar = document.createElement("div");
        volumeBar.className = "volume-bar";
        volumeContainer.appendChild(volumeBar);

        let lyricsButton = document.createElement("button");
        lyricsButton.className = `lyrics-button`;
        lyricsButton.innerHTML = `<i class="fas fa-comment-dots fa-2xl"></i>`;
        lyricsButton.ariaLabel = "Paroles";
        controls.appendChild(lyricsButton);

        let toursPerMinute = document.createElement("button");
        toursPerMinute.className = `tours-per-minute`;
        toursPerMinute.innerHTML = "45trs";
        toursPerMinute.style.padding = "0 20px";
        toursPerMinute.style.fontSize = "1.1rem";
        toursPerMinute.ariaLabel = "Vitesse de lecture";
        controls.appendChild(toursPerMinute);

        let descriptionContainer = document.createElement("div");
        descriptionContainer.className = "box description-container";
        musicDiv.appendChild(descriptionContainer);

        let descriptionTitle = document.createElement("h1");
        descriptionTitle.innerHTML = `Pourquoi <span>${music.name}</span>? `;
        descriptionContainer.appendChild(descriptionTitle);

        let description = document.createElement("p");
        description.innerHTML = music.description;
        descriptionContainer.appendChild(description);

        playButton.addEventListener("click", () => {
          if (audioPlayer.paused) {
            audioPlayer
              .play()
              .then(() => {
                playButton.innerHTML = `<i class="fa-solid fa-pause fa-2xl"></i>`;
                cover.classList.add("rotate");
              })
              .catch((error) => {
                console.error("Erreur de lecture :", error);
              });
          } else {
            audioPlayer.pause();
            playButton.innerHTML = `<i class="fa-solid fa-play fa-2xl"></i>`;
            cover.classList.remove("rotate");
          }
        });
        audioPlayer.addEventListener("ended", () => {
          cover.classList.remove("rotate");
          playButton.innerHTML = `<i class="fa-solid fa-play fa-2xl"></i>`;
        });
        // code avec l'aide d'un ami
        function loadLyrics(lyricsFile, lyricsDiv, audioPlayer) {
          fetch(lyricsFile)
            .then((response) => response.text())
            .then((data) => {
              const lines = data.split("\n");
              const lyrics = [];

              lines.forEach((line) => {
                const match = line.match(/\[(\d+):(\d+\.\d+)](.+)/);
                if (match) {
                  const minutes = parseInt(match[1]);
                  const seconds = parseFloat(match[2]);
                  const time = minutes * 60 + seconds;
                  lyrics.push({ time, text: match[3] });
                }
              });

              lyricsDiv.innerHTML = "";

              lyrics.forEach(({ text }) => {
                const lineElement = document.createElement("p");
                lineElement.textContent = text;
                lineElement.className = "lyrics-line";
                lyricsDiv.appendChild(lineElement);
              });

              audioPlayer.addEventListener("timeupdate", () => {
                const currentTime = audioPlayer.currentTime;

                lyrics.forEach(({ time }, index) => {
                  const lineElement = lyricsDiv.children[index];

                  if (
                    currentTime >= time &&
                    (!lyrics[index + 1] || currentTime < lyrics[index + 1].time)
                  ) {
                    if (!lineElement.classList.contains("highlight")) {
                      Array.from(lyricsDiv.children).forEach((child) =>
                        child.classList.remove("highlight")
                      );
                      lineElement.classList.add("highlight");

                      if (lyricsDiv.scrollHeight > 300) {
                        lyricsDiv.scrollTop =
                          lineElement.offsetTop - lyricsDiv.offsetTop;
                      }
                    }
                  }
                });
              });
            })
            .catch((error) =>
              console.error("Erreur lors du chargement des paroles :", error)
            );
        }

        lyricsButton.addEventListener("click", () => {
          if (lyricsDiv.style.display === "none") {
            lyricsDiv.style.display = "block";
            coverDiv.classList.add("go-out");
            lyricsDiv.classList.add("go-out");
            coverDiv.style.display = "none";
            cover.classList.remove("rotate");

            if (!lyricsDiv.hasChildNodes()) {
              loadLyrics(music.lyrcis, lyricsDiv, audioPlayer);
            }
          } else {
            lyricsDiv.style.display = "none";
            coverDiv.style.display = "block";
            lyricsDiv.classList.add("go-out");
            coverDiv.classList.add("go-out");

            if (
              audioPlayer.currentTime < audioPlayer.duration &&
              !audioPlayer.paused
            ) {
              cover.classList.add("rotate");
            } else {
              cover.classList.remove("rotate");
            }
          }
        });
        // code moi-même
        toursPerMinute.addEventListener("click", () => {
          if (toursPerMinute.innerHTML === "33trs") {
            toursPerMinute.innerHTML = "45trs";
            audioPlayer.playbackRate = 1.0;
            document.querySelectorAll(".rotate").forEach((element) => {
              element.style.animationDuration = "1.8s";
            });
          } else {
            toursPerMinute.innerHTML = "33trs";
            audioPlayer.playbackRate = 1.36;
            document.querySelectorAll(".rotate").forEach((element) => {
              element.style.animationDuration = "1.33s";
            });
          }
        });

        function updateTimeInfo() {
          const currentTime = audioPlayer.currentTime;
          const duration = audioPlayer.duration;
          const remainingTime = duration - currentTime;

          const minutes = Math.floor(remainingTime / 60);
          const seconds = Math.floor(remainingTime % 60)
            .toString()
            .padStart(2, "0");

          timeInfo.textContent = `${minutes}:${seconds}`;
        }

        volumeContainer.addEventListener("click", (event) => {
          const containerWidth = volumeContainer.offsetWidth;
          const clickPosition = event.offsetX;
          const volumeLevel = clickPosition / containerWidth;

          volumeBar.style.width = `${volumeLevel * 100}%`;
          audioPlayer.volume = volumeLevel;

          console.log(`Volume ajusté à : ${Math.round(volumeLevel * 100)}%`);
        });

        function updateProgressBar() {
          const currentTime = audioPlayer.currentTime;
          const duration = audioPlayer.duration;

          timeBar.style.width = `${(currentTime / duration) * 100}%`;
        }

        audioPlayer.addEventListener("timeupdate", updateTimeInfo);
        audioPlayer.addEventListener("timeupdate", updateProgressBar);

        timeContainer.addEventListener("click", (event) => {
          const containerWidth = timeContainer.offsetWidth;
          const clickPosition = event.offsetX;
          const time = (clickPosition / containerWidth) * audioPlayer.duration;

          audioPlayer.currentTime = time;
          timeBar.style.width = `${(time / audioPlayer.duration) * 100}%`;
        });
      });
      //code moi-même
      const titreInput = document.getElementById("titre");
      const descriptionInput = document.getElementById("descriptionMusique");
      const musicByUser = document.getElementById("music-by-user");
      const artistInput = document.getElementById("artiste");
      const yearInput = document.getElementById("annee");
      const linkInput = document.getElementById("lien");

      const sixthMusicHeader = document.createElement("div");
      sixthMusicHeader.className = "music-header";
      sixthMusicHeader.classList.add("box");
      musicByUser.appendChild(sixthMusicHeader);

      const sixthTitle = document.createElement("h1");
      sixthMusicHeader.appendChild(sixthTitle);

      const sixthArtist = document.createElement("h2");
      sixthMusicHeader.appendChild(sixthArtist);

      const sixthYear = document.createElement("h2");
      sixthMusicHeader.appendChild(sixthYear);

      const linkToPlatform = document.createElement("a");
      linkToPlatform.className = "link-to-platform";
      linkToPlatform.target = "_blank";
      linkToPlatform.style.fontFamily = "Arial";
      linkToPlatform.style.padding = "10px";
      sixthMusicHeader.appendChild(linkToPlatform);
      
      const sixthCover = document.createElement("img");
      sixthCover.className = "sixthCover";
      sixthMusicHeader.appendChild(sixthCover);

      const sixthDescriptionContainer = document.createElement("div");
      sixthDescriptionContainer.className = "description-container";
      musicByUser.appendChild(sixthDescriptionContainer);

      const sixthDescription = document.createElement("p");
      sixthDescriptionContainer.className = "sixth-description-container";
      sixthDescription.style.textAlign = "center";
      sixthDescription.style.padding = "0 80px";
      sixthDescription.style.maxWidth = "800px";
      sixthDescriptionContainer.appendChild(sixthDescription);

      titreInput.addEventListener("keyup", (event) => {
        const key = event.key;
        console.log(`Touche relâchée: ${key}`);
        sixthTitle.innerHTML = titreInput.value;
      });

      descriptionInput.addEventListener("keyup", (event) => {
        const key = event.key;
        console.log(`Touche relâchée: ${key}`);
        sixthDescription.innerHTML = descriptionInput.value;
      });

      artistInput.addEventListener("keyup", (event) => {
        const key = event.key;
        console.log(`Touche relâchée: ${key}`);
        sixthArtist.innerHTML = artistInput.value;
      });

      yearInput.addEventListener("keyup", (event) => {
        const key = event.key;
        console.log(`Touche relâchée: ${key}`);
        if (yearInput.value.length > 4) {
          yearInput.value = yearInput.value.slice(0, 4);
        }
        sixthYear.innerHTML = yearInput.value;
      });

      linkInput.addEventListener("keyup", (event) => {
        const key = event.key;
        console.log(`Touche relâchée: ${key}`);
        linkToPlatform.href = linkInput.value;
        linkToPlatform.innerHTML = linkInput.value;
      });
      const imageInput = document.getElementById("imageUpload");

      imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            sixthCover.src = e.target.result;
            sixthCover.style.width = "376px";
            sixthCover.style.borderRadius = "20px";
            sixthCover.style.margin = "0 auto";
            sixthCover.style.display = "block";
          };
          reader.readAsDataURL(file);
        }
      });

      const submitButton = document.getElementById("submitButton");

      submitButton.addEventListener("click", (event) => {
        event.preventDefault();

        const titre = titreInput.value;
        const description = descriptionInput.value;
        const artiste = artistInput.value;
        const annee = yearInput.value;
        const linkForm = linkInput.value;
        const login = "viktorovitch";
        const email = "romain.viktorovitch@edu.univ-eiffel.fr";

        const smallTitle = document.getElementById("small-title");
        const smallDescription = document.getElementById("small-desc");
        const smallArtist = document.getElementById("small-artist");
        const smallYear = document.getElementById("small-year");
        const smallLink = document.getElementById("small-link");

        if (!titre || !description || !artiste || !annee || !linkForm) {
          alert("Veuillez remplir tous les champs avant de soumettre.");
          if (!titre) {
            titreInput.style.border = "2px solid red";
            smallTitle.style.visibility = "visible";
            smallTitle.style.display = "block";
          } else {
            titreInput.style.border = "2px solid green";
          }

          if (!description) {
            descriptionInput.style.border = "2px solid red";
            smallDescription.style.visibility = "visible";
            smallDescription.style.display = "block";
          } else {
            descriptionInput.style.border = "2px solid green";
          }

          if (!artiste) {
            artistInput.style.border = "2px solid red";
            smallArtist.style.visibility = "visible";
            smallArtist.style.display = "block";
          } else {
            artistInput.style.border = "2px solid green";
          }

          if (!annee) {
            yearInput.style.border = "2px solid red";
            smallYear.style.visibility = "visible";
            smallYear.style.display = "block";
          } else {
            yearInput.style.border = "2px solid green";
          }
          
          if (!linkForm) {
            linkInput.style.border = "2px solid red";
            smallLink.style.visibility = "visible";
            smallLink.style.display = "block";
          } else {
            linkInput.style.border = "2px solid green";
          }
          return;
        }
        const apiUrl = `https://perso-etudiant.u-pem.fr/~gambette/portrait/api.php?format=json&login=${encodeURIComponent(
          login
        )}&courriel=${encodeURIComponent(email)}&message=${encodeURIComponent(
          `Titre: ${titre}, Artiste: ${artiste}, Année: ${annee}, Description: ${description}, Lien: ${linkForm}`
        )}`;

        console.log("données:", titre, artiste, annee, description, linkForm);
        console.log("URL appelée :", apiUrl);

        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            console.log("Réponse reçue :", data);
            alert("Données envoyées avec succès !");
          })
          .catch((error) => {
            console.error("Erreur :", error);
            alert("Une erreur est survenue lors de l'envoi des données.");
          });
      });
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération des musiques:", error)
    );
});