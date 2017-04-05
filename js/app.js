//var audio = document.getElementById('player');
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


});

function handleFileFromCloud(evt) {
    var url = $("#music_cloud_url").val();
    $.ajax({        
        url: url,
        success: function (data) {
            $(data).find("a:contains(.mp3)").each(function () {
                if (songs === null)
                    songs = [];

                songs.push({
                    id: $(this).position(),
                    name: decodeURI($(this).attr("href")),
                    song: decodeURI(url + $(this).attr("href"))
                });                
            });

            music = songs;
            $("#playlist").empty();
            genList(music);
        },
        error: function (request, error) {
            console.log(error);
        }
    });
}

function handleFileUpload(evt) {
    var fileToLoad = evt.target.files[0];
    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        music = JSON.parse(textFromFileLoaded);
        $("#playlist").empty();
        genList(music);
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    if (songs === null)
        songs = [];
    // files is a FileList of File objects. List some properties.           
    for (var i = 0, f; f = files[i]; i++) {
        if (f.type === "audio/mp3")
            songs.push({
                id: i,
                name: f.name,
                song: URL.createObjectURL(f)
            });
    }
    music = songs;
    $("#playlist").empty();
    genList(music);
}

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

function loadPlayList() {
    var fileToLoad = document.getElementById("pl_upload").files[0];

    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        console.log(textFromFileLoaded);
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
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