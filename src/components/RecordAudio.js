import '../App.css';
import React, {useRef, useState, useEffect} from "react"
// import useRecorder from "./Recorder.js"

const RecordAudio = ({
  audioList, 
  setAudioList, 
  page, 
  setPage, 
  browser, 
  setFinalizeReady,
  videoTemplates,
  imageTemplates,
  processing,
  setProcessing,
}) => {

  const [mediaRecorder, setMediaRecorder] = useState()

  const startButtonRef=useRef()
  const readAlongRef = useRef()
  const readyButtonRef = useRef()
  const backButton = useRef()
  const recordButton = useRef()
  const playButton = useRef()
  const nextButton = useRef()
  const finalizeButton = useRef()
  const loadingDivRef = useRef()
  const finalizeInstruct = useRef()

  const handleReadAlong = () => {
    // console.log(videoTemplates[page])
    readAlongRef.current.src = imageTemplates[page]
    // readAlongRef.current.play()
  }

  const handleStart = () => {
    // readyButtonRef.current.hidden = false
    readAlongRef.current.style.visibility = 'visible'
    readAlongRef.current.hidden = false
    readAlongRef.current.src = imageTemplates[page]
    finalizeButton.current.hidden = 'true'
    startButtonRef.current.hidden = 'true';
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
      recordingScreen();
      handleReadAlong();
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

    mediaRecorder.onstop = function(e) {
    }

    mediaRecorder.ondataavailable = function (e) {
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
    audio.play();
  }

  console.log(page)

  const handleNext = async () => {
    if (page >= 2) {
      finalizeScreen();
      return;
    } else {
      setPage(previousPage => previousPage + 1);
      recordingScreen();
      handleReadAlong();
    };
  }

  const finalize = () => {
    setFinalizeReady(true)
  }

  useEffect(() => {
    if (processing){
      finalizeInstruct.current.style.visibility = 'hidden'
      loadingDivRef.current.style.visibility = 'visible'
      nextButton.current.disable = true
    } else {
      loadingDivRef.current.style.visibility = 'hidden'
      nextButton.current.disable = false
    }
    readAlongRef.current.src = imageTemplates[page]
  })

  useEffect(() => {
    backButton.current.hidden = true
    recordButton.current.hidden = true
    playButton.current.hidden = true
    nextButton.current.hidden = true
    finalizeButton.current.hidden = true
    loadingDivRef.current.style.visibility = 'hidden'
    readAlongRef.current.style.visibility = 'hidden'
  }, []);

  const finalizeScreen = () => {
    recordButton.current.hidden = true
    finalizeButton.current.hidden = false
    nextButton.current.hidden = true
    readAlongRef.current.style.visibility = 'hidden'
    finalizeInstruct.current.style.visibility = 'visible'
  }

  const recordingScreen = () => {
    recordButton.current.hidden = false
    finalizeButton.current.hidden = true
    nextButton.current.hidden = false
    readAlongRef.current.style.visibility = 'visible'
    finalizeInstruct.current.style.visibility = 'hidden'
  }


  return (
    <div>
      <h1>Voiceover Video Book</h1>
      <div className="instruction-div">
        <ol>
          <li>click start to begin the process</li>
          <li>click "record" and read the words on the page</li>
          <li>click "record" again to stop recording</li>
          <li>click "next" to go to next page</li>
          <li>when instucted click "finalize"</li>
        </ol>
        <br/>
        
        <p className="explanation" style={{}}>the end result will be a 3 page downloadable video book with your voice as the narrator</p>
      </div>
      <div className="video-div">
        <div ref={loadingDivRef} className="loading-div">
          <p className="loading-text">Loading...</p>
        </div>
        <p className="finalize-instruct" ref={finalizeInstruct}>click "finalize" below to process and download your video</p>
        <img ref={readAlongRef} className="read-along-div"></img>
      </div>
      <br/>
      <button ref={startButtonRef} onClick={handleStart}>START</button>
      <button ref={backButton} onClick={handleBack}>Back</button>
      <button ref={recordButton} onClick={handleRecord} >Record</button>
      <button ref={playButton} onClick={handlePlay}>Play</button>
      <button ref={nextButton} onClick={handleNext}>Next</button>
      <button ref={finalizeButton} onClick={finalize}>Finalize</button>
    </div>
  ) 
}

export default RecordAudio;