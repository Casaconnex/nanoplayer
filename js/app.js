var music;
var songs = [];

$(document).ready(function () {
    $('.tooltipped').tooltip({ delay: 50 });
    $(".button-collapse").sideNav({
        menuWidth: 300, // Default is 300
        edge: 'right', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true // Choose whether you can drag to open on touch screens
    });
    initPlayer();
    $('#cloud_generate_playlist').hide();

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
        $('#cover').attr("src", "img/vinil.png");
        $('#current_song').html("");
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

function loadPlayList() {
    var fileToLoad = document.getElementById("pl_upload").files[0];

    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        console.log(textFromFileLoaded);
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}

function genList(music) {
    console.log('called');
    $.each(music, function (i, song) {
        if(song.image === null)
            song.image = 'img/vinil.png';
        $("#playlist").append('<a class="collection-item"><img style="width: 50px; height: 50px" src="' + song.image + '"></img>' + song.name + '<i><img id="' + i + '" src="img/play.png" align="right"></img></i></a>');
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
        var songName = music[selectedSong].name;
        var titleSong = document.createTextNode(songName);
        $('#cover').attr('src', music[selectedSong].image);
        $('#current_song').html(titleSong);
        notifyUser(songName);
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