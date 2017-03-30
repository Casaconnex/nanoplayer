$(document).ready(function () {
    initPlayer();
    getSongs();
});
var audio = document.getElementById('player');
var music;

function initPlayer() {
    $('#shuffle').click(function () {
        $("#playlist").empty();
        music.songs =  shuffle(music.songs);
        genList(music);
        playSong(0);
    });
}

function getSongs() {
    $.getJSON("/js/app.json", function (result) {
        music = result;
        genList(music);
    });
}

function genList(music) {
    $.each(music.songs, function (i, song) {
        $("#playlist").append('<li class="list-group-item" id="' + i + '">' + song.name + '</li>');
    });
    $('#playlist li').click(function () {
        var selectedSong = $(this).attr('id');
        playSong(selectedSong);
    });
}

function playSong(selectedSong) {
    var long = music.songs;
    if (selectedSong >= long.length) {
        audio.pause();
    } else {
        $('#player').attr('src', music.songs[selectedSong].song);
        audio.play();
        scheduleSong(selectedSong);
    }

}

function scheduleSong(id) {
    audio.onended = function () {
        playSong(parseInt(id) + 1);

    }
}

function shuffle(array) {    
    for (var random, temp, position = array.length; position; random = Math.floor(Math.random() * position), temp = array[--position], array[position] = array[random], array[random] = temp);
    return array;
}