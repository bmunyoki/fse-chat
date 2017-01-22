window.onload = function() {
    var socket = io.connect('http://127.0.0.1:8004');
    var joinButton = document.getElementById("join");
    var errorDiv = document.getElementById("errors");
    var uName = document.getElementById("uName");

    joinButton.onclick = function(){
        if(uName.value == "") {
            alert("Error: Name is required!");
        } else {
            var userName = uName.value;
            socket.emit('joined', { joiningUser: userName });
        }
    };

}
