import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Button, Card, Form, Dropdown } from 'react-bootstrap';

import WaveSurfer from 'wavesurfer.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.js';
import { FaRegFileAudio } from 'react-icons/fa';
import { BsPlayFill, BsPauseFill, BsFillVolumeUpFill, BsFillVolumeMuteFill } from 'react-icons/bs';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import { ImVolumeDecrease, ImVolumeIncrease } from 'react-icons/im';
const formWaveSurferOptions = (ref, reftl) => ({
  container: ref,
  waveColor: '#3e3e3e',
  progressColor: '#95bf9b90',
  cursorColor: '#80b387',
  minPxPerSec: 1,
  scrollParent: true,
  // autoCenter: true,
  // autoCenterImmediately: false,
  // hideScrollbar: true,
  barWidth: 2,
  // barRadius: 3,
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

    RegionsPlugin.create({
      dragSelection: false,
      maxRegions: 3,
    }),
  ],
});
// eslint-disable-next-line react/prop-types
export default function WaveAudioPlayerCrop({ url, name, handelSetData, audData, up }) {
  const waveformRef = useRef(null);
  const timelineRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [zoom, setZoom] = useState(30);
  const [playBack, setPlayBack] = useState(1);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('0:00');
  const [number, setnumber] = useState(1);

  const [Reg1Start, setReg1Start] = useState(0);
  const [Reg1End, setReg1End] = useState(0);
  const [Reg2Start, setReg2Start] = useState(0);
  const [Reg2End, setReg2End] = useState(0);
  const [Reg3Start, setReg3Start] = useState(0);
  const [Reg3End, setReg3End] = useState(0);
  const [waveTime, setwaveTime] = useState(0);

  const convertTime = (time) => {
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    if (seconds < 10) return `${minutes}:0${seconds}`;
    else return `${minutes}:${seconds}`;
  };
  var RegionOptions = {};
  const setRegionOptions = (no, starting, ending) => {
    RegionOptions = {
      id: no,
      start: starting,
      end: ending,
      loop: true,
      drag: true,
      color: '#e6e08633',
      resize: true,
      preventContextMenu: true,
      showTooltip: false,
      attributes: {
        label: 'Segment No : ' + no,
      },
    };
  };
  var updateLabel = function (region) {
    if (region.id === '1') {
      setReg1Start(region.start);
      setReg1End(region.end);
    } else if (region.id === '2') {
      setReg2Start(region.start);
      setReg2End(region.end);
    } else if (region.id === '3') {
      setReg3Start(region.start);
      setReg3End(region.end);
    }
    // if (region.attributes.nextRegion && region.end > region.attributes.nextRegion.start) {
    //   region.end = region.attributes.nextRegion.start;
    // }
    // if (region.attributes.backRegion && region.start < region.attributes.backRegion.end) {
    //   region.start = region.attributes.backRegion.end;
    // }
  };
  const region = (no) => {
    switch (no) {
      case 1:
        setnumber(1);
        wavesurfer.current.clearRegions();
        setRegionOptions('1', waveTime / 10, 2 * (waveTime / 10));
        wavesurfer.current.addRegion(RegionOptions);
        setReg2Start(0);
        setReg2End(0);
        setReg3Start(0);
        setReg3End(0);

        break;
      case 2:
        setnumber(2);
        wavesurfer.current.clearRegions();
        setRegionOptions('1', waveTime / 10, 2 * (waveTime / 10));
        wavesurfer.current.addRegion(RegionOptions);
        setRegionOptions('2', 3 * (waveTime / 10), 4 * (waveTime / 10));
        wavesurfer.current.addRegion(RegionOptions);
        setReg3Start(0);
        setReg3End(0);
        break;
      case 3:
        setnumber(3);
        wavesurfer.current.clearRegions();
        setRegionOptions('1', 1 * (waveTime / 10), 2 * (waveTime / 10));
        wavesurfer.current.addRegion(RegionOptions);
        setRegionOptions('2', 3 * (waveTime / 10), 4 * (waveTime / 10));
        wavesurfer.current.addRegion(RegionOptions);
        setRegionOptions('3', 5 * (waveTime / 10), 6 * (waveTime / 10));
        wavesurfer.current.addRegion(RegionOptions);
        break;
    }
  };
  // Post the results to backend
  const display = () => {
    console.log('1 : ' + Reg1Start.toFixed(2) + '/' + Reg1End.toFixed(2));
    console.log('2 : ' + Reg2Start.toFixed(2) + '/' + Reg2End.toFixed(2));
    console.log('3 : ' + Reg3Start.toFixed(2) + '/' + Reg3End.toFixed(2));
  };
  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current, timelineRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(url);

    wavesurfer.current.on('ready', function () {
      wavesurfer.current.on('region-created', updateLabel);
      wavesurfer.current.on('region-updated', updateLabel);
      setwaveTime(wavesurfer.current.getDuration().toFixed(0));
      setRegionOptions(
        '1',
        wavesurfer.current.getDuration().toFixed(0) / 10,
        2 * (wavesurfer.current.getDuration().toFixed(0) / 10)
      );
      wavesurfer.current.addRegion(RegionOptions);

      if (wavesurfer.current) {
        wavesurfer.current.setVolume(1);
        setIsMute(false);
        setVolume(volume);
        setTotalTime(convertTime(wavesurfer.current.getDuration().toFixed(0)));
      }
    });
    wavesurfer.current.on('audioprocess', function () {
      if (wavesurfer.current.isPlaying()) {
        setCurrentTime(convertTime(wavesurfer.current.getCurrentTime().toFixed(0)));
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
      <Card ref={waveformRef} className="rounded-top bg-dark border-0" />
      <Card ref={timelineRef} className="rounded-top bg-dark border-0" />

      <Card className="bg-dark border-0 py-2">
        <Card className="bg-dark border-0">
          <Card.Header>
            <Row>
              <Col xs={4}>
                <Button
                  className="rounded-circle pb-2 mr-3"
                  style={btnShadow}
                  onClick={handlePlayPause}
                >
                  {!playing ? <BsPlayFill /> : <BsPauseFill />}
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
              <Col xs={4} style={{ textAlign: 'center' }}>
                {audData && (
                  <Dropdown drop={up ? 'up' : 'down'}>
                    <Dropdown.Toggle className="w-75" variant="outline-secondary">
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
              <Col xs={4} style={{ textAlign: 'right' }}>
                <Button variant="outline-primary" onClick={() => display()}>
                  Crop Audio Segments
                </Button>
              </Col>
            </Row>
          </Card.Header>

          <Card.Body className="text-muted">
            <Row className="justify-content-between">
              <Col xs={9}>Number of Crop Segments </Col>
              <Col xs={3} className="pl-4">
                <Dropdown>
                  <Dropdown.Toggle className="w-10" variant="outline-secondary">
                    No. of Segments : {number}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => region(1)}
                      className={number === 1 ? 'active' : ''}
                    >
                      1
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() => region(2)}
                      className={number === 2 ? 'active' : ''}
                    >
                      2
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() => region(3)}
                      className={number === 3 ? 'active' : ''}
                    >
                      3
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
            <Row className="justify-content-between mt-3">
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

WaveAudioPlayerCrop.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handelSetData: PropTypes.func,
  audData: PropTypes.object,
  up: PropTypes.bool,
};
