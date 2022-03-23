
import VideoProcessing from "./VideoProcessing.js";
import AudioProcessing from './AudioProcessing.js'
import BrowserDetection from "../utils/BrowserDetection.js";
import {useEffect, useState, useRef} from 'react'
// import useRecorder from "./Recorder.js"

const RecordAudio = ({
  audioList, 
  setAudioList, 
  page, 
  setPage, 
  browser, 
  setFinalizeReady, 
  finalizeReady,
  finalizedVideo,
  setFinalizedVideo
}) => {

  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState()

  const backButton = useRef()
  const recordButton = useRef()
  const playButton = useRef()
  const nextButton = useRef()
  const finalizeButton = useRef()

  // console.log(page)
  let chunks = [];
  
  console.log(audioList)

  const handleStart = () => {
    if (navigator.mediaDevices.getUserMedia) {
      backButton.current.hidden = false
      recordButton.current.hidden = false
      playButton.current.hidden = false
      nextButton.current.hidden = false
      console.log('getUserMedia supported.')
      let constraints = { audio: true };
      var mediaRecorder = null
  
      let onSuccess = function(stream) {
        let options = null;
        if (browser === "Safari") {
          options = {
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000,
            mimeType: 'video/mp4'
          }
        } else {
          options = {mimetype: 'audio/webm'}
        }

        setMediaRecorder(mediaRecorder = new MediaRecorder(stream, options))
        console.log(mediaRecorder.state)
        // mediaRecorder = new MediaRecorder(stream)
      }
      let onError = function(err) {
        console.log('The following error occured: ' + err);
      }
  
      navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  
    } else {
      console.log('getUserMedia not supported on your browser!')
    }
  }

  const handleBack = () => {
    if (page > 0) {
      setPage(previousPage => previousPage - 1);
    } else {
      return;
    }
  }

  // recordButton.current.addEventListener('click', function (event) {
  const handleRecord = () => {
    console.log(mediaRecorder.state)
    if (mediaRecorder.state === 'inactive') {
      mediaRecorder.start();
      recordButton.current.style.backgroundColor = "red";
    } else if (mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      recordButton.current.style.backgroundColor = "";
    } else {
      console.log(mediaRecorder.state);
    }
    console.log(mediaRecorder.state);
  
    //////////////////////////////
    //  Record/Stop/Store Data  //
    //////////////////////////////

    mediaRecorder.onstop = function(e) {
      console.log("recorder stopped");
      console.log(e)
    }

    ///////////////////////////////        
    // STORING BLOBS IN CHUNKS[] //
    ///////////////////////////////

    mediaRecorder.ondataavailable = function (e) {
      console.log(audioList)
      console.log(page)
      console.log(chunks)
      const blob = e.data.slice(0, e.data.size, "audio/mpeg")
      if (audioList[page] === undefined) {
        setAudioList(currentList => [...currentList, blob])
      } else {
        audioList[page] = blob
        console.log(audioList[page])
        console.log(audioList)
      }
    }
  }

  const handlePlay = () => {
    console.log(audioList[page])
    const audioURL = window.URL.createObjectURL(audioList[page])
    const audio = document.createElement('audio')
    audio.src = audioURL
    console.log(page)
    audio.play();
  }

  const handleNext = () => {
    if (page === 12) {
      return;
    } else {
      setPage(previousPage => previousPage + 1);
      console.log(page)
    };
  }

  console.log(page)

  const finalize = () => {
    setFinalizeReady(true)
  }

  useEffect(() => {
    backButton.current.hidden = true
    recordButton.current.hidden = true
    playButton.current.hidden = true
    nextButton.current.hidden = true
  }, []);


  return (
    <div>
      <button onClick={handleStart}>START</button>
      <button ref={backButton} onClick={handleBack}>Back</button>
      <button ref={recordButton} onClick={handleRecord} >Record</button>
      <button ref={playButton} onClick={handlePlay}>Play</button>
      <button ref={nextButton} onClick={handleNext}>Next</button>
      <button ref={finalizeButton} onClick={finalize}>Finalize</button>
    </div>
  ) 
}

export default RecordAudio;