const APIController = (function () {

    const clientId = '0451ecaaca66412cba3fdb54dd2ff78a';
    const clientSecret = 'ec496176227a41d5b2fa37d39aaec528';
    // private methods
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    const _getTrack = async (token, title) => {
        const result = await fetch('https://api.spotify.com/v1/search?q=SommeilNoir&type=track&market=FR&limit=1', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await result.json();

        console.log(data)
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getTrack(token, title) {
            return _getTrack(token, title);
        }
    }
})();

// UI Module
const UIController = (function () {

    //object to hold references to html selectors
    const DOMElements = {
        textSearch: '#text_search',
        buttonSubmit: '#btn_submit',
        hfToken: '#hidden_token',
        divSonglist: '.song-list'
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                textSearch: document.querySelector(DOMElements.textSearch),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
            }
        },

        // need method to create a track list group item 
        createTrack(id, name) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },

        // need method to create the song detail
        createTrackDetail(img, title, artist) {

            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            // any time user clicks a new song, we need to clear out the song detail div
            detailDiv.innerHTML = '';

            const html =
                `
            <div class="row col-sm-12 px-0">
                <img src="${img}" alt="">        
            </div>
            <div class="row col-sm-12 px-0">
                <label for="Genre" class="form-label col-sm-12">${title}:</label>
            </div>
            <div class="row col-sm-12 px-0">
                <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
            </div> 
            `;

            detailDiv.insertAdjacentHTML('beforeend', html)
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.inputField().textSearch.innerHTML = '';
            this.resetTrackDetail();
        },

        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        }
    }

})();

const APPController = (function (UICtrl, APICtrl) {

    // get input field object ref
    const DOMInputs = UICtrl.inputField();

    // create submit button click event listener
    DOMInputs.submit.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        //get the token
        const token = APICtrl.getToken();
        //Get Input Text
        const text = UICtrl.inputField().textSearch;
        console.log(text);
        //Get Image
        const img = APICtrl.getTrack(token, text);
        //Create Track
        //UICtrl.createTrackDetail(img)
    });

    return {
        init() {
            console.log('App is starting');
        }
    }

})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();
