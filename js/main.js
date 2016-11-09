//make an http request to get list of the students
// you populate that list in side the DOM
// whenever the name was clicked, make another http request, this time your get the individual student information
// then you show that info in the dom
let modal = document.getElementById('myModal');
let span = document.getElementsByClassName("open")[0];
let images = document.querySelectorAll('.image');
let infos = document.querySelectorAll('.info');


(function(){
    let URL = "http://148.75.251.185:8888"
    let content = document.querySelector('#name');
    let index = 0;
    let jqueryButton = document.querySelector('.image');
    let mainGrid = document.querySelector('#grid');
    
    mainGrid.addEventListener('click',function(evnt){
        if( evnt.target.classList.contains('thumb')){
            
            $.ajax({
                method: "GET",
                url: URL+'/students/'+evnt.target.dataset.id,
            }).done(function(response){
                // document.querySelector('#myModal .modalContent .pic').innerText =  response.profile_picture;
                document.querySelector('#myModal .modalContent .name').innerText =  response.first_name + " " + response.last_name;
                document.querySelector('#myModal .modalContent .email').innerText =  response.email;
                document.querySelector('#myModal .modalContent .exerpt').innerText =  response.excerpt;
                document.querySelector('#myModal .modalContent .links').innerHTML =  '<a href="' + response.links[0].url + '">Website</a>';
                document.querySelector('#myModal .modalContent .links').href = response.links[0].url;
                modal.style.display = "block";
            });
        }
    });
    $.ajax({ 
        url: URL+'/students',
        method: "GET"
    }).done(function(response){
        for (let i=0; i<response.length; i++){
            $.ajax({
                url: URL+'/students/'+response[i].id,
                method: "GET"
            }).done(function(response){
                let div= document.createElement('div');
                div.classList.add('image');
                let image = document.createElement('img');
                image.classList.add('thumb');
                image.src = URL + response.profile_picture;
                image.dataset.id = response.id;
                div.appendChild(image);
                mainGrid.appendChild(div);
            });
        }
    })
})();

span.addEventListener('click',function(){
    modal.style.display = "none";
});

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}