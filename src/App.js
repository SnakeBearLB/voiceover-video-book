
// import video from './media/cormorants-vid0.avi'
import video from './media/remember-the-cormorants-with-words-0.mp4'
import audio from './media/audioTest.mp3'
import './App.css';
import {useEffect, useState, useRef} from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true})

function App() {

  const [ready, setReady] = useState(false);
  const [videoFile, setVideoFile] = useState();
  const anchorRef = useRef();
  const addedAudioVideoRef = useRef();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [])

  const downloadTrimmedVideo = () => {
    anchorRef.current.href = addedAudioVideoRef.current.src;
  }
  
  const addAudio = async () => {
    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(video));
    ffmpeg.FS("writeFile", "audio.mp3", await fetchFile(audio));

    await ffmpeg.run('-i', 'input.mp4', '-i', 'audio.mp3', '-filter_complex', '[0:a][1:a]concat=n=2:v=0:a=1[concatenated-audios]', '-map', '0:v', '-map', '[concatenated-audios]', '-c:v', 'copy', 'output.mp4')

    const output = ffmpeg.FS("readFile", "output.mp4");

    addedAudioVideoRef.current.src = URL.createObjectURL(
      new Blob([output.buffer], { type: "video/mp4" })
    );

    anchorRef.current.hidden = false
  }


  return (
    <div className="App">
      <h1>Add Audio</h1>
      <button onClick={addAudio}>Add Audio</button>
      <br/>
      <video ref={addedAudioVideoRef} controls></video>
      <br/>
      {/* download button */}
      <a ref={anchorRef} onClick={downloadTrimmedVideo} download="cormorants.mp4" hidden>
        <button>Download</button>
      </a>
    </div>
  );
}

export default App;
