window.onload = function() {
    var namearea = document.getElementById("namearea");
    var conarea = document.getElementById("conarea");
    var joinarea = document.getElementById("joinarea");
    var postarea = document.getElementById("postarea");
    conarea.hidden = true;
    postarea.hidden = true;

    var messages = [];
    var users = [];
    var socket = io.connect('http://127.0.0.1:8004');
    var txt = document.getElementById("txt");
    var sendButton = document.getElementById("send");
    var joinButton = document.getElementById("join");
    var exitButton = document.getElementById("exit");
    var errorDiv = document.getElementById("errors");
    var uName = document.getElementById("uName");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
    var toHide = document.getElementById("toHide");


    socket.on('message', function (data) {
        if(data.message) {
            messages = [];
            messages.push(data);
            var html = '';
            var tmstmp = createDateString();
            for(var i=0; i<messages.length; i++) {
                html += '<div id="chatBlock" style="margin: 1px 20px; background-color: #f4f0ec; min-height: 50px; border-radius: 3px; padding: 5px;"><div style="float: left; font-size: 17px; font-weight: 450; color: #00a554;">' + (messages[i].username ? messages[i].username : 'Chat Server') + '</div><div style="float: right; color: #00a554;">' + tmstmp+'</div><br>';
                html += '<div style="margin-top: 10px;">' + messages[i].message + '</div></div><br />';
            }
            content.innerHTML = html;
            content.scrollTop = content.scrollHeight;
        } else {
            console.log("There is a problem:", data);
        }
    });

    socket.on('receiveddb', function (data) {
        var html = '';
        var tmstmp = createDateString();
        for(var i in data) {
            var messages = data[i];
            var str = messages.txt;
            if((messages.name == 'Chat Server') && (name.value == str.substr(0,str.indexOf(' ')))){
                html += '';
            }else{
                html += '<div id="chatBlock" style="margin: 1px 20px; background-color: #f4f0ec; min-height: 50px; border-radius: 3px; padding: 5px;"><div style="float: left; font-size: 17px; font-weight: 450; color: #00a554;">' + messages.name + '</div><div style="float: right; color: #00a554;">' + messages.created +'</div><br>';
                html += '<div style="margin-top: 10px;">' + messages.txt + '</div></div><br />';
            }
        }
        content.innerHTML = html;
        content.scrollTop = content.scrollHeight;
    });

    joinButton.onclick = function() {
        if(name.value == "") {
            alert("Enter your name!");
        } else {
            var txtJoin = name.value +" joined";
            var created = createDateString();
            var server = "Chat Server";
            socket.emit('newcomer', { joiningmessage: txtJoin, username: server, tmp: created });
            conarea.hidden = false;
            postarea.hidden = false;
            namearea.hidden = true;
            joinarea.hidden = true;
        }
    };

    sendButton.onclick = function() {
        if(txt.value == "") {
            alert("Message is required!");
        } else {
            name.disabled = true;
            var text = txt.value;
            var created = createDateString();
            socket.emit('send', { message: text, username: name.value, tmp: created });
            txt.value = "";
        }
    };

    exitButton.onclick = function() {
        conarea.hidden = true;
        postarea.hidden = true;
        namearea.hidden = false;
        joinarea.hidden = false;
        name.disabled = false;
        var txtLeft = name.value +" left";
        var created = createDateString();
        var server = "Chat Server";
        socket.emit('leftchat', { leavingmessage: txtLeft, username: server, tmp: created });

        var html = '';
        html += '<div id="chatBlock" style="margin: 1px 20px; background-color: #f4f0ec; min-height: 50px; border-radius: 3px; padding: 5px;"><div style="float: left; font-size: 17px; font-weight: 450; color: #00a554;">Chat Server</div><div style="float: right; color: #00a554;">' + created +'</div><br>';
        html += '<div style="margin-top: 10px;">You exited chat</div></div><br />';
        content.innerHTML = html;
        content.scrollTop = content.scrollHeight;
        name.value = "";
    };

    function createDateString(){
        var x = new Date()
        var year = x.getFullYear();
        var month = x. getMonth()+1;
        var day = x.getDate();
        var hour = x.getHours();
        var mins = x.getMinutes();
        var secs = x.getSeconds();
        var t = "";
        if(hour >= 12){
            t = "PM";
        }else{
            t = "AM";
        }

        var str = month+"."+day+"."+year+" "+hour+":"+mins+t;
        return str;
    }

}
