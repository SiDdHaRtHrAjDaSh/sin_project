let data = { user: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], edges: [[1, 2], [2, 4], [1, 3], [3, 4], [2, 3], [4, 5], [5, 6], [6, 7], [6, 8], [6, 9], [5, 7], [5, 9], [4, 15], [7, 9], [10, 9], [14, 15], [14, 10], [14, 11], [15, 12], [10, 13], [12, 13], [11, 12]] }
let location_data = [{ lat: 38.082822, lng: -116.197378 }, { lat: 48.039625, lng: -102.664165 }, { lat: 33.330991, lng: -102.429125 }, { lat: 40.081039, lng: -79.990626 }, { lat: 23.855040, lng: 71.156924 },
{ lat: 30.952764, lng: 74.869847 }, { lat: 27.423174, lng: 95.179999 }, { lat: 18.859015, lng: 81.141849 }, { lat: 11.127617, lng: 77.485287 }, { lat: 4.047978, lng: 40.293808 },
{ lat: -12.651583, lng: 37.045061 }, { lat: -28.302412, lng: 24.189667 }, { lat: -4.328135, lng: 13.179914 }, { lat: 13.920876, lng: -10.429175 }, { lat: 28.548626, lng: 21.596398 }];

setTimeout(() => {
    $('.dismissButton').click();
}, 2000);


$('.outter').click(() => {
    if ($('.data_write').text().length != 0)
        return;

    $('#banner').remove();
    $('.data_write').append("<b>Suggestions for new chat for each user:</b><br><br>");
    plot_users();
    plot_links();
    suggestions();
});

function data_write(res) {
    for (var i = 0; i < data.user.length; i++) {
        var lst = [];
        for (var j = 0; j < res.length; j++) {
            if (res[j][0] == i + 1) {
                lst.push(res[j][1]);
            }
            if (res[j][1] == i + 1) {
                lst.push(res[j][0]);
            }
        }

        if (lst.length == 0)
            $('.data_write').append(`&nbsp&nbspUser ${i + 1}:&nbsp&nbsp&nbsp&nbspNo Suggestions.<br>`);
        else
            $('.data_write').append(`&nbsp&nbspUser ${i + 1}:&nbsp&nbsp&nbsp&nbsp ${lst.join(", ")}<br>`);

    }
}

function plot(edges, id) {
    var G = new jsnx.Graph();
    for (var i in data.user) {
        G.addNode(data.user[i], { label: `${parseInt(i) + 1}` });
    }

    G.addEdgesFrom(edges);
    jsnx.draw(G, {
        element: `#graph${id}`,
        withLabels: true,
        'labels': 'label',
        weighted: false,
        edgeStyle: {
            'stroke-width': 3,
        }
    });
}

function suggestions() {
    $.ajax({
        url: "http://localhost:9696/suggestion3",
        success: function (result) {
            console.log('abcd abcd');
            var result = JSON.parse(result);
            console.log(result);
            var i = 0;
            function plotLoop() {
                if (i == 0)
                    $('#graph1').append('<div class="gs">Initial Network</div>');
                if (i == 1)
                    $('#graph2').append('<div class="gs">Iteration 1</div>');
                if (i == 2)
                    $('#graph3').append('<div class="gs">Iteration 2</div>');
                if (i == 3)
                    $('#graph4').append('<div class="gs">Iteration 3</div>');
                if (i == 4)
                    $('#graph5').append('<div class="gs">Iteration 4</div>');
                if (i == 5)
                    $('#graph6').append('<div class="gs">Iteration 5</div>');
                if (i == 6)
                    $('#graph7').append('<div class="gs">Iteration 6</div>');  
                if (i == 7)
                    $('#graph8').append('<div class="gs">Iteration 7</div>');  
                if (i == 8)
                    $('#graph9').append('<div class="gs">Iteration 8</div>');  
                if (i == 9)
                    $('#graph10').append('<div class="gs">Iteration 9</div>');  
                
       
                
                plot(result[i], i + 1);
                i += 1;
                console.log(i);
                if (i != 10)
                    setTimeout(plotLoop, 2000);

            }
            plotLoop();
            data_write(result[3]);
        }
    });
}

function plot_users() {
    let i = 1;
    for (var latlng in location_data) {
        var sjtmarker = new google.maps.Marker({
            position: location_data[latlng],
            map: map,
            title: String(i++)
        });
    }
}

function plot_links() {
    for (var latlng in data.edges) {
        var flightPlanCoordinates = [
            location_data[data.edges[latlng][0] - 1],
            location_data[data.edges[latlng][1] - 1]
        ];
        var flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        flightPath.setMap(map);
    }
}


var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: { lat: 30.925803, lng: 7.837723 },
    mapTypeId: 'terrain',
    disableDefaultUI: true,
    style: [{ elementType: 'labels.text.stroke', stylers: [{ color: '#000000' }] }]
});

//   disableDefaultUI: document.documentElement.clientWidth>1000 ? false : true,



var id = '';
var flag = 1000;
console.log("script workinsdsdg");

setInterval(checkLogin, 1000);

function checkLogin() {
    if ($('[name="authorizedIDX"]').length != 0) {
        if ($('[name="authorizedIDX"]').val().length != flag) {
            flag = $('[name="authorizedIDX"]').val().length;
            if (flag > 0) {
                id = $('[name="authorizedIDX"]').val();
                $('#chatpop').attr('class', 'inner');
            }
            else {
                id = "";
            }
        }
        if (flag == 0) {
            $('#chatpop').attr('class', 'outter');
        }
    }
    else {
        $('#chatpop').attr('class', 'outter');
    }
    return;
}

var io = io.connect('https://fathomless-refuge-64458.herokuapp.com/globalChat');
io.on('onlineGC', online => {
    $('#chatBox h3 div').html(`&#x25CF;&nbsp;${online}`);
});

io.on('gc', function (msg) {
    console.log("dsffsafsafs");
    msg = JSON.parse(msg);
    if (msg.id == id) {
        $('.messages').append(`<li class="mine"><div><b>${msg.id}</b></div><p>${msg.text}</p></li>`);
    } else {
        $('.messages').append(`<li><div><b>${msg.id}</b></div><p>${msg.text}</p></li>`);
    }
    $('.messages').scrollTop($('.messages')[0].scrollHeight);
    $('#chatInput').focus();
});


$('#chatbtn').click(fire);
$('#chatInput').keypress(function (e) {
    if (e.which == 13) {
        fire();
        return false;    //<---- Add this line
    }
});

$('#nameTaker').keypress(function (e) {
    if (e.which == 13) {
        if ($('#nameTaker').val().length != 0) {
            $('#chatpop').css('display', 'none');
            $('#sec').css('display', 'flex');
        }
    }
});

function fire() {
    var chat = $('#chatInput').val();
    var chat = {
        id: id,
        text: $('#chatInput').val().trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")
    };
    if (chat.text.length == 0) {
        $('#chatInput').val('');
        $('#chatInput').focus();
        return 0;
    }
    $('#chatInput').val('');
    chat = JSON.stringify(chat);
    io.emit('gc', chat);
    console.log('haha');
}

$('#chatpop').click(() => {
    if ($('#chatpop').attr("class") == "outter") {
        alert("Please enter some name to join chat!!");
        return false;
    }
    $('#chatpop').css('display', 'none');
    $('#sec').css('display', 'flex');
});

$('#head').click(() => {
    $('#chatpop').css('display', 'block');
    $('#sec').css('display', 'none');
});