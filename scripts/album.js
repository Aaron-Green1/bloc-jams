var setSong = function(songNumber) {
  if(currentSoundFile){
    currentSoundFile.stop();
  }

  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: [ 'mp3' ],
    preload: true
  });

  setVolume(currentVolume);
};

var seek = function(time) {
  if(currentSoundFile) {
    currentSoundFile.setTime(time);
  }
}

var setVolume = function(volume) {
  if(currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
  + ' <td class="song-item-number" data-song-number ="' + songNumber + '">' + songNumber + '</td>'
  + ' <td class="song-item-title">' + songName + '</td>'
  + ' <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
  + '</tr>';

  var $row = $(template);

  var clickHandler = function() {
    var songNumber = parseInt($(this).attr("data-song-number"));

    if(currentlyPlayingSongNumber !== null){
      //Revert to song number for currently playing song because user started new song
      var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
      currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
    }
    if(currentlyPlayingSongNumber !== songNumber){
      // Switch from PLay -> Pause button to indicate new song is playing
      $(this).html(pauseButtonTemplate);
      setSong(songNumber);
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
      updatePlayerBarSong();

      var $volumeFill = $('.volume .fill');
      var $volumeThumb = $('.volume .thumb');
      $volumeFill.width(currentVolume = '%');
      $volumeThumb.css({left: currentVolume = '%'});

    } else if(currentlyPlayingSongNumber === songNumber){
      //Switch from Pause -> Play button to pause currently playing song.
      if(currentSoundFile.isPaused()) {
          $(this).html(pauseButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPauseButton);
          currentSoundFile.play();
          updateSeekBarWhileSongPlays();
        }
      else {
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
    }
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

var updateSeekBarWhileSongPlays = function() {
  if(currentSoundFile) {
    currentSoundFile.bind('timeupdate', function(event) {
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');

      updateSeekPercentage($seekBar, seekBarFillRatio);
      setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
    });
  };
};

var filterTimeCode = function(timeInSeconds) {
  var totalTime = parseFloat(timeInSeconds);
  var minutes = Math.floor(totalTime / 60);
  var seconds = Math.floor(totalTime % 60);
  var final = minutes + ":"
  if(seconds < 10)
    {final += "0";}
  final += seconds;
  return final;
};

var setCurrentTimeInPlayerBar = function(currentTime) {
  $('.seek-control .current-time').text(currentTime);
};

var setTotalTimeInPlayerBar = function(totalTime) {
  $('.seek-control .total-time').text(totalTime);
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();

    var seekBarFillRatio = offsetX / barWidth;

    if($(this).parent().attr('class') == 'seek-control') {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    } else {
      setVolume(seekBarFillRatio * 100);
    }

    updateSeekPercentage($(this), seekBarFillRatio);
  });

  $seekBars.find('.thumb').mousedown(function(event) {
    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event) {
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      if ($seekBar.parent().attr('class') == 'seek-control') {
               seek(seekBarFillRatio * currentSoundFile.getDuration());
           } else {
               setVolume(seekBarFillRatio);
           }

      updateSeekPercentage($seekBar, seekBarFillRatio);
    });

    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
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

  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  updatePlayerBarSong();

  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

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

  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  updatePlayerBarSong();

  $('.main-controls .play-pause').html(playerBarPauseButton);

  var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

var togglePlayFromPlayerBar = function() {
  var currentlyPlayingSongCell = getSongNumberCell(currentlyPlayingSongNumber);

  /* after doing the if and else if statements below (lines 178 and 182), I noticed this only worked when a song was already playing
  if you tried to play a song from the bar when one hasn't been selected, you get an error that it can't read from null
  so, I attempted to add a "null case" to the code to auto play the first song, when clicked */

  if(currentSoundFile === null) {
    setSong(1);
    currentlyPlayingSongCell = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingSongCell.html(pauseButtonTemplate);
    $('main-controls .play-pause').html(playerBarPauseButton);
    updatePlayerBarSong();
    currentSoundFile.play();
  } else if(currentSoundFile.isPaused()) {
    currentlyPlayingSongCell.html(pauseButtonTemplate);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    currentSoundFile.play();
  } else if (currentSoundFile) {
    currentlyPlayingSongCell.html(playButtonTemplate);
    $('.main-controls .play-pause').html(playerBarPlayButton);
    currentSoundFile.pause();
  }
};

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
//store state of playing songs
var currentAlbum = null; //store current album info
var currentlyPlayingSongNumber = null; //stores current song number
var currentSongFromAlbum = null; //stores currently playing song object from the songs array in fixtures.js
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso); //is this where the album function is now being told to use the albumPicasso object for the fuction(album) code?
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $playPauseButton.click(togglePlayFromPlayerBar);
});
