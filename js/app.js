var music;
var songs = [];
var listMp3FromCloud = [];


$(document).ready(function () {
    $('.parallax').parallax();
    $('.tooltipped').tooltip({
        delay: 50
    });
    $(".button-collapse").sideNav({
        menuWidth: 300, // Default is 300
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true // Choose whether you can drag to open on touch screens
    });
    hideElementsOnPage();
    initPlayer();
});

function handleStartNP(){
    $('#parallax').hide();
    $('#toolbar').show();
    $('#paper-toolbar').show();
}

function hideElementsOnPage() {
    $('#audioSeekBar').hide();
    $('#label_volume').hide();
    $('#volume').hide();
    $('#cloud_generate_playlist').hide();
    $('#play').hide();
    $('#pause').hide();
    $('#previous_song').hide();
    $('#current_song').hide();
    $('#next_song').hide();
    $('#duration').hide();
    $('#total_duration').hide();
    $('#card_player').hide();
    $('#playlist').hide();
}

function showElementsOnPage() {
    $('#pause').show();
    $('#previous_song').show();
    $('#next_song').show();
    $('#audioSeekBar').show();
    $('#label_volume').show();
    $('#volume').show();
    $('#duration').show();
    $('#total_duration').show();
    $('#card_player').show();
    $('#playlist').show();
}


function handleFileFromCloud(evt) {
    $('#cloud_generate_playlist').hide();
    var url = $("#music_cloud_url").val();
    $.ajax({
        url: url,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
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

function initPlayer() {

    $('#play').click(function () {
        $('#play').hide();
        $('#pause').show();
        player.play();
    });

    $('#pause').click(function () {
        $('#play').show();
        $('#pause').hide();
        player.pause();
    });

    $('#shuffle').click(function () {
        $("#playlist").empty();
        music = shuffle(music);
        genList(music);
        $('#playlist a')[0].click();
        playSong(0);
    });

    $('#playlist_clean').click(function () {
        $("#playlist").empty();
        hideElementsOnPage();
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
            var file = new Blob([jsonToSave], {
                type: 'text/plain'
            });
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

    $('#next_song').click(function () {
        var next = $('#playlist .active img');
        if (next.length === 0)
            console.log('nothing after');
        var nextId = parseInt($('#playlist a.active img')[1].id) + 1;
        if (nextId <= $('#playlist a img').length / 2) {
            $('#playlist a')[nextId].click();
            playSong(nextId);
        }
    });

    $('#previous_song').click(function () {
        var before = $('#playlist .active img');
        var beforeId = parseInt($('#playlist a.active img')[1].id) - 1;
        if (beforeId != -1) {
            $('#playlist a')[beforeId].click();
            playSong(beforeId);
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
        if (song.image === null)
            song.image = 'img/vinil.png';
        var fullSongTitle;
        if (song.album === '')
            fullSongTitle = song.name;
        else
            fullSongTitle = song.name + ' - ' + song.album;
        $("#playlist").append('<a class="collection-item"><img id="cover" style="width: 50px; height: 50px" src="' + song.image + '"></img>' + fullSongTitle + '<i><img id="' + i + '" src="img/play.png" align="right"></img></i></a>');
    });
    $('#playlist img').click(function () {
        var selectedSong = $(this).attr('id');
        playSong(selectedSong);
    });
    $('#playlist a').click(function () {
        $('#playlist a').removeClass('active');
        $(this).addClass('active');
    });
}



function playSong(selectedSong) {
    var long = music;
    if (selectedSong >= long.length) {
        player.pause();
    } else {
        $('#player').attr('src', music[selectedSong].song);
        player.play();
        showElementsOnPage();
        var songName = music[selectedSong].name;
        var songAlbum = music[selectedSong].album || '';
        var fullSongTitle;
        if (songAlbum === '')
            fullSongTitle = songName;
        else
            fullSongTitle = songName + ' - ' + songAlbum;
        var titleSong = document.createTextNode(fullSongTitle);
        $('#cover').attr('src', music[selectedSong].image);
        $('#current_song').html(titleSong);
        $('#current_song').show();
        $('#play').hide();
        notifyUser(fullSongTitle, music[selectedSong].image);
        scheduleSong(selectedSong);
        LoadingTags();
    }

}

function notifyUser(songName, picture) {
    Push.create("NanoPlayer", {
        body: songName,
        icon: picture,
        timeout: 4000,
        onClick: function () {
            window.focus();
            this.close();
        }
    });
}

function scheduleSong(id) {
    player.onended = function () {
        var nextSong = parseInt(id) + 1;
        playSong(nextSong);
        $('#playlist a')[nextSong].click();
    }
}

function shuffle(array) {
    if (array.length > 0)
        for (var random, temp, position = array.length; position; random = Math.floor(Math.random() * position), temp = array[--position], array[position] = array[random], array[random] = temp);
    return array;
}

function LoadingTags() {
    music.forEach(function (element, index) {        
        if (!element.AreTagsLoaded) {
            getTasgCurrentSong(element.objFile, element);
            if (element.image != null) {
                $('#playlist img#cover')[index].src = element.image;
                $('#playlist img#cover')[index].style = "width: 50px; height: 50px";
            }
        }
    }, this);
}