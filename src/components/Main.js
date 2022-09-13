
import React, {useRef, useState, useEffect} from "react"
import VideoProcessing from './VideoProcessing.js'
import RecordAudio from "./RecordAudio.js"
import BrowserDetection from "../utils/BrowserDetection.js"

import video0 from '../media/remember-the-cormorants-with-words-0.mp4'
import video1 from '../media/remember-the-cormorants-with-words-1.mp4'
import video2 from '../media/remember-the-cormorants-with-words-2.mp4'

import image0 from '../media/page0.jpeg'
import image1 from '../media/page1.jpeg'
import image2 from '../media/page2.jpeg'


const Main = () => {

  const [browser, setBrowser] = useState();
  const [page, setPage] = useState(0);
  const [audioList, setAudioList] = useState([])
  const [videoSegments, setVideoSegments] = useState([])
  const [processing, setProcessing] = useState(false)

  const [finalizedVideo, setFinalizedVideo] = useState()
  const [finalizeReady, setFinalizeReady] = useState(false)
  const [finalVideo, setFinalVideo] = useState()

  const videoImports = [video0, video1, video2]
  const imageImports = [image0, image1, image2]

  const [videoTemplates, setVideoTemplates] = useState(videoImports)
  const [imageTemplates, setImageTemplates] = useState(imageImports)
  
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
        imageTemplates={imageTemplates}
        processing={processing}
        setProcessing={setProcessing}
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
        processing={processing}
        setProcessing={setProcessing}    
      />
    </div>
  )
}

export default Main;