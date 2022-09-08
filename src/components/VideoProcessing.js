


import '../App.css';
import React, {useRef, useState, useEffect} from "react"
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ 
  corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
  log: true
})

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
    
    // setVideoSegments(currentVideoSegments => [...currentVideoSegments, videoSegments[page] = output])
    
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
    anchorRef.current.hidden = false;
    finalizedVideoRef.current.hidden = false;
  }

  const downloadVideo = () => {
    anchorRef.current.href = finalizedVideoRef.current.src
  }

  useEffect(() => {
    if (ready) {
      addAudio();
    }
  }, [audioList])

  useEffect(() => {
    if (ready) {
      finalize();
    }
  }, [finalizeReady])

  return (
    <div>
      <br/>
      <a ref={anchorRef} onClick={downloadVideo} download="cormorants.mp4" hidden>
        <button>Download</button>
      </a>
      <br/>
      <video className="final-video" ref={finalizedVideoRef} controls hidden></video>
      <br/>
      {/* download button */}
    </div>
  );
}

export default VideoProcessing;