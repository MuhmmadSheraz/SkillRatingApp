(function() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            setTimeout(() => {
                location.href = '../Home/welcome.html'
            }, 2000)
        } else {
            console.log("NO user")
            document.getElementById('loaderWrapper').hidden = true;
            document.getElementById('mainWrapper').hidden = false;

        }
    });

}())





// When User Sign Up





let sign_up = () => {


    let userName = document.getElementById('userName').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let userID;

    if (email) {

        auth.createUserWithEmailAndPassword(email, password).then(e => {
                console.log(e)

                // Getting User ID

                userID = e.user.uid;

                // Add The User Info IN DATABASE

                db.collection('user').doc(userID).set({
                    userId: userID,
                    userEmail: email,
                    userName: userName,

                }).then(e => {

                    console.log("Signed Up Successfully")
                    console.log(e)

                })






            })
            .catch(err => {
                console.log(err)
            })



    }


    // Clearing ALL The Fields


    document.getElementById('userName').value = ""
    document.getElementById('email').value = ""
    document.getElementById('password').value = ""

}

// When User Logged Out

let log_out = () => {
    auth.signOut()
    console.log("User Logged OUT")
}

// When User Signed In

let log_in = () => {

    document.getElementById('userName').hidden = "true"
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value


    auth.signInWithEmailAndPassword(email, password).then(() => {

    })


}

// User Links

let newAcc = () => {
    document.getElementById("indexWrapper").hidden = false
    document.getElementById("signUp_Btn").hidden = false
    document.getElementById("signIn_Btn").hidden = true
    document.getElementById("userName").hidden = false
}
let haveAcc = () => {
    document.getElementById("indexWrapper").hidden = false
    document.getElementById("userName").hidden = true
    document.getElementById("signOut_Btn").hidden = true
    document.getElementById("signUp_Btn").hidden = true
    document.getElementById("signIn_Btn").hidden = false

}