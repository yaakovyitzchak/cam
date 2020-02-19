COBY.var("webcammer", function() {
    var config = {
        'iceServers': [
            {'url': 'stun:stun.services.mozilla.com'}, 
            {'url': 'stun:stun.l.google.com:19302'}
        ]
    },
        lStream,
        pCon,
        uid;

    var socket = new COBY.CobySocket({
        url: "wss://yaakovcam.herokuapp.com/",
        onmessage(d) {
       //     console.log("gotMSg",d.data);
            
        },
        listeners: {
            hiBack(msg) {
                console.log("got hid",msg);
            },
            sdp(msg) {
                console.log("GOT!",msg, msg.sdp);
                if(msg.uid && msg.uid != uid) {
                    if(!pCon) {
                        perific(false);
                    }
                    pCon.setRemoteDescription(
                        new RTCSessionDescription(
                            msg.sdp
                        )
                    ).then(() => {
                            if(msg.sdp.type == "offer") {
                                pCon.createAnswer().then(
                                    gotDesc
                                ).catch(
                                    err => {
                                        console.log(err)
                                    }
                                )
                            }
                        }
                    ).catch(err => {
                        console.log(err);
                    });
                } else {
                    console.log(msg.uid, " UID?? ",uid)
                }
            },
            ice(msg) {
           //     console.log("ICED?", msg)
                if(msg.uid && msg.uid != uid) {
                    if(!pCon) {
                        perific(false);
                    }
                    pCon.addIceCandidate(
                        new RTCIceCandidate(
                            msg.ice
                        )
                    ).catch(er => {
                        console.log("HEY ERROR", er)
                    })
                } else {
                    console.log(msg, " UID?? ", uid)
                }
            },
            opened(msg) {
                console.log(msg);
                if(msg.uid) {
                    uid = msg.uid
                    socket.send({
                        hi: uid
                    });
                }
            }
        },
        onOpen() {
            
            console.log("sent")
        }
    });
        

    function perific(isCaller) {
        pCon = new RTCPeerConnection(config);
        pCon.addEventListener("icecandidate", ev => {
            console.log("Ict?")
            if(ev.candidate != null) {
                socket.send({
                    ice: ev.candidate
                });
            }
        });
        pCon.addEventListener("track", ev => {
            console.log("streamable?",ev.streams[0]);
            remoteV.srcObject = ev.streams[0];
        });
        if(lStream) {
                console.log("Streamd?");
                pCon.addStream(lStream); 
        } else {
            console.log("streemingly!");
        }

        if(isCaller) {
            console.log("hi")
            pCon.createOffer()
            .then(
                gotDesc
            ).catch(
                err => {
                    console.log(err);
                }
            );
        }
        console.log(pCon);
    }

    function gotDesc(desc) {
        console.log("in",desc)
        pCon.setLocalDescription(
            desc
        ).then(() => {
            socket.send({
                sdp: desc
            });
        }).catch(err => {
            console.log(err);
        })
    }
    
    this.start = () => {
        
        perific(true);

    };
    
    this.peerify = () => {
        perific(true);
    };

    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
    window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
    
    if(navigator.getUserMedia) {
        navigator.getUserMedia(
            {
                video: true,
                audio: true,
                noiseSuppresion: true
            },
            stream => {
                console.log("hi",stream)
                lStream = stream;
                localV.srcObject = (
                    lStream
                );
            },
            error => {
                console.log(error);
            }
        )
    }

});