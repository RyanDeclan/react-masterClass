import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import YouTube from "react-youtube";
import styled from "styled-components";

var cElement = null;
function Pause(props) {
  return <button onClick={props.handleClick}>Mute</button>;
}

function Video(props) {
  console.log(props);
  const opts = {
    width: "100%",
    height: "1080vh",
    position: "absolute",

    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      controls: 0,
      loop: 1,
      mute: 1,
      playlist: "pBvH8hvnJPk",
    },
  };

  useEffect(() => {
    if (cElement) {
      props.isPaused
        ? cElement.target.unMute() && cElement.target.setVolume(60)
        : cElement.target.mute();
    }
  }, [props.isPaused]);

  const _onReady = (event) => {
    console.log("_onReady");
    cElement = event;
    // event.target.playVideo();
  };

  const _onStateChange = (event) => {
    // event.target.pauseVideo()
  };
  return (
    <YouTube
      videoId={"pBvH8hvnJPk"}
      opts={opts}
      onReady={_onReady}
      onStateChange={_onStateChange}
    />
  );
}

const BackGround = styled.div`
  width: 100%;
  height: 100%;
`;

const BgYoutube = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -99;
`;

const BgAssistant = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 20;
  top: 44%;
  left: 95%;
  bottom: 0;
  right: 0;
`;

const BgOverView = styled.div``;
const BgControlBtn = styled.div`
  width: 100%;
  height: 100%;
`;

function Tpp() {
  const [isPaused, setIsPaused] = useState(false);
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  return (
    <BackGround>
      <BgYoutube>
        <Video isPaused={isPaused} />
      </BgYoutube>
      <BgAssistant>
        <BgOverView></BgOverView>
        <BgControlBtn>
          <Pause handleClick={togglePause} />
        </BgControlBtn>
      </BgAssistant>
    </BackGround>
  );
}
export default Tpp;
