var music;
var songs = [];
var listMp3FromCloud = [];

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
function handleGenPlaylist()
{
    genList(music);
    playSong(0);
}

function handleFileFromCloud(evt) {
    $('#cloud_generate_playlist').hide();
    var url = $("#music_cloud_url").val();
    $.ajax({
        url: url,
        headers: {"Access-Control-Allow-Origin": "*"},
        success: function (data) {
            var pos = 0;
            songs = [];
            listMp3FromCloud = [];
            $(data).find("a:contains(.mp3)").each(function () {
                listMp3FromCloud.push(decodeURI(url + $(this).attr("href")));
            });
            console.log(listMp3FromCloud);
        },
        error: function (request, error) {
            console.log(error);
        }
    }).done(function () {
        console.log('done call ajax');
        getTagInfo();
        $('#cloud_generate_playlist').show();         
    });
}

function getTagInfo() {
    $.each(listMp3FromCloud, function (index, item) {
        console.log(index);
        //getSongData(index, item);
        getSongTags(index, item);
    });

    $("#playlist").empty();
    music = songs;
    //$('#cloud_generate_playlist').click();    
    genList(music);
    console.log(music);
}

function getSongTags(pos, url) {

    ID3.loadTags(url, function () {
        showTags(pos, url);
    }, {
            tags: ["title", "artist", "album", "picture"]
        });
}

function showTags(pos, url) {
    var tags = ID3.getAllTags(url);
    console.log(tags);
    var obj = {};
    if (tags) {
        obj["id"] = pos;
        obj["name"] = tags.title || '';
        obj["song"] = url;
        obj["artist"] = tags.artist || '';
        obj["album"] = tags.album || '';        
    }
    

    var image = tags.picture;
    if (image) {
        var base64String = "";
        for (var i = 0; i < image.data.length; i++) {
            base64String += String.fromCharCode(image.data[i]);
        }
        var base64 = "data:" + image.format + ";base64," +
            window.btoa(base64String);
        obj["image"] = base64;
    } else {
        obj["image"] = null;
    }
    songs.push(obj);
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
        $("#playlist").append('<a class="collection-item">' + song.name + '<i><img id="' + i + '" src="img/play.png" align="right"></img></i></a>');
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