import React from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';

import './../../../styles/Player.css';
import dummyData from './../../../assets/constants';

export class Player extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUrl: '',
      playingUrl: '',
      audio: null,
      playing: false,
      progress: 0,
      is_set_progress_mode: false,
      message: ''
    };
    this.is_progress_dirty = false;
    this.registered_events = false;
  }
  
  playAudio(currentUrl) {
    let audio = this.refs.myAudio;
    if (!this.state.playing) {
      audio.play();
      this.setState({
        playingUrl: currentUrl,
        playing: true,
        audio
      });
    } else {
      if (this.state.playingUrl === currentUrl) {
        this.state.audio.pause();
        this.setState({
          playing: false
        });
      } else {
        this.state.audio.pause();
        audio.play();
        this.setState({
          playing: true,
          playingUrl: currentUrl,
          audio
        });
      }
    }
  }

  playPrevAudio() {
    for (let i = 0; i < dummyData.length; i++) {
      if (this.state.currentUrl === dummyData[i]) {
        if (i) {
          this.setState({
            message: ''
          });
          return dummyData[i - 1];
        } else {
          this.setState({
            message: 'Prev track doesn\'t exist'
          });
          return this.state.currentUrl;
        }
      }
    }
  }

  playNextAudio() {
    for (let i = 0; i < dummyData.length; i++) {
      if (this.state.currentUrl === dummyData[i]) {
        if (i == dummyData.length - 1) {
          this.setState({
            message: 'Next track doesn\'t exist'
          });
          return this.state.currentUrl;
        } else {
          this.setState({
            message: ''
          });
          return dummyData[i + 1];
        }
      }
    }
  }

  startSetProgress = (e) => {
    if (this.state.currentUrl) {
      this.setState({
        is_set_progress_mode: true
      });
      this.setProgress(e);
    } else {
      this.setState({
        message: 'You should choose at least one track'
      });
    }
  };

  stopSetProgress = (e) => {
    this.setState({
      is_set_progress_mode: false
    });
    this.setProgress(e);
  };

  setProgress = (e) => {
    if (this.state.is_set_progress_mode) {
      let progress = (e.clientX - offsetLeft(this.refs.bar_progress)) /
        (this.refs.bar_progress.clientWidth);
      this.setState({
        progress,
      });
      this.is_progress_dirty = true;
    }
  };
  
  render() {

    let audio = this.refs.myAudio;
    let currentTime = 0;
    let totalTime = 0;
    let temp = this.state.currentUrl.slice(this.state.currentUrl.lastIndexOf('/') + 1,
      this.state.currentUrl.lastIndexOf('.'));
    
    if (this.state.currentUrl) {
      for (let i = 0; i < document.getElementsByClassName('list-group-item').length; i++) {
        if (document.getElementsByClassName('list-group-item')[i].innerHTML.lastIndexOf(temp) > 0) {
          document.getElementsByClassName('list-group-item')[i].setAttribute('style', 'color: #28849b');
        } else {
          document.getElementsByClassName('list-group-item')[i].setAttribute('style', 'color: #ffffff');
        }
      }
    }

    const eventListAdd = () => {
      this.refs.myAudio.addEventListener('timeupdate', eventList);
    };

    const remEventList = () => {
      this.refs.myAudio.removeEventListener('timeupdate', eventList);
    };

    const eventList = () => {
      if (!this.is_progress_dirty) {
        this.setState({
          progress: this.refs.myAudio.currentTime / this.refs.myAudio.duration
        });
      }
      for (let i = 0; i < document.
        getElementsByClassName('list-group-item').length; i++) {
        document.getElementsByClassName('list-group-item')[i].
          addEventListener('click', remEventList);
      }
    };
    
    if (audio) {

      if (audio.currentSrc !== this.state.currentUrl) {
        audio.src = this.state.currentUrl;
      }

      if (this.state.playing && this.state.currentUrl && audio.currentTime) {
        this.refs.play_button.src = require('./../../../assets/pause.svg');
      } else {
        this.refs.play_button.src = require('./../../../assets/play-button.svg');
      }

      if (this.is_progress_dirty) {
        this.is_progress_dirty = false;
        audio.currentTime = audio.duration * this.state.progress;
      }

      if (this.registered_events !== audio && this.state.currentUrl) {
        this.registered_events = audio;
        this.refs.play_button.addEventListener('click', eventListAdd);
        this.refs.prev_button.addEventListener('click', remEventList);
        this.refs.next_button.addEventListener('click', remEventList);
      }

      currentTime = audio.currentTime;
      totalTime = audio.duration;

    }

    return (
      <Grid>
        <Row>
          <Col xs={12} sm={12} md={12}>
            <div className='music_box'>
              <h3>Music Box</h3>
              <Col xs={4} sm={4} md={4}>
                <Button
                  onClick={
                    () => {
                      if (this.state.currentUrl) {
                        this.setState({
                          currentUrl: this.playPrevAudio()
                        });
                      } else {
                        this.setState({
                          message: 'You should choose at least one track'
                        });
                      }
                    }
                  }
                >
                  <img
                    ref='prev_button'
                    className='play-button'
                    src={require('./../../../assets/play-previous.svg')}
                    alt='prev_previous'
                  />
                </Button>
                <Button
                  onClick={
                    () => {
                      if (this.state.currentUrl) {
                        this.playAudio(this.state.currentUrl);
                      } else {
                        this.setState({
                          message: 'You should choose at least one track'
                        });
                      }
                    }
                  }
                >
                <img
                  ref='play_button'
                  className='play-button'
                  src={require('./../../../assets/play-button.svg')}
                  alt='play_button'
                />
                </Button>
                <Button
                  onClick={
                    () => {
                      if (this.state.currentUrl) {
                        this.setState({
                          currentUrl: this.playNextAudio()
                        });
                      } else {
                        this.setState({
                          message: 'You should choose at least one track'
                        });
                      }
                    }
                  }
                >
                  <img
                    ref='next_button'
                    className='play-button'
                    src={require('./../../../assets/play-next.svg')}
                    alt='play_next'
                  />
                </Button>
                <audio ref='myAudio'>
                  <source src={this.state.currentUrl} />
                </audio>
              </Col>
              <Col xs={6} sm={6} md={6}>
                <div
                  className='bar'
                  onMouseDown={this.startSetProgress}
                  onMouseMove={this.setProgress}
                  onMouseLeave={this.stopSetProgress}
                  onMouseUp={this.stopSetProgress}
                >
                  <div ref='bar_progress' className='progress'>
                    <div style={{width: (this.state.progress) * 100 + '%'}}></div>
                  </div>
                </div>
                <div className='message'>{this.state.message}</div>
              </Col>
              <Col xs={2} sm={2} md={2}>
                <div className='time'>{`${formatTime(currentTime)} /
                  ${this.state.currentUrl && formatTime(totalTime) ||
                    'click play'}`}</div>
              </Col>
              <Col xs={12} sm={12} md={12}>
                <div className='artist_track'>
                  <h4>Track</h4>
                  <ul className='list-group'>
                    {dummyData.map((source, id) => {
                          return (
                            <div key={id}>
                              <audio ref={id}>
                                <source src={source} />
                              </audio>
                              <li
                                ref='track_button'
                                className='list-group-item'
                                onClick={() => {
                                  this.setState({
                                    currentUrl: source,
                                    message: ''
                                  });
                                }}>
                                  <span className='info_track_name'>
                                    {`${source.slice(source.lastIndexOf('/') + 1,
                                      source.lastIndexOf('.'))}`}
                                  </span>
                                  <span className='info_track_duration'>
                                    {`${this.refs[id] && formatTime(this.refs[id].duration) || ''}`}
                                  </span>
                              </li>
                            </div>
                          );
                        })}
                  </ul>
                </div>
              </Col>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const offsetLeft = (el) => {
  let left = 0;
  while (el && el !== document) {
    left += el.offsetLeft;
    el = el.offsetParent;
  }
  return left;
};

const formatTime = (sec) => {
  let total_seconds = Math.floor(sec);
  let minutes = formatTimeMapping(Math.floor(total_seconds / 60));
  let seconds = formatTimeMapping(Math.floor(total_seconds - minutes * 60));
  if (!minutes && !seconds) {
    return false;
  } else {
    return `${minutes}:${seconds}`;
  }
};

const formatTimeMapping = (num) => {
  if (num != num) {
    return false;
  } else {
    let str = num + '';
    if (str.length < 2) {
      return 0 + str;
    } else {
      return str;
    }
  }
};
