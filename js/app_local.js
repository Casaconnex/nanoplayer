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
    $('#preloader').show();
    var files = evt.target.files; // FileList object    
    if (songs === null)
        songs = [];
    // files is a FileList of File objects. List some properties.           
    for (var i = 0, f; f = files[i]; i++) {
        if (f.type === "audio/mp3") {
            // if (i <= 200)
            //     getSongTagsFromFiles(i, f, URL.createObjectURL(f));
            var obj = {};
            obj["id"] = i;
            obj["name"] = f.name;
            obj["song"] = URL.createObjectURL(f);
            obj["objFile"] = f;
            obj["artist"] = '';
            obj["album"] = '';
            obj["image"] = null;
            obj["AreTagsLoaded"] = false;
            songs.push(obj);
            console.log(f);
        }
    }
    music = songs;
    $("#playlist").empty();

    setTimeout(function () {
        //$("#cloud_generate_playlist").click();
        genList(music);
        playSong(0);
        var pl = $('#playlist a')[0];
        if (pl != null)
            $('#playlist a')[0].click();
        $('#preloader').hide();
    }, window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart);
}

function getTasgCurrentSong(file, objSong)
{
    getSongTagsFromFile(file, objSong);
}