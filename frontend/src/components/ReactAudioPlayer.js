import React from 'react';
import PropTypes from 'prop-types';

import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import '../styles/audio_h5_player.css';

export default function ReactAudioPlayer({ src }) {
  return (
    <AudioPlayer
      width={600}
      src={src}
      showJumpControls={false}
      customVolumeControls={[]}
      customAdditionalControls={[]}
    />
  );
}

ReactAudioPlayer.propTypes = {
  src: PropTypes.string,
};
