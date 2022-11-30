function sendRequest(first_petition, offset) {
    request = new XMLHttpRequest();
    petition = 'https://api.spotify.com/v1/search?limit=15&q=' + input.value + '&type=' + type.value + '&offset=' + offset;
    request.open('GET', petition, true);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + access_token);
    request.onreadystatechange = () => { dealResponse(first_petition) };
    request.send();
}

function dealResponse(first_petition) {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
        console.log(request.responseText);
        window.addEventListener('scroll', checkScroll);
        response_json = JSON.parse(request.responseText);
        if (request.readyState = 4 && request.status == 200) {
            if (first_petition) {
                results.innerHTML = '';
            }
            if (type.value == 'artist') {
                results_json = response_json.artists.items;
            } else if (type.value == 'album') {
                results_json = response_json.albums.items;
            } else if (type.value == 'track') {
                results_json = response_json.tracks.items;
            }
            for (elem of results_json) {
                elem_div = document.createElement('div');
                elem_div.classList.add('result');
                img = document.createElement('img');
                img.className = 'image';
                img_div = document.createElement('div');
                img_div.className = 'img_div';
                img_div.appendChild(img);
                if (type.value == 'track') {
                    img.src = elem.album.images[0].url;
                    audio = document.createElement('audio');
                    audio.setAttribute('src', elem.preview_url);
                    audio.volume = 0.5;
                    img_div.appendChild(audio);
                    play_img = document.createElement('img');
                    play_img.src = './img/play.svg'
                    play_img.className = 'play';
                    pause_img = document.createElement('img');
                    pause_img.src = './img/pause.svg';
                    pause_img.className = 'pause';
                    img_div.appendChild(play_img);
                    img_div.appendChild(pause_img);
                    play_img.onclick = (e) => {
                        audios = document.getElementsByTagName('audio');
                        for (a of audios) {
                            a.pause();
                        }
                        result_divs = document.getElementsByClassName('result');
                        for (result of result_divs) {
                            result.style.opacity = 0.5;
                        }
                        e.target.closest('.result').style.opacity = 1;
                        e.target.closest('div').children[1].play()
                    };
                    pause_img.onclick = (e) => {
                        e.target.closest('div').children[1].pause();
                        result_divs = document.getElementsByClassName('result');
                        for (result of result_divs) {
                            result.style.opacity = 1;
                        }
                    };

                } else {
                    if (elem.images[0]) {
                        img.src = elem.images[0].url;
                    } else img.src = 'https://previews.123rf.com/images/urfandadashov/urfandadashov1805/urfandadashov180500070/100957966-photo-not-available-icon-isolated-on-white-background-vector-illustration.jpg';
                }
                elem_div.appendChild(img_div);
                title_div = document.createElement('div');
                title_div.innerHTML = elem.name;
                title_div.classList.add('title');
                elem_div.appendChild(title_div);
                results.appendChild(elem_div);
            }
        }
    }
}

function renewToken(client_id, client_secret) {
    var authParameters = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials&client_id=" + client_id + "&client_secret=" + client_secret
    };

    fetch('https://accounts.spotify.com/api/token', authParameters)
        .then(response => response.json())
        .then(data => access_token = data.access_token);
}

function checkScroll() {
    if (window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - window.innerHeight / 25) {
        offset += 15;
        window.removeEventListener('scroll', checkScroll);
        sendRequest(false, offset);
    }
};

window.onload = () => {
    const client_id = "40a1ec0b41594dd8915a1ed05ab5585e";
    const client_secret = "185c38e4fd894a0f94f2453d3d14e155";
    access_token = 'BQDZayXAql8VoV1VwvkHPCpzGNvsmD4mFTkIf-pRplqsX7mr4iLOBGZJ1HXa_zBoCb44wJlUXJu4J00LRKMw1UINz7DEjY_rmnd4pW23tjuYHohcqpFPpe0nuAsxRDG_b4sUqVtEjMJopsvaQhi-EdmSwZq1JwUErA04gWiIdJm49nGEOhoJPEQtka_DCg';
    offset = 0;
    input = document.getElementsByTagName('input')[0];
    type = document.getElementsByTagName('select')[0];
    results = document.getElementById('results');
    search_btn = document.getElementsByTagName('button')[0];
    search_btn.onclick = () => { sendRequest(true, offset) };
    window.onkeyup = (e) => { if (e.keyCode === 13) sendRequest(true, offset) };
    renewToken(client_id, client_secret);
    toggle_theme_div = document.getElementById('toggle_theme');
    toggle_theme_div.onclick = () => {
        if (toggle_theme_div.classList.contains('dark')) {
            toggle_theme_div.classList.add('light');
            toggle_theme_div.classList.remove('dark');
            loupe_img = document.getElementById('loupe');
            loupe_img.src = './img/loupe_black.svg';
            document.documentElement.style.setProperty('--primary-color', '#FFFFFF');
            document.documentElement.style.setProperty('--secondary-color', '#141414');
        } else {
            toggle_theme_div.classList.remove('light');
            toggle_theme_div.classList.add('dark');
            loupe_img.src = './img/loupe_white.svg';
            document.documentElement.style.setProperty('--primary-color', '#141414');
            document.documentElement.style.setProperty('--secondary-color', '#FFFFFF');
        }
    }
    window.addEventListener('scroll', checkScroll);
}