

import '../App.css';
import {useEffect, useState, useRef} from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

import fullVideo from '../media/remember-the-cormorants-with-words.mp4'
import { render } from '@testing-library/react';

const ffmpeg = createFFmpeg({ log: true})

const VideoProcessing = ({
  audioList, 
  finalizeReady, 
  page, 
  videoSegments, 
  setVideoSegments, 
  videoTemplates,
}) => {
  const anchorRef = useRef();
  const finalizedVideoRef = useRef();
  const [ready, setReady] = useState(false);
  const [tsVideosArray, setTsVideosArray] = useState([]);

  const load = async () => {
    if (!ready) {
      await ffmpeg.load();
      setReady(true);
    }
  }

  useEffect(() => {
    load();
  }, [])

  const addAudio = async () => {
    console.log(videoTemplates)
    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoTemplates[page]));
    ffmpeg.FS("writeFile", "audio", await fetchFile(audioList[page]));
    console.log(audioList[page])

    // add page audio to corresponding video segment
    await ffmpeg.run('-i', 'input.mp4', '-i', 'audio', '-filter_complex', '[0:a][1:a]concat=n=2:v=0:a=1[concatenated-audios]', '-map', '0:v', '-map', '[concatenated-audios]', '-c:v', 'copy', 'output.mp4')

    const output = ffmpeg.FS("readFile", "output.mp4");

    // convert videosegment to ts
    ffmpeg.FS("writeFile", "addAudioOutput", await fetchFile(output));

    await ffmpeg.run('-i', 'addAudioOutput', '-c', 'copy', '-bsf:v', 'h264_mp4toannexb', '-f', 'mpegts', 'output.ts')

    const outputTs = ffmpeg.FS("readFile", "output.ts")
    
    setVideoSegments(currentVideoSegments => [...currentVideoSegments, videoSegments[page] = output])
    
    tsVideosArray[page] = outputTs

    
    setTsVideosArray(currentVideoSegments => [...currentVideoSegments, tsVideosArray[page] = outputTs])
    
    console.log(tsVideosArray)
  }

  const mergeVideos = async (video, i) => {
    console.log('mergeVideos 2')
    ffmpeg.FS('writeFile', 'finalizedVideo', await fetchFile(video));
    ffmpeg.FS("writeFile", "input", await fetchFile(tsVideosArray[i]));
    await ffmpeg.run('-y', '-i', "concat:finalizedVideo|input", '-c', 'copy', 'output.ts')
    const output = ffmpeg.FS('readFile', 'output.ts')
    console.log('end mergeVideos 2')
    return output
  }

  const finalProcess = async (lastVideo) => {
    console.log('finalProcess 1')
    ffmpeg.FS('writeFile', 'combinedVideos', await fetchFile(lastVideo));
    await ffmpeg.run('-i', "combinedVideos", '-c', 'copy', 'output.mp4')
    const output = ffmpeg.FS('readFile', 'output.mp4')
    return output;
  }

  const finalize = async() => {
    let finalFuck = tsVideosArray[0]
    console.log(tsVideosArray.length -1)
    for (let i = 1; i < tsVideosArray.length - 1; i++){
      const addTo = await mergeVideos(finalFuck, i)
      finalFuck = addTo;
    }
    console.log(finalFuck)
    const last = await finalProcess(finalFuck)
    console.log(last)
    videoAvailable(last)
  }


  const videoAvailable = (video) => {
    finalizedVideoRef.current.src = URL.createObjectURL(
      new Blob([video.buffer], { type: "video/mp4" })
    );
  }

  const downloadVideo = () => {
    anchorRef.current.href = finalizedVideoRef.current.src
    anchorRef.current.hidden = false;
  }

  useEffect(() => {
    addAudio();
  }, [audioList])

  useEffect(() => {
    finalize();
  }, [finalizeReady])

  return (
    <div>
      <h1>Remember The Cormorants</h1>
      <br/>
      <video ref={finalizedVideoRef} controls></video>
      <br/>
      {/* download button */}
      <a ref={anchorRef} onClick={downloadVideo} download="cormorants.mp4" hidden>
        <button>Download</button>
      </a>
    </div>
  );
}

export default VideoProcessing;