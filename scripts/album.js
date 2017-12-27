var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
  + ' <td class="song-item-number" data-song-number ="' + songNumber + '">' + songNumber + '</td>'
  + ' <td class="song-item-title">' + songName + '</td>'
  + ' <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>';

  var $row = $(template);

  var clickHandler = function() {
    var songNumber = $(this).attr("data-song-number");

    if(currentlyPlayingSongNumber !== null){
      //Revert to song number for currently playing song because user started new song
      var currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
      currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
    }
    if(currentlyPlayingSongNumber !== songNumber){
      // Switch from PLay -> Pause button to indicate new song is playing
      $(this).html(pauseButtonTemplate);
      currentlyPlayingSongNumber = songNumber;
      currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    } else if(currentlyPlayingSongNumber === songNumber){
      //Switch from Pause -> Play button to pause currently playing song.
        $(this).html(playButtonTemplate);
        currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
    }
  };

  var onHover = function(event) {
    var songNumberCol = $(this).find(".song-item-number");
    var songNumber = songNumberCol.attr("data-song-number");

    if(songNumber !== currentlyPlayingSongNumber){
      songNumberCol.html(playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var songNumberCol = $(this).find(".song-item-number");
    var songNumber = songNumberCol.attr("data-song-number");

    if(songNumber !== currentlyPlayingSongNumber){
      songNumberCol.html(songNumber);
    }
  };

  $row.find(".song-item-number").click(clickHandler);
  $row.hover(onHover, offHover);

  return $row;
};

var setCurrentAlbum = function(album) {

  currentAlbum = album;
  var $albumTitle = $(".album-view-title");
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);  //sets album title to object.title
  $albumArtist.text(album.artist);  //sets artist to object.artist
  $albumReleaseInfo.text(album.year + ' ' + album.label);  //sets release info to object.year and object.label
  $albumImage.attr('src', album.albumArtUrl);  //sets album image to URL provided in object.albumArtUrl

  $albumSongList.empty(); //clears current song data to provide a clean slate

  for (var i = 0; i < album.songs.length; i++) { //where is it finding the ".songs" if we didn't call an object? (same question with above code)
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    //calls the createSongRow variable (function) and creates a row for each song title and duration
    $albumSongList.append($newRow);
  }
};

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
//store state of playing songs
var currentAlbum = null; //store current album info
var currentlyPlayingSongNumber = null; //stores current song number
var currentSongFromAlbum = null; //stores currently playing song object from the songs array in fixtures.js

$(document).ready(function() {
  setCurrentAlbum(albumPicasso); //is this where the album function is now being told to use the albumPicasso object for the fuction(album) code?
});
