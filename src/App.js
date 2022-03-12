
// import video from './media/cormorants-vid0.avi'
import video from './media/remember-the-cormorants-with-words-0.mp4'
import audio from './media/audioTest.mp3'
import './App.css';
import {useEffect, useState, useRef} from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true})
// console.log(video)

function App() {

  const [ready, setReady] = useState(false);
  const [videoFile, setVideoFile] = useState();
  const [inputVideoLength, setInputVideoLength] = useState();
  const [outputVideoLength, setOutputVideoLength] = useState();
  // const inputVideoRef = useRef();
  const videoRef = useRef();
  const anchorRef = useRef();
  const extendedVideoRef = useRef();
  const addedAudioVideoRef = useRef();

  // const playInputVideo = () => {
  //   inputVideoRef.current.play();
  // }

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
    // convert();
  }

  useEffect(() => {
    load();
  }, [])

  const trimVideo = async () => {

    // write the AVI to the FFmpeg file system
    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(video));

    await ffmpeg.run("-ss", "00:00:02", "-to", "00:00:05", "-i", "input.mp4", "-c", "copy", "output.mp4");
    // -ss 00:00:00 -to 00:00:07 -i INPUT VIDEO -c copy video-seg0-audio.mp3

    const output = ffmpeg.FS("readFile", "output.mp4");

    videoRef.current.src = URL.createObjectURL(
      new Blob([output.buffer], { type: "video/mp4" })
    );
  }

  const playTrimmedVideo = () => {
    videoRef.current.play();
  }

  const downloadTrimmedVideo = () => {
    anchorRef.current.href = videoRef.current.src;
  }

  const extendVideo = async () => {
    // write the AVI to the FFmpeg file system
    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(video));

    await ffmpeg.run('-i', 'input.mp4', '-vf','tpad=stop_mode=clone:stop_duration=1', 'output.mp4');
    // await ffmpeg.run('-itsoffset', '5', '-i', 'input.mp4', 'output.mp4');

    const output = ffmpeg.FS("readFile", "output.mp4");

    extendedVideoRef.current.src = URL.createObjectURL(
      new Blob([output.buffer], { type: "video/mp4" })
    );
    videoLength();
  }
  
  const videoLength = () => {
    setInputVideoLength(video.duration)
    setOutputVideoLength(extendedVideoRef.current.durtion)
  }
  
  const addAudio = async () => {
    // write the AVI to the FFmpeg file system
    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(video));
    ffmpeg.FS("writeFile", "audio.mp3", await fetchFile(audio));

    // await ffmpeg.run('-i', 'input.mp4', '-i', 'audio.mp3', '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-shortest', 'output.mp4');
    // i INPUT AUDIO -i SECOND INPUT AUDIO -map 0 -map 1 -c:a

    // await ffmpeg.run('-y', '-i', 'input.mp4', '-itsoffset', '00:00:07', '-i', 'audio.mp3', '-map', '0:v', '-map', '0:a', '-map', '1:a', '-c:v', 'copy', '-preset', 'ultrafast', '-async', '1', 'output.mp4');

    // ffmpeg -i /Users/Lance/Desktop/ffmpeg-testing/remember-the-cormorants-with-words-0.mp4 -i /Users/Lance/Desktop/ffmpeg-testing/video-seg0-audio.mp3 -itsoffset 00:00:07 -i /Users/Lance/Desktop/ffmpeg-testing/audioTest.mp3 -map 0:v -map 1:a -map 2:a -c:v copy -preset -shortest -async 1 added-audio.mp4


    // ffmpeg -i input.mp4 -i input.mp3 -i input.mp3 -map 1 -map 2 -codec copy added-audio.mp4

    // ffmpeg -i /Users/Lance/Desktop/ffmpeg-testing/remember-the-cormorants-with-words-0.mp4 -i /Users/Lance/Desktop/ffmpeg-testing/audioTest.mp3 -i Users/Lance/Desktop/ffmpeg-testing/video-seg0-audio.mp3 -filter_complex "[1:a]adelay=7s:all=1[a1];[2:a]adelay=20s:all=1[a2];[a1][a2]amix=inputs=2[amixout]" -map 0:v:0 -map "[amixout]" -c:v copy -c:a aac -b:a 192k output.mp4

    // ffmpeg -i /Users/Lance/Desktop/ffmpeg-testing/remember-the-cormorants-with-words-0.mp4 -i /Users/Lance/Desktop/ffmpeg-testing/audioTest.mp3 -i /Users/Lance/Desktop/ffmpeg-testing/video-seg0-audio.mp3 -filter_complex [1:a]adelay=7s amix=inputs=2[amixout] -map 0:v:0 -map "[amixout]" -c:v copy -c:a aac -b:a 192k output.mp4

    // ffmpeg -i /Users/Lance/Desktop/ffmpeg-testing/remember-the-cormorants-with-words-0.mp4 -i /Users/Lance/Desktop/ffmpeg-testing/audioTest.mp3 -i /Users/Lance/Desktop/ffmpeg-testing/video-seg0-audio.mp3 -filter_complex "[1:0]adelay=7000 amix=inputs=2[amixout]" -map 0:v:0 -map "[amixout]" -c:v copy output.mp4

    // ffmpeg -i /Users/Lance/Desktop/ffmpeg-testing/remember-the-cormorants-with-words-0.mp4 -i /Users/Lance/Desktop/ffmpeg-testing/audioTest.mp3 -i /Users/Lance/Desktop/ffmpeg-testing/video-seg0-audio.mp3 -filter_complex "[1:0]adelay=7000; [2:0] amix=inputs=[amixout]" -map 0:v:0 -map "[amixout]" -c:v copy output.mp4

    // ffmpeg -i /Users/Lance/Desktop/ffmpeg-testing/video-seg0-audio.mp3 -i /Users/Lance/Desktop/ffmpeg-testing/audioTest.mp3 -filter_complex amix=inputs=2 output.mp3

    // ffmpeg -i /Users/Lance/Desktop/ffmpeg-testing/video-seg0-audio.mp3 -i /Users/Lance/Desktop/ffmpeg-testing/audioTest.mp3 -filter_complex "adelay=0|7000 amix=inputs=2" output.mp3

    // ffmpeg -i /Users/Lance/Desktop/ffmpeg-testing/video-seg0-audio.mp3 -i /Users/Lance/Desktop/ffmpeg-testing/audioTest.mp3 -filter_complex "[1:0]adelay=7000|7000" -c copy output.mp3

    // Concat two audio files
    // ffmpeg -i /Users/Lance/Desktop/ffmpeg-testing/video-seg0-audio.mp3 -i /Users/Lance/Desktop/ffmpeg-testing/audioTest.mp3 -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1[a]" -map "[a]" -c:a mp3 testfull.mp3

    // Concat two audio files and merge with video
    // ffmpeg -i /Users/Lance/Desktop/ffmpeg-testing/remember-the-cormorants-with-words-0.mp4 -i /Users/Lance/Desktop/ffmpeg-testing/video-seg0-audio.mp3 -i /Users/Lance/Desktop/ffmpeg-testing/audioTest.mp3 -filter_complex "[0:a][2:a]concat=n=2:v=0:a=1[a]" -map 0:v -map "[a]" -c:v copy testfull.mp4

    // 


    // await ffmpeg.run('-i', 'input.mp4', '-i', 'audio.mp3', '-map', '0', '-map', '1:a', '-c:v', 'copy', 'output.mp4')

    await ffmpeg.run('-i', 'input.mp4', '-i', 'audio.mp3', '-filter_complex', '[0:a][1:a]concat=n=2:v=0:a=1[concatenated-audios]', '-map', '0:v', '-map', '[concatenated-audios]', '-c:v', 'copy', 'output.mp4')


    // ffmpeg -i video.mkv -i audio.m4a -filter_complex "[0:a][1:a]amerge=inputs=2[a]" -map 0:v -map "[a]" -c:v copy -ac 2 -shortest output.mkv


    const output = ffmpeg.FS("readFile", "output.mp4");

    addedAudioVideoRef.current.src = URL.createObjectURL(
      new Blob([output.buffer], { type: "video/mp4" })
    );
  }
  


  // create the FFmpeg instance and load it
  // const ffmpeg = createFFmpeg({ log: true });
  // await ffmpeg.load();

  // SEQUENCE trim video
    // GET mp4 video
    // COMPUTE ffmpeg
      // 

  // SEQUENCE add audio
    // GET audio mp3
    // GET video MP4
    // COMPUTE ffmpeg to add audio and video together
    // END sequence

  // SEQUENCE extend video frame
    // GET length of user recorded audio
    // COMPUTE ffmpeg: extend last video frame length of audio
  
  // SEQUENCE add all videos together
    // GET all videos with added audio tracks
    // COMPUTE ffmpeg: combine all videos

  // make output video downloadable


  return (
    <div className="App">
      {/* <button onClick={playInputVideo}>Play Input Video</button>
      <video ref={inputVideoRef} src={video}></video> */}
      <h1>Trim Video</h1>
      <button onClick={trimVideo}>Trim Video</button>
      {/* video element */}
      <video ref={videoRef} controls></video>
      {/* play video button */}
      <button onClick={playTrimmedVideo}>Play Converted Video</button>
      <h3>Download Converted Video</h3>
      {/* download button */}
      {/* <button onClick={downloadConvertedVideo}>Download</button> */}
      <a ref={anchorRef} onClick={downloadTrimmedVideo} download="cormorants.mp4">Download</a>

      <h1>Extend Video</h1>
      <button onClick={extendVideo}>Extend Video</button>
      <video ref={extendedVideoRef} controls></video>
      <p>{inputVideoLength}</p>
      <p>{outputVideoLength}</p>

      <h1>Add Audio</h1>
      <button onClick={addAudio}>Add Audio</button>
      <video ref={addedAudioVideoRef} controls></video>
    </div>
  );
}

export default App;
