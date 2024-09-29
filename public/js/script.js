const socket = io()

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        let {latitude , longitude} = position.coords;
        socket.emit('send-location' , {latitude , longitude})
    },
    (error)=>{
        console.log(error);
    },
    {
        enableHighAccuracy : true,
        maximumAge : 0,
        timeout : 2500
    }
    )
}

const markers = {}

const map = L.map('map').setView([0 , 0] , 10);
L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

socket.on('recieve-location' , (data)=>{
    console.log('location recieved' , data);
    const {id , latitude , longitude} = data;
    map.setView([latitude , longitude] , 15);

    if(markers[id]){
       markers[id].setLatLong([latitude , longitude])
    }else{
        markers[id] = L.marker([latitude , longitude]).addTo(map)
    }
})

socket.on('user-disconnect' , (data)=>{
    if(markers[data.id]){
        map.removeLayer(markers[data.id])
        delete markers[data.id]
    }
})

