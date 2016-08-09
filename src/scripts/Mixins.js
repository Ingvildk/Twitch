'use strict';

import React from 'react';
import Moment from 'moment';
import Loader from './Loader';
import Progress from './Progress';
var sprintf = require("sprintf-js").sprintf;

const Render = {
  renderLoader(props) {
    return (<Loader {...props} />);
  },

  renderProgress(props) {
    return (<Progress {...props} />);
  },

  renderFragment(page, fragment) {
    return (
      <div className={page}>
        {fragment}
      </div>
    );
  },

  renderError(msg) {
    return (
      <div className="error">
        <p>Error in connection</p>
      </div>
    );
  }
};

const Meta = {
  handleShortenText(text, maxLength) {
    var ret = text;
    if (ret.length > maxLength) {
      ret = ret.substr(0, maxLength-3) + '...';
    }
    return ret;
  },

  handleDuration(duration) {
    duration = parseInt(duration);
    var hours = Math.floor(duration / (60 * 60));
    var minutes = Math.floor(duration / 60 % 60);
    var seconds = duration - hours * 60 * 60 - minutes * 60;

    var length = sprintf("%02d:%02d:%02d", hours, minutes, seconds);
    return length;
  },

  handlePublishedAt(date) {
    return Moment(date).fromNow();
  },

  handleViewCount(num) {
    var viewCount = parseInt(num / Math.pow(10, 6));
    if(viewCount > 0){
      return viewCount + 'M views';
    }
    return parseInt(num).toLocaleString() + ' views';
  },

  handleSize(bytes){
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'N/A';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  },
};

export default {
  MetaMixin: Meta,
  RenderMixin: Render
}
