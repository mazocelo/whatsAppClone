const firebase = require('firebase');

require('firebase/firestore')

export class Firebase{

    constructor(){

        this._config = {
            apiKey: "AIzaSyB54kzXkfQEnV_jgvdwT2FwjKyNOSoJL58",
            authDomain: "zapzapclone-b12c7.firebaseapp.com",
            databaseURL: "https://zapzapclone-b12c7.firebaseio.com",
            projectId: "zapzapclone-b12c7",
            storageBucket: "zapzapclone-b12c7.appspot.com",
            messagingSenderId: "622949465024",
            appId: "1:622949465024:web:b5f2a37b785a06f144a625"
        }
        this.init();
        
    }

    init(){
        if(!window._initializedFirebase ){ 
            firebase.initializeApp(this._config);
            
            window._initializedFirebase  = true;
        }
    }

    static db(){
        return firebase.firestore();
    }

    static hd(){

        return firebase.storage();
    }

    initAuth(){
        return new Promise((s,f)=>{
            let provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(res=>{
                let token = res.credential.accessToken;
                let user = res.user;
                s(user, token)
            }).catch(err=>{
                f(err)
                console.log(err)
            })
        })
    }



  }