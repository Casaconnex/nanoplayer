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
            getSongTagsFromFiles(i, f, URL.createObjectURL(f));
    }
    music = songs;
    $("#playlist").empty();
    genList(music);
}