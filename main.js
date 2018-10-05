var PLAYBACK_RATE = 1.2;
var MAX_ATTEMPTS = 3;

// This is a utility I had to write in order to get the redirect location
// of a page.  I had trouble using traditional (client-side) methods 
// because their https url redirects to http
var HEADER_UTIL_URL = "https://scripts.augmented.life/utils/get_http_header?url="

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

function findValidRedirect(now, failedAttempts, el, callback)
{
    let url = getRedirectorURL(now);
    let fullurl = HEADER_UTIL_URL + url;
    console.log(fullurl);
    fetch(fullurl)
        .then(response => response.json())
        .then(function(data) {
            console.log(data);
            if(data.status == "OK" && data.location != null && !data.location.includes("not_found"))
            {
                console.log(data.location);
                let redirect_url = data.location;
                redirect_url = redirect_url.replace("http:","https:");
                console.log(redirect_url);
                updateAudioElement(el, redirect_url);
                callback(true, now);
            }
            else
            {
                console.log("did not get valid redirect");
                failedAttempts++;
                if(failedAttempts >= MAX_ATTEMPTS) {
                    console.log("giving up");
                    callback(false, null);
                } else {
                    now.setHours(now.getHours() - 1);
                    findValidRedirect(now, failedAttempts, el, callback);
                }
            }
        });
}

function setAudioSource(el, callback) 
{
    let now = new Date();
    findValidRedirect(now, 0, el, callback);
}
