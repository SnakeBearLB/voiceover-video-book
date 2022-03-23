import '../App.css';
import {useEffect, useState, useRef} from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true})

const AudioProcessing = ({
  videoTemplates,
  page,
  audioList,
  setVideoSegments,
  videoSegments
}) => {


  return(
    <>
    </>
  )
}

export default AudioProcessing;

