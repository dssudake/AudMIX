import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Button, Card, Form } from 'react-bootstrap';

import WaveSurfer from 'wavesurfer.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap.js';

import {
  BsPlayFill,
  BsPauseFill,
  BsFillVolumeUpFill,
  BsFillVolumeMuteFill,
  BsStopFill,
} from 'react-icons/bs';
import {
  AiOutlineZoomIn,
  AiOutlineZoomOut,
  AiFillStepForward,
  AiFillStepBackward,
} from 'react-icons/ai';
import { ImVolumeDecrease, ImVolumeIncrease } from 'react-icons/im';

const formWaveSurferOptions = (ref, reftl) => ({
  container: ref,
  waveColor: '#4d4d4d',
  progressColor: '#80b387',
  cursorColor: '#80b387',
  minPxPerSec: 30,
  scrollParent: true,
  // autoCenter: true,
  // autoCenterImmediately: false,
  // hideScrollbar: true,
  barWidth: 2,
  // barRadius: 3,
  skipLength: 5,
  cursorWidth: 1,
  barGap: null, // the optional spacing between bars of the wave, if not provided will be calculated in legacy format
  responsive: true,
  height: 150,
  normalize: true, // If true, normalize by the maximum peak instead of 1.0
  partialRender: true, // Use the PeakCache to improve rendering speed of large waveforms
  plugins: [
    CursorPlugin.create({
      showTime: true,
      opacity: 1,
      color: '#666666',
      customShowTimeStyle: {
        'background-color': '#e6e6e6',
        color: '#000',
        padding: '3px',
        'font-size': '12px',
      },
    }),
    TimelinePlugin.create({
      container: reftl,
      notchPercentHeight: 60,
      unlabeledNotchColor: '#808080',
      secondaryFontColor: '#fff',
    }),
    MinimapPlugin.create({
      height: 50,
    }),
  ],
});

