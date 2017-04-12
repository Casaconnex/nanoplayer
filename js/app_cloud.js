var listMp3FromCloud = [];

function handleFileFromCloud(evt) {
    $('#cloud_generate_playlist').hide();
    var url = $("#music_cloud_url").val();
    $.ajax({
        url: url,
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
            console.log('Error: ' + error);
        }
    }).done(function () {
        console.log('done call ajax');
        getTagInfo();
        setTimeout(function () {
            $("#cloud_generate_playlist").click();
            $('#playlist a')[0].click();
        }, (window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart)*2);
    });
}

function getTagInfo() {
    $.each(listMp3FromCloud, function (index, item) {
        console.log(index);
        getSongTags(index, item);
    });

    $("#playlist").empty();
    music = songs;    
    genList(music);
    console.log(music);
}

function handleGenPlaylist() {
    genList(music);    
    playSong(0);    
}