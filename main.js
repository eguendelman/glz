var PLAYBACK_RATE = 1.2;
var MAX_ATTEMPTS = 3;

function getRedirectorURL(now)
{
    let timeTag = strftime("%y%m%d-%H", now);
    let url = `https://api.bynetcdn.com/Redirector/glz/${timeTag}_News/PD`;
    return url;
}

function updateAudioElement(el, url)
{
    el.src = url;
    el.playbackRate = PLAYBACK_RATE;
    el.play();
    el.style.display = "block";
}

function setAudioSource(el, callback) 
{
    let now = new Date();
    let failedAttempts = 0;
    let url = getRedirectorURL(now);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4) {
            if(xhr.status == 200)
            {
                console.log("redirect detected to: " + xhr.responseURL);
                updateAudioElement(el, xhr.responseURL);
                callback(true, now);
            } else {
                console.log("did not get valid redirect");
                failedAttempts++;
                if(failedAttempts >= MAX_ATTEMPTS) {
                    console.log("giving up");
                    callback(false, null);
                } else {
                    now.setHours(now.getHours() - 1);
                    url = getRedirectorURL(now);
                    console.log(`Trying ${url}`);
                    xhr.open("GET", url, true);
                    xhr.send();
                }
            }
        }
    }
    console.log(`Trying ${url}`);
    xhr.open("GET", url, true);
    xhr.send();
}