// eslint-disable-next-line react/prop-types
function WaveAudioPlayerFL({ url, name }, ref) {
  const waveformRef = useRef(null);
  const timelineRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [zoom, setZoom] = useState(30);
  const [playBack, setPlayBack] = useState(1);
  const [currentTime, setCurrentTime] = useState('0:0');
  const [totalTime, setTotalTime] = useState('0:0');

  useImperativeHandle(
    ref,
    () => ({
      handelWaveformExport() {
        const wave = wavesurfer.current.exportImage();
        var img = '';
        if (typeof wave == 'object') {
          img = wave[0];
        } else if (typeof wave == 'string') {
          img = wave;
        }
        var link = document.createElement('a');
        link.href = img;
        link.target = '_blank';
        link.download = 'Waveform.png';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    }),
    []
  );

  const convertTime = (time) => {
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    return `${minutes}:${seconds}`;
  };

  const setCurTime = () =>
    setCurrentTime(convertTime(wavesurfer.current.getCurrentTime().toFixed(0)));

  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current, timelineRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(url);

    wavesurfer.current.on('ready', function () {
      // https://wavesurfer-js.org/docs/methods.html
      // wavesurfer.current.play();
      // setPlay(true);

      // make sure object stillavailable when file loaded
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(0.9);
        setIsMute(false);
        setVolume(volume);
        setTotalTime(convertTime(wavesurfer.current.getDuration().toFixed(0)));
      }
    });

    wavesurfer.current.on('audioprocess', function () {
      if (wavesurfer.current.isPlaying()) {
        setCurTime();
      }
    });

    wavesurfer.current.on('finish', function () {
      setPlay(false);
    });

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
  }, [url]);

  const btnShadow = {
    boxShadow: 'inset 6px 6px 13px #638a68,inset -6px -6px 13px #9ddca6',
  };

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  const handelStop = () => {
    wavesurfer.current.stop();
    setPlay(false);
    setCurTime();
  };

  const handelSkip = (which) => {
    if (which === 'forward') {
      wavesurfer.current.skipForward();
    } else if (which === 'backward') {
      wavesurfer.current.skipBackward();
    }
    setCurTime();
  };

  const handleToggleMute = () => {
    setIsMute(!isMute);
    wavesurfer.current.toggleMute();
  };

  const onVolumeChange = (e) => {
    const { target } = e;
    const newVolume = +target.value;

    if (newVolume) {
      setVolume(newVolume);
      wavesurfer.current.setVolume(newVolume || 1);
    }
  };

  const handelZoom = (e) => {
    wavesurfer.current.zoom(Number(e.target.value));
    setZoom(e.target.value);
  };

  const handelPlayBack = (e) => {
    wavesurfer.current.setPlaybackRate(Number(e.target.value));
    setPlayBack(e.target.value);
  };

  return (
    <div
      style={{
        borderRadius: '10px',
        boxShadow: '11px 11px 17px #060606, -11px -11px 17px #161616',
        padding: '15px 15px 0px 15px',
      }}
    >
      <Card ref={timelineRef} className="rounded-top bg-dark border-0" />
      <Card ref={waveformRef} className="rounded-top bg-dark border-0" />

      <Card className="bg-dark border-0 py-2">
        <Card className="bg-dark border-0">
          <Card.Header>
            <Row>
              <Col>
                <Button
                  className="rounded-circle pb-2 mr-2"
                  style={btnShadow}
                  onClick={() => handelSkip('backward')}
                >
                  <AiFillStepBackward />
                </Button>
                <Button
                  className="rounded-circle pb-2 mr-2"
                  style={btnShadow}
                  onClick={handlePlayPause}
                >
                  {!playing ? <BsPlayFill /> : <BsPauseFill />}
                </Button>
                <Button className="rounded-circle pb-2 mr-2" style={btnShadow} onClick={handelStop}>
                  <BsStopFill />
                </Button>
                <Button
                  className="rounded-circle pb-2 mr-2"
                  style={btnShadow}
                  onClick={() => handelSkip('forward')}
                >
                  <AiFillStepForward />
                </Button>
                <Button
                  className="rounded-circle pb-2"
                  style={btnShadow}
                  onClick={handleToggleMute}
                >
                  {isMute ? <BsFillVolumeMuteFill /> : <BsFillVolumeUpFill />}
                </Button>
                <span className="text-primary ml-4">
                  {wavesurfer.current && currentTime + ' / ' + totalTime}
                </span>
              </Col>
              <Col xs="auto" className="text-primary mt-2">
                {name}
              </Col>
            </Row>
          </Card.Header>

          <Card.Body className="text-muted">
            <Row className="justify-content-between">
              <Col>Volume</Col>
              <Col>
                <Form inline>
                  <Form.Group className="ml-auto">
                    <span className="mr-2">
                      <ImVolumeDecrease />
                    </span>
                    <Form.Control
                      type="range"
                      style={{ width: '200px' }}
                      min="0.01" // waveSurfer recognize value of `0` same as `1` so we need to set some zero-ish value for silence
                      max="1"
                      step=".025"
                      onChange={onVolumeChange}
                      defaultValue={volume}
                      disabled={isMute}
                    />
                    <span className="ml-2">
                      <ImVolumeIncrease />
                    </span>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row className="justify-content-between mt-3">
              <Col>Zoom : {zoom}</Col>
              <Col>
                <Form inline>
                  <Form.Group className="ml-auto">
                    <span className="mr-2">
                      <AiOutlineZoomOut />
                    </span>
                    <Form.Control
                      type="range"
                      min="0"
                      max="200"
                      step="5"
                      value={zoom}
                      onChange={handelZoom}
                      style={{ width: '200px' }}
                    />
                    <span className="ml-2">
                      <AiOutlineZoomIn />
                    </span>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row className="justify-content-between mt-3">
              <Col>Play Back Rate : {playBack}x</Col>
              <Col>
                <Form inline>
                  <Form.Group className="ml-auto">
                    <span className="mr-2">0.5x</span>
                    <Form.Control
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.5"
                      value={playBack}
                      onChange={handelPlayBack}
                      style={{ width: '200px' }}
                    />
                    <span className="ml-2">2x</span>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Card>
    </div>
  );
}

export default forwardRef(WaveAudioPlayerFL);

WaveAudioPlayerFL.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
