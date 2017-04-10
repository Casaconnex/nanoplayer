/*GET TAGS FROM MP3 FILES*/

//from a file using FileAPI
function getSongTagsFromFiles(pos, file, path) {
    var url = file.urn || file.name;

    ID3.loadTags(url, function () {
        showTags(pos, url, path);
    }, {
            tags: ["title", "artist", "album", "picture"],
            dataReader: ID3.FileAPIReader(file)
        });
}


//from an URL using XHR
function getSongTags(pos, url) {

    ID3.loadTags(url, function () {
        showTags(pos, url, null);
    }, {
            tags: ["title", "artist", "album", "picture"]
        });
}

function showTags(pos, url, path) {
    var tags = ID3.getAllTags(url);
    console.log(tags);
    var obj = {};
    if (tags) {
        obj["id"] = pos;
        obj["name"] = tags.title || '';
        obj["song"] = path === null ? url : path;
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