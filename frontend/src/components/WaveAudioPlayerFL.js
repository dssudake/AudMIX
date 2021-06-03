import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Button, Card, Form, Dropdown } from 'react-bootstrap';

import WaveSurfer from 'wavesurfer.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';

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
import { FaRegFileAudio } from 'react-icons/fa';
import { ImVolumeDecrease, ImVolumeIncrease } from 'react-icons/im';

const formWaveSurferOptions = (ref, reftl) => ({
  container: ref,
  waveColor: '#3e3e3e',
  progressColor: '#95bf9b90',
  cursorColor: '#80b387',
  minPxPerSec: 5,
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
    RegionsPlugin.create({
      dragSelection: false,
      maxRegions: 3,
    }),
  ],
});

// eslint-disable-next-line react/prop-types
function WaveAudioPlayerFL({ audData, url, name, handelSetData, isCrop, reset }, ref) {
  const waveformRef = useRef(null);
  const timelineRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [zoom, setZoom] = useState(5);
  const [playBack, setPlayBack] = useState(1);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('0:00');

  const [number, setNumber] = useState(0);
  const [segments, setSegments] = useState([
    [0, 0],
    [0, 0],
    [0, 0],
  ]);

  const setRegionOptions = (no, start, end) => ({
    id: no,
    start: start,
    end: end,
    loop: true,
    drag: true,
    color: '#e6e08633',
    resize: true,
    preventContextMenu: true,
    showTooltip: false,
    attributes: {
      label: 'Segment No : ' + no,
    },
  });

  var updateLabel = function (region) {
    var segmentsData = segments;
    segmentsData[Number(region.id) - 1] = [region.start, region.end];
    setSegments(segmentsData);
  };
  // reset(false);

  const setNumberRegion = (no) => {
    var segmentsData = segments;
    wavesurfer.current.clearRegions();
    var waveTime = wavesurfer.current.getDuration().toFixed(0);
    switch (no) {
      case 1:
        setNumber(1);
        wavesurfer.current.addRegion(setRegionOptions('1', waveTime / 10, 2 * (waveTime / 10)));
        segmentsData[1] = [0, 0];
        segmentsData[2] = [0, 0];
        break;

      case 2:
        setNumber(2);
        wavesurfer.current.addRegion(setRegionOptions('1', waveTime / 10, 2 * (waveTime / 10)));
        wavesurfer.current.addRegion(
          setRegionOptions('2', 3 * (waveTime / 10), 4 * (waveTime / 10))
        );
        segmentsData[2] = [0, 0];
        break;

      case 3:
        setNumber(3);
        wavesurfer.current.addRegion(
          setRegionOptions('1', 1 * (waveTime / 10), 2 * (waveTime / 10))
        );
        wavesurfer.current.addRegion(
          setRegionOptions('2', 3 * (waveTime / 10), 4 * (waveTime / 10))
        );
        wavesurfer.current.addRegion(
          setRegionOptions('3', 5 * (waveTime / 10), 6 * (waveTime / 10))
        );
        break;
    }
    setSegments(segmentsData);
  };

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
      handelRemoveRegions() {
        wavesurfer.current.clearRegions();
        setNumber(0);
        setSegments([
          [0, 0],
          [0, 0],
          [0, 0],
        ]);
      },
      handelAddRegion() {
        setNumberRegion(1);
      },
      handelGetSegements() {
        return segments;
      },
    }),
    []
  );

  const convertTime = (time) => {
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    if (seconds < 10) return `${minutes}:0${seconds}`;
    else return `${minutes}:${seconds}`;
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

    wavesurfer.current.on('region-created', updateLabel);
    wavesurfer.current.on('region-updated', updateLabel);
    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    if (
      url.includes('audio.mp3') ||
      url.includes('audio_processed_denoised.wav') ||
      url.includes('vocals.mp3') ||
      url.includes('accompaniment.mp3')
    )
      reset(true);
    else reset(false);
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
                {audData && (
                  <Dropdown>
                    <Dropdown.Toggle block variant="outline-primary">
                      <FaRegFileAudio />
                      &nbsp; {name}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {audData.audio && (
                        <Dropdown.Item
                          onClick={() => handelSetData(audData.audio, 'Original Audio')}
                          className={name === 'Original Audio' ? 'active' : ''}
                        >
                          Original Audio
                        </Dropdown.Item>
                      )}
                      {audData.denoised_audio && (
                        <Dropdown.Item
                          onClick={() => handelSetData(audData.denoised_audio, 'Denoised Audio')}
                          className={name === 'Denoised Audio' ? 'active' : ''}
                        >
                          Denoised Audio
                        </Dropdown.Item>
                      )}
                      {audData.vocals_audio && (
                        <Dropdown.Item
                          onClick={() => handelSetData(audData.vocals_audio, 'Vocals Only')}
                          className={name === 'Vocals Only' ? 'active' : ''}
                        >
                          Vocals Only
                        </Dropdown.Item>
                      )}
                      {audData.music_audio && (
                        <Dropdown.Item
                          onClick={() => handelSetData(audData.music_audio, 'Music only')}
                          className={name === 'Music only' ? 'active' : ''}
                        >
                          Music only
                        </Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </Col>
            </Row>
          </Card.Header>

          <Card.Body className="text-muted">
            {isCrop && (
              <Row className="justify-content-between mb-3">
                <Col xs={8}>Crop Intervals</Col>
                <Col xs={4} className="text-right">
                  <Dropdown>
                    <Dropdown.Toggle size="sm" className="w-10" variant="outline-secondary">
                      No of Intervals : {number}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => setNumberRegion(1)}
                        className={number === 1 ? 'active' : ''}
                      >
                        1
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() => setNumberRegion(2)}
                        className={number === 2 ? 'active' : ''}
                      >
                        2
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() => setNumberRegion(3)}
                        className={number === 3 ? 'active' : ''}
                      >
                        3
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            )}

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
                      step=".015"
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
  audData: PropTypes.object,
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isCrop: PropTypes.boolean,
  handelSetData: PropTypes.func,
  reset: PropTypes.func,
};
