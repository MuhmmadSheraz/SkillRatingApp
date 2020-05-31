db.enablePersistence()
    .catch(function(err) {
        if (err.code == 'failed-precondition') {
            // probably multible tabs open at once
            console.log('persistance failed');
        } else if (err.code == 'unimplemented') {
            // lack of browser support for the feature
            console.log('persistance not available');
        }
    });

let userData;
let uid;
let ratingNumber = 5;
(function() {



    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            uid = user.uid


            db.collection('user').doc(uid).get().then(e => {


                userData = e.data()

                document.getElementById('loaderWrapper').hidden = true;
                document.getElementById('mainWrapper').hidden = false;

                document.getElementById('headerName').hidden = false;


                document.getElementById('headerName').innerHTML = `Welcome ${e.data().userName}`

                // console.log(userData.userName)



            })
        } else {
            console.log("NO user")
            location.href = "../Authentication/index.html"
        }
    });

}())

let logout = () => {

        auth.signOut()
    }
    // Post Buttons

let addPost = () => {

    document.getElementById('buttonWrapper').hidden = true
    document.getElementById('postInput').hidden = false

}

// Upload Post

let uploadPost = () => {
    let skillName = document.getElementById('skillName').value

    if (skillName) {




        db.collection('services').add({
            userName: userData.userName,
            skillName: skillName.toLowerCase(),
            rating: [],
            uid: uid
        })

        document.getElementById('buttonWrapper').hidden = false
        document.getElementById('postInput').hidden = true
        console.log("Skill Addeds")
        document.getElementById('showAllPost').hidden = false;
        document.getElementById('specificSkill').hidden = true;
        document.getElementById('skillName').value = "";
    }


}

// Show Categories
(function() {

    let skillArray = []

    let mainSkillDiv = document.getElementById('allCategories');
    db.collection('services').onSnapshot(a => {
        document.getElementById('allCategories').innerHTML = "";
        skillArray = []

        a.docs.forEach(e => {

            if (skillArray.some(person => person.skillName == e.data().skillName)) {

                let a = document.getElementById(e.data().skillName).innerHTML
                document.getElementById(e.data().skillName).innerHTML = parseInt(a) + 1

            } else {
                skillArray.push(e.data())

                // Creating Div

                let skillDiv = document.createElement('div')
                let skillNameDiv = document.createElement('div')
                let moreSkillDiv = document.createElement('div')

                // Adding Attributes

                skillDiv.setAttribute('class', 'd-flex justify-content-around bg-dark text-white mt-3 p-3 ')
                skillNameDiv.setAttribute('class', 'categoryName')
                moreSkillDiv.setAttribute('class', 'badge badge-light p-2')
                moreSkillDiv.setAttribute('id', `${e.data().skillName}`)


                // Adding Values

                skillNameDiv.innerHTML = e.data().skillName.charAt(0).toUpperCase() + e.data().skillName.slice(1)
                moreSkillDiv.innerHTML = 1

                // Appending Data

                skillDiv.append(skillNameDiv)
                skillDiv.append(moreSkillDiv)
                mainSkillDiv.append(skillDiv)


            }
        })

    })


}())

// Specific Post

// Add Event Listener

