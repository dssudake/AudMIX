import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Card, Form } from 'react-bootstrap';

import WaveSurfer from 'wavesurfer.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';

import { BsPlayFill, BsPauseFill, BsFillVolumeUpFill, BsFillVolumeMuteFill } from 'react-icons/bs';
import { AiOutlineSound } from 'react-icons/ai';

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
  ],
});

// eslint-disable-next-line react/prop-types
export default function WaveAudioPlayer({ url, name }) {
  const waveformRef = useRef(null);
  const timelineRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [volume, setVolume] = useState(0.5);

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
        console.log(wavesurfer.current.getDuration());
        setVolume(volume);
      }
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

      <Card className="rounded-bottom bg-dark border-0">
        <Card.Body>
          <Row className="justify-content-between">
            <Col>
              <Button
                className="rounded-circle pb-2 mr-3"
                style={btnShadow}
                onClick={handlePlayPause}
              >
                {!playing ? <BsPlayFill /> : <BsPauseFill />}
              </Button>
              <Button className="rounded-circle pb-2" style={btnShadow} onClick={handleToggleMute}>
                {isMute ? <BsFillVolumeMuteFill /> : <BsFillVolumeUpFill />}
              </Button>
            </Col>

            <Col>
              <Form inline>
                <Form.Group className="text-primary ml-auto mt-2 h5">
                  <Form.Label>
                    <AiOutlineSound /> &ensp;
                  </Form.Label>
                  <Form.Control
                    type="range"
                    style={{ width: '130px' }}
                    min="0.01" // waveSurfer recognize value of `0` same as `1` so we need to set some zero-ish value for silence
                    max="1"
                    step=".025"
                    onChange={onVolumeChange}
                    defaultValue={volume}
                    className="text-dark"
                    disabled={isMute}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Card.Text className="text-center text-muted">{name}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

WaveAudioPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
