import os
import numpy as np
import scipy
import librosa
import librosa.display
import noisereduce as nr
import soundfile as sf

from django.conf import settings
from processAPI.apps import ProcessapiConfig


class FeatureExtractor:
    def __init__(self, audio, *, windowLength, overlap, sample_rate):
        self.audio = audio
        self.ffT_length = windowLength
        self.window_length = windowLength
        self.overlap = overlap
        self.sample_rate = sample_rate
        self.window = scipy.signal.hamming(self.window_length, sym=False)

    def get_stft_spectrogram(self):
        return librosa.stft(self.audio, n_fft=self.ffT_length, win_length=self.window_length, hop_length=self.overlap,
                            window=self.window, center=True)

    def get_audio_from_stft_spectrogram(self, stft_features):
        return librosa.istft(stft_features, win_length=self.window_length, hop_length=self.overlap,
                             window=self.window, center=True)

    def get_mel_spectrogram(self):
        return librosa.feature.melspectrogram(self.audio, sr=self.sample_rate, power=2.0, pad_mode='reflect',
                                              n_fft=self.ffT_length, hop_length=self.overlap, center=True)

    def get_audio_from_mel_spectrogram(self, M):
        return librosa.feature.inverse.mel_to_audio(M, sr=self.sample_rate, n_fft=self.ffT_length, hop_length=self.overlap,
                                                    win_length=self.window_length, window=self.window,
                                                    center=True, pad_mode='reflect', power=2.0, n_iter=32, length=None)


def dl_noise_reduce(audio_id, folder_path, file_path, progress_recorder):
    windowLength = 256
    overlap = round(0.25 * windowLength)  # overlap of 75%
    ffTLength = windowLength
    fs = 16e3
    numFeatures = ffTLength//2 + 1
    numSegments = 8

    def prepare_input_features(stft_features):
        noisySTFT = np.concatenate(
            [stft_features[:, 0:numSegments-1], stft_features], axis=1)
        stftSegments = np.zeros(
            (numFeatures, numSegments, noisySTFT.shape[1] - numSegments + 1))
        for index in range(noisySTFT.shape[1] - numSegments + 1):
            stftSegments[:, :, index] = noisySTFT[:, index:index + numSegments]
        return stftSegments

    def read_audio(filepath, sample_rate, normalize=True):
        audio, sr = librosa.load(filepath, sr=sample_rate)
        if normalize:
            div_fac = 1 / np.max(np.abs(audio)) / 3.0
            audio = audio * div_fac
        return audio, sr

    def revert_features_to_audio(features, phase, cleanMean=None, cleanStd=None):
        if cleanMean and cleanStd:
            features = cleanStd * features + cleanMean
        phase = np.transpose(phase, (1, 0))
        features = np.squeeze(features)
        features = features * np.exp(1j * phase)
        features = np.transpose(features, (1, 0))
        return noiseAudioFeatureExtractor.get_audio_from_stft_spectrogram(features)

    model = ProcessapiConfig.model
    progress_recorder.set_progress(10, 100)

    noisyAudio, sr = read_audio(file_path, sample_rate=fs)

    noiseAudioFeatureExtractor = FeatureExtractor(
        noisyAudio, windowLength=windowLength, overlap=overlap, sample_rate=sr)
    noise_stft_features = noiseAudioFeatureExtractor.get_stft_spectrogram()
    progress_recorder.set_progress(20, 100)

    noisyPhase = np.angle(noise_stft_features)
    print(noisyPhase.shape)
    noise_stft_features = np.abs(noise_stft_features)

    mean = np.mean(noise_stft_features)
    std = np.std(noise_stft_features)
    noise_stft_features = (noise_stft_features - mean) / std

    predictors = prepare_input_features(noise_stft_features)
    progress_recorder.set_progress(35, 100)

    predictors = np.reshape(
        predictors, (predictors.shape[0], predictors.shape[1], 1, predictors.shape[2]))
    predictors = np.transpose(predictors, (3, 0, 1, 2)).astype(np.float32)
    print('predictors.shape:', predictors.shape)
    progress_recorder.set_progress(45, 100)

    STFTFullyConvolutional = model.predict(predictors)
    print(STFTFullyConvolutional.shape)
    progress_recorder.set_progress(70, 100)

    denoisedAudioFullyConvolutional = revert_features_to_audio(
        STFTFullyConvolutional, noisyPhase, mean, std)
    print("Min:", np.min(denoisedAudioFullyConvolutional),
          "Max:", np.max(denoisedAudioFullyConvolutional))

    noisy_part = denoisedAudioFullyConvolutional[0:len(
        denoisedAudioFullyConvolutional)//15]

    # Perform noise reduction after model noise reduction
    reduced_noise = nr.reduce_noise(
        audio_clip=denoisedAudioFullyConvolutional, noise_clip=noisy_part, verbose=False)
    print(type(reduced_noise))
    progress_recorder.set_progress(85, 100)

    # Save Audio
    op_file_path = os.path.join(folder_path, 'audio_processed_denoised.wav')
    sf.write(op_file_path, reduced_noise, 16000)

    op_file_path_rel = os.path.join(
        settings.AUDIO_PROCESSING_ROOT, audio_id, 'audio_processed_denoised.wav')

    return op_file_path_rel
