
function getTags(urlSong) {
  jsmediatags.read(urlSong, {
    onSuccess: function (tag) {
      console.log(tag.tags);
    },
    onError: function (error) {
      console.log(error);
    }
  });
}

function getSongData(pos, urlSong) {
  jsmediatags.read(urlSong, {
    onSuccess: function (tag) {
      var obj = {};
      if (tag.tags) {
        obj["id"] = pos;
        obj["name"] = tag.tags.title || '';
        obj["song"] = urlSong;
        obj["artist"] = tag.tags.artist || '';
        obj["album"] = tag.tags.album || '';
        obj["image"] = getSongCover(tag.tags.picture);
      }
      songs.push(obj);
      
    },
    onError: function (error) {
      console.log(error);
    }
  });

}

function getSongCover(image) {
  if (image) {
    var base64String = "";
    for (var i = 0; i < image.data.length; i++) {
      base64String += String.fromCharCode(image.data[i]);
    }
    var base64 = "data:" + image.format + ";base64," +
      window.btoa(base64String);
    return base64;
  } else {
    return '';
  }
}