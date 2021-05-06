# pull official base image
FROM python:3.8.3-alpine

# install ffmpeg with linux static build
ARG FFMPEGV=4.2.2
RUN wget -q https://www.johnvansickle.com/ffmpeg/old-releases/ffmpeg-${FFMPEGV}-amd64-static.tar.xz \
    && tar xJf ffmpeg-${FFMPEGV}-amd64-static.tar.xz \
    && mv ffmpeg-${FFMPEGV}-amd64-static/ffmpeg /usr/local/bin/ \
    && rm -rf ffmpeg-${FFMPEGV}-amd64-static \
    && rm ffmpeg-${FFMPEGV}-amd64-static.tar.xz

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy entrypoint.sh
COPY ./entrypoint.sh .

# copy project
COPY . .

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]