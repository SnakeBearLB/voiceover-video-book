
import './App.css';
import {useEffect, useState} from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [])

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

    </div>
  );
}

export default App;
