//var audio = document.getElementById('player');
var music;
var songs = [];

$(document).ready(function () {
    $('.tooltipped').tooltip({ delay: 50 });
    initPlayer();
});


function initPlayer() {
    $('#shuffle').click(function () {        
        $("#playlist").empty();
        music = shuffle(music);
        genList(music);
        playSong(0);
    });

    $('#playlist_clean').click(function () {
        $("#playlist").empty();
        player.pause();        
        player.src = '';
        music = null;
        songs = null;
    });

    $('#playlist_download').click(function () {
        if (songs.length > 0) {
            var jsonToSave = JSON.stringify(songs);
            var file = new Blob([jsonToSave], { type: 'text/plain' });
            var fileUrl = URL.createObjectURL(file);
            var downloadLink = document.createElement("a");
            downloadLink.download = "playlist.npl";
            downloadLink.innerHTML = "Download File";
            downloadLink.href = fileUrl;
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);

            downloadLink.click();
        }
    });
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

function getSongs() {
    $.getJSON("/js/app.json", function (result) {
        music = result;
        genList(music);
    });
}

function genList(music) {
    $.each(music, function (i, song) {
        $("#playlist").append('<a class="collection-item">' + song.name.substring(song.name.lastIndexOf('.'), 0) + '<i><img id="' + i + '" src="img/play.png" align="right"></img></i></a>');
    });
    $('#playlist img').click(function () {
        var selectedSong = $(this).attr('id');
        playSong(selectedSong);
    });
}

function playSong(selectedSong) {
    var long = music;
    if (selectedSong >= long.length) {
        player.pause();
    } else {
        $('#player').attr('src', music[selectedSong].song);
        player.play();
        notifyUser(music[selectedSong].name.substring(music[selectedSong].name.lastIndexOf('.'), 0));
        scheduleSong(selectedSong);
    }

}

function notifyUser(songName) {
    Push.create("NanoPlayer", {
        body: songName,
        icon: {
            x16: 'img/notif16x16.ico',
            x32: 'img/notif32x32.ico'
        },
        timeout: 4000,
        onClick: function () {
            window.focus();
            this.close();
        }
    });
}

function scheduleSong(id) {
    player.onended = function () {
        playSong(parseInt(id) + 1);

    }
}

function shuffle(array) {
    if (array.length > 0)
        for (var random, temp, position = array.length; position; random = Math.floor(Math.random() * position), temp = array[--position], array[position] = array[random], array[random] = temp);
    return array;
}