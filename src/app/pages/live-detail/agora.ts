
import { agora } from '@config'
import * as browser from '@app/common/browser';

export default function(AgoraRTC: any, channel: string) {

  if(!AgoraRTC.checkSystemRequirements()) {
    // alert("你的浏览器不支持 WebRTC，无法观看直播!");
    return false;
  }

  let client: any,
      localStream: any,
      camera,
      microphone,
      // user token
      channel_key: any = null,
      streamList: Array<any> = [];

  client = AgoraRTC.createClient({ mode: 'live' });

  // 创建客户端
  client.init(agora.appid, function () {

    // 加入频道
    client.join(channel_key, channel, null, function(uid: string) {
      
      // camera = videoSource.value;
      // microphone = audioSource.value;
      // localStream = AgoraRTC.createStream({streamID: uid, audio: true, cameraId: camera, microphoneId: microphone, video: document.getElementById("video").checked, screen: false});

      // AgoraRTC.getDevices(function (devices: any) {

      //   localStream = AgoraRTC.createStream({streamID: uid, audio: true, cameraId: null, microphoneId: devices[0].deviceId, video: false, screen: false});
        
      //   localStream.on("accessAllowed", function() {
      //     console.log('---');
      //     console.log("accessAllowed");
      //   });

      //   localStream.on("accessDenied", function() {
      //     console.log('---');
      //     console.log("accessDenied");
      //   });

      // });

      /*
      if (document.getElementById("video").checked) {
        camera = videoSource.value;
        microphone = audioSource.value;
        localStream = AgoraRTC.createStream({streamID: uid, audio: true, cameraId: camera, microphoneId: microphone, video: document.getElementById("video").checked, screen: false});
        //localStream = AgoraRTC.createStream({streamID: uid, audio: false, cameraId: camera, microphoneId: microphone, video: false, screen: true, extensionId: 'minllpmhdgpndnkomcoccfekfegnlikg'});
        if (document.getElementById("video").checked) {
          localStream.setVideoProfile('720p_3');
          // localStream.setVideoProfile('720P_6');
        }

        // The user has granted access to the camera and mic.
        localStream.on("accessAllowed", function() {
          console.log("accessAllowed");
        });

        // The user has denied access to the camera and mic.
        localStream.on("accessDenied", function() {
          console.log("accessDenied");
        });

        localStream.init(function() {
          console.log("getUserMedia successfully");
          localStream.play('agora_local');

          client.publish(localStream, function (err) {
            console.log("Publish local stream error: " + err);
          });

          client.on('stream-published', function (evt) {
            console.log("Publish local stream successfully");
          });
        }, function (err) {
          console.log("getUserMedia failed", err);
        });
      }
      */
      
    }, function(err: any) {
      console.log("Join channel failed", err);
    });

  }, function (err: any) {
    console.log("AgoraRTC client init failed", err);
  });

  /*
  channelKey = "";
  client.on('error', function(err) {
    console.log("Got error msg:", err.reason);
    if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
      client.renewChannelKey(channelKey, function(){
        console.log("Renew channel key successfully");
      }, function(err){
        console.log("Renew channel key failed: ", err);
      });
    }
  });
  */

  
  client.on('stream-added', function (evt) {
    var stream = evt.stream;
    console.log("New stream added: " + stream.getId());
    console.log("Subscribe ", stream);

    // client.subscribe(stream, null, function(err){
    //   console.log("Subscribe stream failed", err);
    // });


    client.subscribe(stream, function (err) {
      console.log("Subscribe stream failed", err);
    });


    // client.enableAudio();

    // console.log(client.unmuteAudio);

    // unmuteAudio
  });
  
  client.on('stream-subscribed', function (evt) {
    var stream = evt.stream;
    // console.log('订阅=======');
    // console.log(stream);
    // console.log("Subscribe remote stream successfully: " + stream.getId());
    if ($('div#video #agora_remote'+stream.getId()).length === 0) {
      let style = '';
      if (!stream.video) style = 'display:none';
      //  style="float:left; width:810px;height:607px;display:inline-block;"
      $('div#video').append('<div id="agora_remote'+stream.getId()+'" style="'+style+'"></div>');
    }
    
    if (browser.isSafari()) {
      streamList.push(stream);
    } else {
      stream.play('agora_remote' + stream.getId());
    }
    
  });

  
  client.on('stream-removed', function (evt) {
    var stream = evt.stream;
    stream.stop();
    $('#agora_remote' + stream.getId()).remove();
    console.log("Remote stream is removed " + stream.getId());
  });

  client.on('peer-leave', function (evt) {
    var stream = evt.stream;
    if (stream) {
      stream.stop();
      $('#agora_remote' + stream.getId()).remove();
      console.log(evt.uid + " leaved from this channel");
    }
  });
  
  client.on("first-audio-frame-decode", function(evt){

    console.log('音频回调函数');

    // var stream = evt.stream;

    // setTimeout(()=>{
    //   $('audio');
    //   console.log($('audio'))
    // }, 2000);

  });

  return {
    play: ()=>{    
      // console.log(streamList);
      streamList.map(stream=>{
        stream.play('agora_remote' + stream.getId());
      })
    },
    stop: ()=>{
      streamList.map(stream=>{
        stream.stop();
      })
    }
  }

}