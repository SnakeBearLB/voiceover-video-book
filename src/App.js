
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
    // GET audio from 
  // add audio
  // extend last frame of video for length of audio
  // merge video files


  return (
    <div className="App">

    </div>
  );
}

export default App;