document.querySelector('#allCategories').addEventListener("click", (e) => {

    let specificSkillDiv = document.getElementById('specificSkill')
    specificSkillDiv.innerHTML = ""
    specificSkillDiv.hidden = false
    document.getElementById('showAllPost').hidden = true;

    let selectedSkill = e.target.children[0].innerHTML;
    db.collection('services').where('skillName', '==', selectedSkill.toLowerCase()).get().then(e => {
        e.docs.forEach(x => {

            // Hiding Rating Button

            if (uid == x.data().uid) {

                // Creating Div
                let skillDiv = document.createElement('div')
                let skillNameDiv = document.createElement('div')
                let userNameDiv = document.createElement('div')
                let viewRating = document.createElement('button')


                // Adding Attributes
                skillDiv.setAttribute('class', 'd-flex justify-content-around bg-dark text-white mt-3 p-3 ')
                skillNameDiv.setAttribute('class', 'categoryName')
                userNameDiv.setAttribute('class', 'userNameCategory')
                viewRating.setAttribute('class', 'btn btn-success btn-small')
                viewRating.setAttribute('onclick', `viewRating("${x.id}")`)
                viewRating.setAttribute('onclick', `viewRating("${x.id}")`)
                viewRating.setAttribute('data-toggle', 'modal')
                viewRating.setAttribute('data-target', '.bd-example-modal-lg')


                // Adding Values
                skillNameDiv.innerHTML = x.data().skillName.charAt(0).toUpperCase() + x.data().skillName.slice(1)
                userNameDiv.innerHTML = x.data().userName
                viewRating.textContent = "View Rating"

                // Appending Data

                skillDiv.append(skillNameDiv)
                skillDiv.append(userNameDiv)
                skillDiv.append(viewRating)
                let specificSkillDiv = document.getElementById('specificSkill')
                specificSkillDiv.append(skillDiv)



            } else {

                // debugger
                let avgRating = x.data().rating
                let avgRatinglength = x.data().rating.length
                let avgRatingNumber = 0;

                for (let i = 0; i < avgRating.length; i++) {
                    // debugger

                    avgRatingNumber += x.data().rating[i].rating;


                }
                let averageRatingFinal = (avgRatingNumber / avgRatinglength).toFixed(2)
                console.log(avgRating)



                let skillDiv = document.createElement('div')
                let skillNameDiv = document.createElement('div')
                let userNameDiv = document.createElement('div')
                let averageRatingDiv = document.createElement('div')
                let rateButton = document.createElement('button')

                // Adding Attributes

                skillDiv.setAttribute('class', 'd-flex justify-content-around bg-dark text-white mt-3 p-3 ')
                skillNameDiv.setAttribute('class', 'categoryName')
                userNameDiv.setAttribute('class', 'userNameCategory')
                rateButton.setAttribute('class', 'btn btn-danger')
                rateButton.setAttribute('onclick', `rateIT("${x.id}")`)
                rateButton.setAttribute('data-toggle', 'modal')
                rateButton.setAttribute('data-target', ' #exampleModalCenter')






                // Adding Values

                skillNameDiv.innerHTML = x.data().skillName.charAt(0).toUpperCase() + x.data().skillName.slice(1)
                userNameDiv.innerHTML = x.data().userName
                rateButton.textContent = "RATE IT"
                averageRatingDiv.textContent = `Average Rating : ${averageRatingFinal}`

                // Appending Data

                skillDiv.append(skillNameDiv)
                skillDiv.append(userNameDiv)
                skillDiv.append(averageRatingDiv)
                skillDiv.append(rateButton)
                let specificSkillDiv = document.getElementById('specificSkill')
                specificSkillDiv.append(skillDiv)
            }





        })
    })
})

// Rating  Button

let rateIT = (serviceID) => {

    let currentUserId = uid



    var options = {
        max_value: 5,
        cursor: 'pointer',
        step_size: 0.5,
        selected_symbol_type: 'utf8_star',
        initial_value: 0,
    }

    $(".rating").rate(options);

    $(".rating").on("change", function hello(ev, data) {
        ratingNumber = data.to
        console.log(ratingNumber)

    })
    console.log(serviceID)

    let a = document.getElementById('submitModal')
    a.setAttribute('onclick', `submit('${serviceID}')`)

}


let submit = (Sid) => {

    db.collection('services').doc(Sid).get().then(e => {

        // debugger
        let skillName = e.data().skillName
        let skillOwnerId = e.data().uid
        let skillOwnerName = e.data().userName
        let ratingArray = e.data().rating
        console.log(ratingArray)
        let obj = {
            userName: userData.userName,
            rating: ratingNumber,
            uid: uid,
        }


        if (ratingArray.some(rating => rating.uid == uid)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You Have Rated Already',

            })
        } else {
            ratingArray.push(obj)
            db.collection('services').doc(Sid).set({
                skillName: skillName,
                uid: skillOwnerId,
                userName: skillOwnerName,
                rating: ratingArray
            }, { merge: true })
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Your have Rated SuccessFully',
                showConfirmButton: false,
                timer: 1500
            })
        }
        // }


    })


}


// View Rating

let viewRating = (Sid) => {
        db.collection('services').doc(Sid).get().then(e => {

            let allRating = e.data().rating


            for (let i = 0; i < allRating.length; i++) {
                console.log(allRating[i])

                // Creating Div

                let UserRating = document.createElement('div')
                let userNameDiv = document.createElement('div')

                // Adding Values

                userNameDiv.innerHTML = `User Name : ${allRating[i].userName}`
                UserRating.innerHTML = `Rating : ${allRating[i].rating}`

                let modalDiv = document.getElementById('showRatingModalBody')
                document.getElementById('showRatingModalHeader').hidden = false
                    //  Appending

                modalDiv.append(userNameDiv)
                modalDiv.append(UserRating)
            }

        })
    }
    // Service Worker