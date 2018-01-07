var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
  + ' <td class="song-item-number" data-song-number ="' + songNumber + '">' + songNumber + '</td>'
  + ' <td class="song-item-title">' + songName + '</td>'
  + ' <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>';

  var $row = $(template);

  var clickHandler = function() {
    var songNumber = parseInt($(this).attr("data-song-number"));

    if(currentlyPlayingSongNumber !== null){
      //Revert to song number for currently playing song because user started new song
      var currentlyPlayingSongElement = parseInt($('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]'));
      currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
    }
    if(currentlyPlayingSongNumber !== songNumber){
      // Switch from PLay -> Pause button to indicate new song is playing
      $(this).html(pauseButtonTemplate);
      currentlyPlayingSongNumber = songNumber;
      currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
      updatePlayerBarSong();
    } else if(currentlyPlayingSongNumber === songNumber){
      //Switch from Pause -> Play button to pause currently playing song.
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
    }
  };

  var onHover = function(event) {
    var songNumberCol = $(this).find(".song-item-number");
    var songNumber = parseInt(songNumberCol.attr("data-song-number"));

    if(songNumber !== currentlyPlayingSongNumber){
      songNumberCol.html(playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var songNumberCol = $(this).find(".song-item-number");
    var songNumber = parseInt(songNumberCol.attr("data-song-number"));

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

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var nextSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex++;

  if(currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  var lastSongNumber = currentlyPlayingSongNumber;

  currentlyPlayingSongNumber = currentSongIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  updatePlayerBarSong();

  var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex--;

  if(currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }

  var lastSongNumber = currentlyPlayingSongNumber;

  currentlyPlayingSongNumber = currentSongIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  updatePlayerBarSong();

  $('.main-controls .play-pause').html(playerBarPauseButton);

  var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
//store state of playing songs
var currentAlbum = null; //store current album info
var currentlyPlayingSongNumber = null; //stores current song number
var currentSongFromAlbum = null; //stores currently playing song object from the songs array in fixtures.js

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso); //is this where the album function is now being told to use the albumPicasso object for the fuction(album) code?
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});
