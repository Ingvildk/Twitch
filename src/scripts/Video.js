'use strict';

import React from 'react/addons';
import {Navigation} from 'react-router';
import Actions from './Actions';
import {RenderMixin} from './Mixins';
import VideoImage from './VideoImage';
import VideoTitle from './VideoTitle';
import VideoMeta from './VideoMeta';
import VideoDuration from './VideoDuration';

const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin, RenderMixin, Navigation],

  isLiveVideo(item){
    let broadcastContent = item.snippet.liveBroadcastContent;
    return (broadcastContent === 'live' || broadcastContent === 'upcoming');
  },

  handleDownload(){
    Actions.prompt(this.props.video);
  },


  renderDelete() {
    return (
      <div className="video-detail">
        <p>Deleted video</p>
      </div>
    );
  },

  renderVideo(item) {
      var views = item.views.toString();
    return (
      <div className="video-detail" onClick={this.handleDownload}>
        <div className="video-image">
          <VideoImage title={item.title} src={item.preview} />
          <VideoDuration duration={item.length} />
        </div>
        <div className="video-content">
            <VideoTitle title={item.title} />
            <VideoMeta 
              channel={item.channel.name} 
              views={views} 
              published={item.recorded_at}
              game={item.game.name} />
        </div>
      </div>
    );
  },

  render() {
    let video = this.props.video;
    let fragment = this.renderVideo(video);

    return this.renderFragment('video', fragment);

  }
});
