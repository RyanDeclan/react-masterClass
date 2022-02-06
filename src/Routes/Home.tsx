import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { getMovies, IGetMoviesResult } from "./api";
import { makeImagePath } from "./utilities";
import { useEffect, useState, useRef } from "react";
import { moveEmitHelpers } from "typescript";
import YouTube from "react-youtube";
import { useNavigate, useMatch } from "react-router-dom";
import { stringify } from "querystring";
import Tpp from "./deo";

//animatePresence는 컴포넌트가 render되거나 destroy될 때 효과를 줄 수 있다.

///////////////youtube/////////////////
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
if (firstScriptTag && firstScriptTag.parentNode) {
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); // no error
}

///////////////////////////

const Wrapper = styled.div`
  background: black;
  height: 200vh;
  position: sticky;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
//<{ bgPhoto: string }>
const Banner = styled.div`
  height: 100vh;
`;

const Title = styled.h2`
  font-size: 73px;
  margin-bottom: 30px;
`;

const Cover = styled.div`
  top: 0;
  width: 100%;
  height: 4%;
  background: black;
  position: absolute;
`;

const Overview = styled.p`
  font-size: 23px;
  width: 50%;
  margin-bottom: 150px;
`;

const Slider = styled.div`
  position: relative;
  top: -54%;
  bottom: 0;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  height: 200px;
  color: red;
  font-size: 64px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  //position: absolute; 이렇게 하면 화면이 꽉채워지지 않음 그래서 position: fixed; 이렇게 바꿔줌
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
`;

const BigCover = styled.img`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 10,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.55,
    y: -70,
    //근데 이렇게 만하면 통통 튐 이런 효과가 defult임 type: tween으로 해주면 됌
    //그런데 이러면 hover때만 tween이 적용이되서 hover도 써주고 아래로 내려서 box에도 transition : {{type:"tween"}}을 써줘야함
    //그래야 hover일때도 안튕기고 마우스를 치워서 다시 돌아갈때도 튕기지 않음
    transition: {
      delay: 0.8,
      type: "tween",
    },
  },
};

const Boxs = styled.div`
  position: absolute;
  top: 31%;
  bottom: 0;
  left: 2%;
  right: 0;
`;

// 이건 마우스커서가 올라갈때 처음만 딜레이주고 마우스를 치웠을때는 딜레이를 없애기 위해 필요함
const offset = 6;

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useViewportScroll();

  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  //onExitComplete 이함수는 exit이 끝났을 때 실행이 됌
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => navigate("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );

  //<Banner onClick={incraseIndex}>

  //<Title>{data?.results[0].title}</Title>
  //<Overview>{data?.results[0].overview}</Overview>
  //bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
  var cElement = null;
  function Pause(props: any) {
    return <button onClick={props.handleClick}>Pause</button>;
  }

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Cover></Cover>
          <Tpp></Tpp>
          <Boxs>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Boxs>
          <Slider>
            <AnimatePresence
              initial={false}
              // initial false해주니까 홈눌르면 슬라이더 작동되면서 오던데 그냥 처음부터 존재해있음
              onExitComplete={toggleLeaving}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                //애니메이션이 통통 튀는걸 싫어서 transition으로 linear animation으로함
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      key={movie.id}
                      whileHover="hover"
                      //아까는 transition delay2을 여기다 써서 box전체 애니메이션이 2초가걸렸지만
                      //지지금은 variants로 whileHover가 작동할때만 delay 가 걸리게해둠
                      initial="normal"
                      transition={{ type: "tween" }}
                      variants={boxVariants}
                    ></Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}

                  //top: scrollY,이렇게하면 화면 위에 너무 딱붙어서 조금 내릴려고 그냥 + 100
                  //이런식으로 해주면 오류뜸 저건 단순히 숫자가 아니라서 숫자로변환할려면
                  //scrollY.get()이렇게 해줘야 돼
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
