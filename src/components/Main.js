
import React, {useRef, useState, useEffect} from "react"
import VideoProcessing from './VideoProcessing.js'
import RecordAudio from "./RecordAudio.js"
import BrowserDetection from "../utils/BrowserDetection.js"

import video0 from '../media/remember-the-cormorants-with-words-0.mp4'
import video1 from '../media/remember-the-cormorants-with-words-1.mp4'
import video2 from '../media/remember-the-cormorants-with-words-2.mp4'


const Main = () => {

  const [browser, setBrowser] = useState();
  const [page, setPage] = useState(0);
  const [audioList, setAudioList] = useState([])
  const [videoSegments, setVideoSegments] = useState([])

  const [finalizedVideo, setFinalizedVideo] = useState()
  const [finalizeReady, setFinalizeReady] = useState(false)
  const [finalVideo, setFinalVideo] = useState()

  const videoImports = [video0, video1, video2]

  const [videoTemplates, setVideoTemplates] = useState(videoImports)
  
  BrowserDetection(browser, setBrowser);

  return (
    <div>
      <RecordAudio 
        audioList={audioList}
        setAudioList={setAudioList}
        page={page}
        setPage={setPage}
        browser={browser}
        setFinalizeReady={setFinalizeReady}
        finalizeReady={finalizeReady}
        finalizedVideo={finalizedVideo}
        setFinalizedVideo={setFinalizedVideo}
        videoTemplates={videoTemplates}
      />
      <VideoProcessing 
        audioList={audioList}
        setAudioList={setAudioList} 
        finalizedVideo={finalizedVideo} 
        setFinalizedVideo={setFinalizedVideo} 
        finalizeReady={finalizeReady} 
        page={page}
        videoSegments={videoSegments}
        setVideoSegments={setVideoSegments}
        videoTemplates={videoTemplates} 
        setVideoTemplates={setVideoTemplates}
        finalVideo={finalVideo}
        setFinalVideo={setFinalVideo}       
      />
    </div>
  )
}

export default Main;