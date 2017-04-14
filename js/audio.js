function CreateSeekBar() {
  var seekbar = document.getElementById("audioSeekBar");
  seekbar.min = 0;
  seekbar.max = player.duration;
  seekbar.value = 0;  
}

function audioSeekBar() {
  var seekbar = document.getElementById("audioSeekBar");
  player.currentTime = seekbar.value;
}

function SeekBar() {
  var seekbar = document.getElementById("audioSeekBar");
  seekbar.value = player.currentTime;
}

