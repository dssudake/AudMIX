<h1 align="center">
  <a href="https://github.com/dssudake/AudMIX"><img src="./assets/banner.png" width=800 alt="AudMIX"></a>
</h1>

<h2 align="center"> 
  Audio Processing on Cloud using Deep Learning
</h2>

## Installation

### Basic Setup

- [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/) will be required for running application.
- Make sure that you install both of them specific to your OS and version (Linux, Windows, Mac)
- `git clone https://github.com/dssudake/AudMIX.git`
- `cd AudMIX`

### Development Environment

```bash
# Build the latest images
docker-compose build

# Start the application
docker-compose up

        or

# Add -d flag to run everything in the background
docker-compose up -d
```

Then you can hit http://localhost:3000 in your browser to view frontend and access backend with http://localhost:8000
