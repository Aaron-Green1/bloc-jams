//Example Album object
var albumPicasso = {
  title: "The Colors",
  artist: "Pablo Picasso",
  label: "Cubism",
  year: "1881",
  albumArtUrl: "assets/images/album_covers/01.png",
  songs: [
      { title: "Blue", duration: "4:26" },
      { title: "Green", duration: "3:14" },
      { title: "Red", duration: "5:01" },
      { title: "Pink", duration: "3:21" },
      {title: "Magenta", duration: "2:15" },
  ]
};

//Example Album 2
var albumMarconi = {
  title: "The Telephone",
  artist: "Guglielmo Macroni",
  label: "EM",
  year: "1909",
  albumArtUrl: "assets/images/album_covers/20.png",
  songs: [
      { title: "Hello, Operator?", duration: "1:01" },
      { title: "Ring, ring, ring", duration: "5:01" },
      { title: "Fits in your pocket", duration: "3:21" },
      { title: "Can you hear me now?", duration: "3:14" },
      { title: "Wrong phone number", duration: "2:15" }, //Did they have phones in 1909?!!?
  ]
};

var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
  + ' <td class="song-item-number" data-song-number ="' + songNumber + '">' + songNumber + '</td>'
  + ' <td class="song-item-title">' + songName + '</td>'
  + ' <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>';

  return template;
};

var setCurrentAlbum = function(album) {

  var albumTitle = document.getElementsByClassName('album-view-title')[0];
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

  albumTitle.firstChild.nodeValue = album.title;  //sets album title to object.title
  albumArtist.firstChild.nodeValue = album.artist;  //sets artist to object.artist
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;  //sets release info to object.year and object.label
  albumImage.setAttribute('src', album.albumArtUrl);  //sets album image to URL provided in object.albumArtUrl

  albumSongList.innerHTML = ' '; //clears current song data to provide a clean slate

  for (var i = 0; i < album.songs.length; i++) { //where is it finding the ".songs" if we didn't call an object? (same question with above code)
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    //calls the createSongRow variable (function) and creates a row for each song title and duration
  }
};

var findParentByClassName = function(domElement, target) {

  if(domElement) {
    var currentEle = domElement.parentElement;
    while(currentEle.className !== target && currentEle.className !== null) {
      currentEle = currentEle.parentElement;
    }
    return currentEle;
  }
};

var getSongItem = function(songEle) {

  switch(songEle.className) {
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
      return findParentByClassName(songEle, 'song-item-number');

    case 'album-view-song-item':
      return songEle.querySelector('.song-item-number');

    case 'song-item-title':
    case 'song-item-duration':
      return findParentByClassName(songEle, 'album-view-song-name').querySelector('.song-item-number');
    case 'song-item-number':
      return songEle;
    default:
      return;
  }
};

var songListContainer = document.getElementsByClassName("album-view-song-list")[0];
var songRows = document.getElementsByClassName("album-view-song-item");

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

window.onload = function() {
  setCurrentAlbum(albumPicasso); //is this where the album function is now being told to use the albumPicasso object for the fuction(album) code?

  songListContainer.addEventListener("mouseover", function(event) {
    if (event.target.parentElement.className === "album-view-song-item") {
      event.target.parentElement.querySelector(".song-item-number").innerHTML = playButtonTemplate; //does querySelector use the "." before each class unlike getElementsByClassName??
    }
  });

  for (var i = 0; i < songRows.length; i++){
    songRows[i].addEventListener("mouseleave", function(event) {
      //selects first child element which is the song-item-number element
      this.children[0].innerHTML = this.children[0].getAttribute("data-song-number");
    });
  }
};
