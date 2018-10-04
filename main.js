function getRedirectorURL()
{
    let now = new Date();
    let timeTag = strftime('%y%m%d-%H', now);
    let url = `https://api.bynetcdn.com/Redirector/glz/${timeTag}_News/PD`;
    return url;
}

console.log(getRedirectorURL());
