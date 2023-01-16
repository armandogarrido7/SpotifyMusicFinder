const { createApp } = Vue;

createApp({
    data() {
        return {
            results: [],
            textSearch: '',
            type: "artist",
            client_id: "40a1ec0b41594dd8915a1ed05ab5585e",
            client_secret: "185c38e4fd894a0f94f2453d3d14e155",
            access_token: 'BQDZayXAql8VoV1VwvkHPCpzGNvsmD4mFTkIf-pRplqsX7mr4iLOBGZJ1HXa_zBoCb44wJlUXJu4J00LRKMw1UINz7DEjY_rmnd4pW23tjuYHohcqpFPpe0nuAsxRDG_b4sUqVtEjMJopsvaQhi-EdmSwZq1JwUErA04gWiIdJm49nGEOhoJPEQtka_DCg',
            offset: 0,
            first_petition: true
        }
    },
    computed: {

    },
    methods: {
        sendRequest(first_petition) {
            request = new XMLHttpRequest();
            petition = 'https://api.spotify.com/v1/search?limit=15&q=' + this.textSearch + '&type=' + this.type + '&offset=' + this.offset;
            request.open('GET', petition, true);
            request.setRequestHeader('Accept', 'application/json');
            request.setRequestHeader('Content-Type', 'application/json');
            request.setRequestHeader('Authorization', 'Bearer ' + this.access_token);
            request.onreadystatechange = () => { this.dealResponse(first_petition) };
            request.send();
        },
        dealResponse(first_petition) {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                response_json = JSON.parse(request.responseText);
                window.addEventListener('scroll', this.checkScroll)
                if (request.readyState = 4 && request.status == 200) {
                    if (first_petition) {
                        this.results = [];
                    }
                    if (this.type == 'artist') {
                        this.results.push(...response_json.artists.items);
                    } else if (this.type == 'album') {
                        this.results.push(...response_json.albums.items);
                    } else {
                        this.results.push(...response_json.tracks.items);
                    }

                }
            }

        },
        search() {
            if (this.textSearch.trim()) {
                this.sendRequest(true, 15);
            }

        },
        getImageURL(result) {
            if (this.type == 'track') {
                if (result.album) url = result.album.images[0].url;
                else url = 'https://previews.123rf.com/images/urfandadashov/urfandadashov1805/urfandadashov180500070/100957966-photo-not-available-icon-isolated-on-white-background-vector-illustration.jpg';
            } else {
                if (result.images) url = result.images[0].url;
                else url = 'https://previews.123rf.com/images/urfandadashov/urfandadashov1805/urfandadashov180500070/100957966-photo-not-available-icon-isolated-on-white-background-vector-illustration.jpg';
            }
            return url;

        },
        scrollEvent() {
            window.addEventListener('scroll', this.checkScroll)
        },
        checkScroll() {
            if (window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - window.innerHeight / 25) {
                this.offset += 15;
                window.removeEventListener('scroll', this.checkScroll);
                this.sendRequest(false);
            }
        },
        playAudio(audio_id) {
            for (audio of document.getElementsByTagName('audio')) {
                audio.pause();
            }
            for (div of document.getElementsByClassName('result')) {
                div.style.opacity = 0.5;
            }
            document.getElementById(audio_id).play();
            document.getElementById(audio_id).closest('.result').style.opacity = 1;
        },
        stopAudio() {
            for (audio of document.getElementsByTagName('audio')) {
                audio.pause();
            }
            for (div of document.getElementsByClassName('result')) {
                div.style.opacity = 1;
            }
        }
    },
    beforeMount() {
        authParameters = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials&client_id=" + this.client_id + "&client_secret=" + this.client_secret
        };

        fetch('https://accounts.spotify.com/api/token', authParameters)
            .then(response => response.json())
            .then(data => {
                this.access_token = data.access_token;
            });
    },
    mounted() {
        this.scrollEvent();
    }
}).mount('#finder');